import { z } from "zod";

import type { StaffRole } from "@/types/api";

export const staffFormSchema = z.object({
  name: z.string().min(1, "氏名を入力してください").max(100),
  email: z.email("メールアドレスの形式が正しくありません"),
  role: z.enum(["admin", "staff", "viewer"]),
});

export type StaffFormValues = z.infer<typeof staffFormSchema>;

/** API へ送る形（フォームと同型だが、API 契約の変更点を吸収する場所として分けておく） */
export type StaffPayload = StaffFormValues;

export const roleOptions: { value: StaffRole; label: string }[] = [
  { value: "staff", label: "支援員" },
  { value: "admin", label: "管理者" },
  { value: "viewer", label: "閲覧者" },
];

export function roleLabel(role: StaffRole): string {
  return roleOptions.find((option) => option.value === role)?.label ?? role;
}
