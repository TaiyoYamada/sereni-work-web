"use client";

import { useEffect } from "react";

/**
 * 未保存の変更があるときにタブを閉じる・リロードする操作へ確認を出す。
 * App Router にはアプリ内遷移をブロックする公式 API がないため、対象はブラウザ操作のみ。
 */
export function useUnsavedChangesGuard(hasUnsavedChanges: boolean) {
  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const warnBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => window.removeEventListener("beforeunload", warnBeforeUnload);
  }, [hasUnsavedChanges]);
}
