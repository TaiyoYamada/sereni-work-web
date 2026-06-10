"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { TextField } from "@/components/shared/text-field";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { paths } from "@/config/paths";
import { useApiErrorMessage } from "@/hooks/use-api-error-message";
import type { Company } from "@/types/api";

import { useCreateCompany } from "../api/create-company";
import { useUpdateCompany } from "../api/update-company";
import { companyFormSchema, toCompanyPayload, type CompanyFormValues } from "../schemas/company";

/** 作成・編集共用フォーム。company を渡すと編集モード */
export function CompanyForm({ company }: { company?: Company }) {
  const router = useRouter();
  const errorMessage = useApiErrorMessage();
  const createMutation = useCreateCompany();
  const updateMutation = useUpdateCompany(company?.id ?? "");
  const isEdit = company !== undefined;

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: company?.name ?? "",
      industry: company?.industry ?? "",
      internshipDescription: company?.internshipDescription ?? "",
      requiredSkills: company?.requiredSkills.join("、") ?? "",
      supportedAccommodations: company?.supportedAccommodations.join("、") ?? "",
      capacity: String(company?.capacity ?? 1),
      availableSchedule: company?.availableSchedule ?? "",
      workHours: company?.workHours ?? "",
      contactName: company?.contactName ?? "",
      contactEmail: company?.contactEmail ?? "",
      contactPhone: company?.contactPhone ?? "",
      address: company?.address ?? "",
      belongings: company?.belongings ?? "",
      emergencyContact: company?.emergencyContact ?? "",
    },
  });

  async function onSubmit(values: CompanyFormValues) {
    const payload = toCompanyPayload(values);
    try {
      if (isEdit) {
        await updateMutation.mutateAsync(payload);
        toast.success("企業情報を更新しました");
        router.push(paths.companies.detail(company.id));
      } else {
        const created = await createMutation.mutateAsync(payload);
        toast.success("企業を登録しました");
        router.push(paths.companies.detail(created.id));
      }
    } catch (error) {
      toast.error(errorMessage(error));
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="max-w-2xl">
      <FieldGroup className="gap-5">
        <TextField control={form.control} name="name" label="企業名（必須）" />
        <TextField control={form.control} name="industry" label="業種" />
        <TextField control={form.control} name="internshipDescription" label="実習内容" multiline />
        <TextField
          control={form.control}
          name="requiredSkills"
          label="必要スキル"
          description="「、」または「,」区切りで複数入力できます"
        />
        <TextField
          control={form.control}
          name="supportedAccommodations"
          label="対応可能な配慮事項"
          description="「、」または「,」区切りで複数入力できます"
          placeholder="静かな環境、休憩を多めに"
        />
        <TextField
          control={form.control}
          name="capacity"
          label="同時に受け入れ可能な人数（必須）"
          type="number"
        />
        <TextField control={form.control} name="availableSchedule" label="受け入れ可能日程" />
        <TextField
          control={form.control}
          name="workHours"
          label="勤務時間"
          placeholder="10:00-15:00（休憩1時間）"
        />
        <TextField control={form.control} name="contactName" label="担当者名" />
        <TextField control={form.control} name="contactEmail" label="担当者メール" type="email" />
        <TextField control={form.control} name="contactPhone" label="担当者電話番号" />
        <TextField control={form.control} name="address" label="所在地" />
        <TextField control={form.control} name="belongings" label="持ち物・服装" multiline />
        <TextField control={form.control} name="emergencyContact" label="緊急連絡先" />

        <div className="flex gap-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {isEdit ? "保存" : "登録"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            キャンセル
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
