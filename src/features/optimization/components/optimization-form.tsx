"use client";

import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { paths } from "@/config/paths";
import { useApiErrorMessage } from "@/hooks/use-api-error-message";
import { useMe } from "@/lib/auth";
import type { OptimizationSolver, OptimizationWeights } from "@/types/api";

import { useCreateRun } from "../api/create-run";
import { useOptimizationTargets } from "../api/get-targets";

/** 重みは数式の係数ではなく業務用語で提示する（docs/optimization.md） */
const WEIGHT_ITEMS: { key: keyof OptimizationWeights; label: string; description: string }[] = [
  { key: "desire", label: "希望を重視", description: "利用者の希望職種との一致を優先します" },
  { key: "skill", label: "スキルを重視", description: "必要スキルとの一致を優先します" },
  {
    key: "fairness",
    label: "公平性を重視",
    description: "実習機会が少ない利用者を優先します",
  },
  {
    key: "rotation",
    label: "新しい経験を重視",
    description: "未経験の実習先への割当を優先します",
  },
];

const DEFAULT_WEIGHTS: OptimizationWeights = {
  desire: 1.0,
  skill: 0.8,
  fairness: 0.5,
  rotation: 0.3,
};

function CheckboxList({
  legend,
  items,
  selected,
  onChange,
}: {
  legend: string;
  items: { id: string; label: string; hint?: string }[];
  selected: Set<string>;
  onChange: (next: Set<string>) => void;
}) {
  const allSelected = items.length > 0 && items.every((item) => selected.has(item.id));
  return (
    <fieldset>
      <div className="mb-2 flex items-center justify-between">
        <legend className="text-sm font-medium">{legend}</legend>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={() => onChange(allSelected ? new Set() : new Set(items.map((i) => i.id)))}
        >
          {allSelected ? "すべて解除" : "すべて選択"}
        </Button>
      </div>
      <ul className="bg-card max-h-64 space-y-1 overflow-y-auto rounded-lg border p-2">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-2 rounded-md px-2 py-1.5">
            <Checkbox
              id={`target-${item.id}`}
              checked={selected.has(item.id)}
              onCheckedChange={(checked) => {
                const next = new Set(selected);
                if (checked === true) next.add(item.id);
                else next.delete(item.id);
                onChange(next);
              }}
            />
            <label htmlFor={`target-${item.id}`} className="flex-1 cursor-pointer text-sm">
              {item.label}
            </label>
            {item.hint ? <span className="text-muted-foreground text-xs">{item.hint}</span> : null}
          </li>
        ))}
      </ul>
    </fieldset>
  );
}

export function OptimizationForm() {
  const router = useRouter();
  const errorMessage = useApiErrorMessage();
  const { data: me } = useMe();
  const { data: targets, isPending } = useOptimizationTargets();
  const createMutation = useCreateRun();

  const [participantIds, setParticipantIds] = useState<Set<string>>(new Set());
  const [companyIds, setCompanyIds] = useState<Set<string>>(new Set());
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [weights, setWeights] = useState<OptimizationWeights>(DEFAULT_WEIGHTS);
  const [solver, setSolver] = useState<OptimizationSolver>("sa");

  if (isPending) return <Skeleton className="h-96 w-full max-w-3xl" />;

  const isValid =
    participantIds.size > 0 &&
    companyIds.size > 0 &&
    periodStart !== "" &&
    periodEnd !== "" &&
    periodEnd >= periodStart;

  async function onSubmit() {
    try {
      const run = await createMutation.mutateAsync({
        participantIds: [...participantIds],
        companyIds: [...companyIds],
        periodStart,
        periodEnd,
        solver,
        weights,
      });
      if (run.status === "SUCCEEDED") toast.success("割当候補を生成しました");
      router.push(paths.optimization.detail(run.id));
    } catch (error) {
      toast.error(errorMessage(error));
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <CheckboxList
          legend="対象の利用者"
          items={(targets?.participants ?? []).map((p) => ({
            id: p.id,
            label: p.name,
            hint: p.desiredOccupations.join("・") || undefined,
          }))}
          selected={participantIds}
          onChange={setParticipantIds}
        />
        <CheckboxList
          legend="対象の実習先"
          items={(targets?.companies ?? []).map((c) => ({
            id: c.id,
            label: c.name,
            hint: `定員 ${c.capacity} 名`,
          }))}
          selected={companyIds}
          onChange={setCompanyIds}
        />
      </div>

      <div className="grid max-w-md grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="period-start">実習開始日</FieldLabel>
          <Input
            id="period-start"
            type="date"
            value={periodStart}
            onChange={(e) => setPeriodStart(e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="period-end">実習終了日</FieldLabel>
          <Input
            id="period-end"
            type="date"
            value={periodEnd}
            onChange={(e) => setPeriodEnd(e.target.value)}
          />
        </Field>
      </div>
      {periodStart && periodEnd && periodEnd < periodStart ? (
        <p role="alert" className="text-destructive text-sm">
          終了日は開始日以降にしてください
        </p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">何を重視しますか</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {WEIGHT_ITEMS.map((item) => (
            <Field key={item.key}>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor={`weight-${item.key}`}>{item.label}</FieldLabel>
                <Badge variant="secondary" className="tabular-nums">
                  {weights[item.key].toFixed(1)}
                </Badge>
              </div>
              <Slider
                id={`weight-${item.key}`}
                aria-label={item.label}
                min={0}
                max={2}
                step={0.1}
                value={[weights[item.key]]}
                onValueChange={(value) => {
                  const next = Array.isArray(value) ? value[0] : value;
                  if (typeof next === "number") {
                    setWeights((current) => ({ ...current, [item.key]: next }));
                  }
                }}
              />
              <FieldDescription>{item.description}</FieldDescription>
            </Field>
          ))}
        </CardContent>
      </Card>

      <Field>
        <FieldLabel htmlFor="solver">計算方式</FieldLabel>
        <Select
          value={solver}
          onValueChange={(value) => value && setSolver(value as OptimizationSolver)}
        >
          <SelectTrigger id="solver" className="w-80">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sa">シミュレーテッドアニーリング（標準）</SelectItem>
            {me?.role === "admin" ? (
              <SelectItem value="dwave">量子アニーリング実機（管理者のみ・要設定）</SelectItem>
            ) : null}
          </SelectContent>
        </Select>
        <FieldDescription>
          通常は標準のままで問題ありません。提案はあくまで候補であり、最終判断は支援員が行います。
        </FieldDescription>
      </Field>

      <Button onClick={onSubmit} disabled={!isValid || createMutation.isPending}>
        <Sparkles aria-hidden className="size-4" />
        {createMutation.isPending ? "計算しています…" : "割当候補を生成する"}
      </Button>
    </div>
  );
}
