import { z } from "zod";

export const companyFormSchema = z.object({
  name: z.string().min(1, "企業名を入力してください").max(200),
  industry: z.string().max(100),
  internshipDescription: z.string().max(5000),
  requiredSkills: z.array(z.string().min(1)),
  supportedAccommodations: z.array(z.string().min(1)),
  capacity: z
    .string()
    .min(1, "受け入れ人数を入力してください")
    .refine((value) => /^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= 100, {
      message: "1〜100 の数値を入力してください",
    }),
  availableSchedule: z.string().max(2000),
  workHours: z.string().max(500),
  contactName: z.string().max(100),
  contactEmail: z.email("メールアドレスの形式が正しくありません").or(z.literal("")),
  contactPhone: z.string().max(50),
  address: z.string().max(500),
  belongings: z.string().max(2000),
  emergencyContact: z.string().max(500),
});

export type CompanyFormValues = z.infer<typeof companyFormSchema>;

export type CompanyPayload = {
  name: string;
  industry?: string;
  internshipDescription?: string;
  requiredSkills: string[];
  supportedAccommodations: string[];
  capacity: number;
  availableSchedule?: string;
  workHours?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  belongings?: string;
  emergencyContact?: string;
};

export function toCompanyPayload(values: CompanyFormValues): CompanyPayload {
  return {
    name: values.name,
    industry: values.industry || undefined,
    internshipDescription: values.internshipDescription || undefined,
    requiredSkills: values.requiredSkills,
    supportedAccommodations: values.supportedAccommodations,
    capacity: Number(values.capacity),
    availableSchedule: values.availableSchedule || undefined,
    workHours: values.workHours || undefined,
    contactName: values.contactName || undefined,
    contactEmail: values.contactEmail || undefined,
    contactPhone: values.contactPhone || undefined,
    address: values.address || undefined,
    belongings: values.belongings || undefined,
    emergencyContact: values.emergencyContact || undefined,
  };
}
