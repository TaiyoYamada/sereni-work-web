import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = { title: "ログイン" };

export default async function LoginPage() {
  const t = await getTranslations();
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{t("app.name")}</CardTitle>
        <CardDescription>{t("app.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  );
}
