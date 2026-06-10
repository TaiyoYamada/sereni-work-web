"use client";

import { useTranslations } from "next-intl";

import { ApiError } from "@/lib/api-client";

const KNOWN_CODES = [
  "VALIDATION_ERROR",
  "UNAUTHENTICATED",
  "FORBIDDEN",
  "NOT_FOUND",
  "CONFLICT",
  "ASSIGNMENT_CAPACITY_EXCEEDED",
  "OPTIMIZATION_FAILED",
  "INTERNAL_ERROR",
  "NETWORK_ERROR",
] as const;

type KnownCode = (typeof KNOWN_CODES)[number];

function isKnownCode(code: string): code is KnownCode {
  return (KNOWN_CODES as readonly string[]).includes(code);
}

/** API エラーをユーザー向け文言へ変換する（messages/ja.json の errors.*） */
export function useApiErrorMessage() {
  const t = useTranslations("errors");
  return (error: unknown): string => {
    if (error instanceof ApiError) {
      // サーバーが具体的な業務メッセージを返した場合はそれを優先する
      if (error.message && !isKnownCode(error.message)) return error.message;
      if (isKnownCode(error.code)) return t(error.code);
    }
    return t("INTERNAL_ERROR");
  };
}
