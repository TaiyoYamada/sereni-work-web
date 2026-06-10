import { expect, test } from "@playwright/test";

test("未ログインでトップへアクセスするとログイン画面へリダイレクトされる", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/login/);
});

test("ログイン画面にフォームが表示され、キーボードで操作できる", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByLabel("メールアドレス")).toBeVisible();
  await expect(page.getByLabel("パスワード")).toBeVisible();

  // キーボードのみでフォームへ到達できる（アクセシビリティ要件）
  await page.getByLabel("メールアドレス").fill("staff@example.com");
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("パスワード")).toBeFocused();
  await expect(page.getByRole("button", { name: "ログインする" })).toBeVisible();
});

test("空のままログインすると検証エラーが表示される", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "ログインする" }).click();
  await expect(page.getByText("メールアドレスの形式が正しくありません")).toBeVisible();
  await expect(page.getByText("パスワードを入力してください")).toBeVisible();
});
