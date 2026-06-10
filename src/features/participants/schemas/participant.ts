import { z } from "zod";

/** フォームの値はすべて文字列で保持し、送信時に toParticipantPayload で API の形へ変換する */
export const participantFormSchema = z.object({
  name: z.string().min(1, "氏名を入力してください").max(100),
  kana: z.string().max(100),
  email: z.email("メールアドレスの形式が正しくありません").or(z.literal("")),
  preferredLanguage: z.enum(["ja", "en", "zh-Hans", "vi", "ko", "pt"]),
  desiredOccupations: z.string(),
  skills: z.string(),
  strengths: z.string().max(2000),
  weaknesses: z.string().max(2000),
  accommodations: z.string(),
  commuteConditions: z.string().max(2000),
  needsTransport: z.boolean(),
  notes: z.string().max(5000),
});

export type ParticipantFormValues = z.infer<typeof participantFormSchema>;

/** API へ送る形 */
export type ParticipantPayload = {
  name: string;
  kana?: string;
  email?: string;
  preferredLanguage: ParticipantFormValues["preferredLanguage"];
  desiredOccupations: string[];
  skills: string[];
  strengths?: string;
  weaknesses?: string;
  accommodations: string[];
  commuteConditions?: string;
  needsTransport: boolean;
  notes?: string;
};

/** 「、」または「,」区切りの文字列を配列へ */
export function splitList(value: string): string[] {
  return value
    .split(/[、,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function toParticipantPayload(values: ParticipantFormValues): ParticipantPayload {
  return {
    name: values.name,
    kana: values.kana || undefined,
    email: values.email || undefined,
    preferredLanguage: values.preferredLanguage,
    desiredOccupations: splitList(values.desiredOccupations),
    skills: splitList(values.skills),
    strengths: values.strengths || undefined,
    weaknesses: values.weaknesses || undefined,
    accommodations: splitList(values.accommodations),
    commuteConditions: values.commuteConditions || undefined,
    needsTransport: values.needsTransport,
    notes: values.notes || undefined,
  };
}

export const languageOptions = [
  { value: "ja", label: "日本語" },
  { value: "en", label: "英語" },
  { value: "zh-Hans", label: "中国語（簡体字）" },
  { value: "vi", label: "ベトナム語" },
  { value: "ko", label: "韓国語" },
  { value: "pt", label: "ポルトガル語" },
] as const;
