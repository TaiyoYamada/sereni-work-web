"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { TextField } from "@/components/shared/text-field";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { paths } from "@/config/paths";
import { useApiErrorMessage } from "@/hooks/use-api-error-message";

import { useCreateAssignment } from "../api/create-assignment";
import { useAssignmentOptions } from "../api/get-assignment-options";

const assignmentFormSchema = z
  .object({
    participantId: z.string().min(1, "利用者を選択してください"),
    companyId: z.string().min(1, "実習先を選択してください"),
    startDate: z.string().min(1, "開始日を入力してください"),
    endDate: z.string().min(1, "終了日を入力してください"),
    meetingPlace: z.string().max(500),
    goal: z.string().max(2000),
  })
  .refine((values) => values.endDate >= values.startDate, {
    message: "終了日は開始日以降にしてください",
    path: ["endDate"],
  });

type AssignmentFormValues = z.infer<typeof assignmentFormSchema>;

export function AssignmentForm() {
  const router = useRouter();
  const errorMessage = useApiErrorMessage();
  const createMutation = useCreateAssignment();
  const { data: options } = useAssignmentOptions();

  const form = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentFormSchema),
    defaultValues: {
      participantId: "",
      companyId: "",
      startDate: "",
      endDate: "",
      meetingPlace: "",
      goal: "",
    },
  });

  async function onSubmit(values: AssignmentFormValues) {
    try {
      const created = await createMutation.mutateAsync({
        ...values,
        meetingPlace: values.meetingPlace || undefined,
        goal: values.goal || undefined,
      });
      toast.success("割当を下書きとして作成しました");
      router.push(paths.assignments.detail(created.id));
    } catch (error) {
      toast.error(errorMessage(error));
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="max-w-2xl">
      <FieldGroup className="gap-5">
        <Controller
          control={form.control}
          name="participantId"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor="field-participant">利用者（必須）</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="field-participant" className="w-72">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {options?.participants.map((participant) => (
                    <SelectItem key={participant.id} value={participant.id}>
                      {participant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.error ? <FieldError errors={[fieldState.error]} /> : null}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="companyId"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor="field-company">実習先企業（必須）</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="field-company" className="w-72">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {options?.companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.error ? <FieldError errors={[fieldState.error]} /> : null}
            </Field>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <TextField control={form.control} name="startDate" label="開始日（必須）" type="date" />
          <TextField control={form.control} name="endDate" label="終了日（必須）" type="date" />
        </div>

        <TextField
          control={form.control}
          name="meetingPlace"
          label="集合場所"
          placeholder="1階受付前"
        />
        <TextField control={form.control} name="goal" label="実習の目標" multiline />

        <div className="flex gap-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            下書きとして作成
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            キャンセル
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
