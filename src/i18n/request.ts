import { getRequestConfig } from "next-intl/server";

/**
 * 職員向け Web は当面日本語のみ（ロケールルーティングなし）。
 * 多言語化する場合は [locale] セグメント + routing.ts を導入する。
 */
export default getRequestConfig(async () => {
  const locale = "ja";
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
