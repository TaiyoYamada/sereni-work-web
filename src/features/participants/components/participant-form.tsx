"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { TagField } from "@/components/shared/tag-field";
import { TextField } from "@/components/shared/text-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { paths } from "@/config/paths";
import { useApiErrorMessage } from "@/hooks/use-api-error-message";
import { useUnsavedChangesGuard } from "@/hooks/use-unsaved-changes-guard";
import type { Participant } from "@/types/api";

import { useCreateParticipant } from "../api/create-participant";
import { useUpdateParticipant } from "../api/update-participant";
import {
  languageOptions,
  participantFormSchema,
  toParticipantPayload,
  type ParticipantFormValues,
} from "../schemas/participant";

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <FieldGroup className="gap-5">{children}</FieldGroup>
      </CardContent>
    </Card>
  );
}

/** 作成・編集共用フォーム。participant を渡すと編集モード */
export function ParticipantForm({ participant }: { participant?: Participant }) {
  const router = useRouter();
  const errorMessage = useApiErrorMessage();
  const createMutation = useCreateParticipant();
  const updateMutation = useUpdateParticipant(participant?.id ?? "");
  const isEdit = participant !== undefined;

  const form = useForm<ParticipantFormValues>({
    resolver: zodResolver(participantFormSchema),
    mode: "onTouched",
    defaultValues: {
      name: participant?.name ?? "",
      kana: participant?.kana ?? "",
      email: participant?.email ?? "",
      preferredLanguage:
        (participant?.preferredLanguage as ParticipantFormValues["preferredLanguage"]) ?? "ja",
      desiredOccupations: participant?.desiredOccupations ?? [],
      skills: participant?.skills ?? [],
      strengths: participant?.strengths ?? "",
      weaknesses: participant?.weaknesses ?? "",
      accommodations: participant?.accommodations ?? [],
      commuteConditions: participant?.commuteConditions ?? "",
      needsTransport: participant?.needsTransport ?? false,
      notes: participant?.notes ?? "",
    },
  });

  useUnsavedChangesGuard(form.formState.isDirty && !form.formState.isSubmitSuccessful);

  async function onSubmit(values: ParticipantFormValues) {
    const payload = toParticipantPayload(values);
    try {
      if (isEdit) {
        await updateMutation.mutateAsync(payload);
        toast.success("利用者情報を更新しました");
        router.push(paths.participants.detail(participant.id));
      } else {
        const created = await createMutation.mutateAsync(payload);
        toast.success("利用者を登録しました");
        router.push(paths.participants.detail(created.id));
      }
    } catch (error) {
      toast.error(errorMessage(error));
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="max-w-2xl space-y-6">
      <FormSection title="基本情報">
        <TextField control={form.control} name="name" label="氏名（必須）" />
        <TextField control={form.control} name="kana" label="ふりがな" />
        <TextField control={form.control} name="email" label="メールアドレス" type="email" />
        <Controller
          control={form.control}
          name="preferredLanguage"
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="field-language">表示言語</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="field-language" className="w-56">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldDescription>iOS アプリの表示言語に使われます</FieldDescription>
            </Field>
          )}
        />
      </FormSection>

      <FormSection title="希望・スキル">
        <TagField
          control={form.control}
          name="desiredOccupations"
          label="希望職種"
          placeholder="事務、軽作業"
        />
        <TagField control={form.control} name="skills" label="スキル" placeholder="PC基本操作" />
        <TextField control={form.control} name="strengths" label="得意なこと" multiline />
        <TextField control={form.control} name="weaknesses" label="不得意なこと" multiline />
      </FormSection>

      <FormSection title="配慮・通勤">
        <TagField
          control={form.control}
          name="accommodations"
          label="必要な配慮"
          placeholder="静かな環境、指示は書面で"
        />
        <TextField control={form.control} name="commuteConditions" label="通勤条件" />
        <Controller
          control={form.control}
          name="needsTransport"
          render={({ field }) => (
            <Field orientation="horizontal">
              <Switch id="field-transport" checked={field.value} onCheckedChange={field.onChange} />
              <FieldLabel htmlFor="field-transport">送迎が必要</FieldLabel>
            </Field>
          )}
        />
      </FormSection>

      <FormSection title="その他">
        <TextField control={form.control} name="notes" label="メモ" multiline />
      </FormSection>

      <div className="flex gap-2">
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "保存中…" : isEdit ? "保存" : "登録"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          キャンセル
        </Button>
      </div>
    </form>
  );
}
