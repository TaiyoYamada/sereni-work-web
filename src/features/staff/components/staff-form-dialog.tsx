"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { TextField } from "@/components/shared/text-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApiErrorMessage } from "@/hooks/use-api-error-message";

import { useCreateStaff } from "../api/create-staff";
import { roleOptions, staffFormSchema, type StaffFormValues } from "../schemas/staff";

/** 職員登録ダイアログ。登録後は一覧の「招待メールを送る」でログインを有効化する */
export function StaffFormDialog() {
  const [open, setOpen] = useState(false);
  const errorMessage = useApiErrorMessage();
  const createMutation = useCreateStaff();

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: { name: "", email: "", role: "staff" },
  });

  async function onSubmit(values: StaffFormValues) {
    try {
      await createMutation.mutateAsync(values);
      toast.success("職員を登録しました。招待メールを送るとログインできるようになります");
      form.reset();
      setOpen(false);
    } catch (error) {
      toast.error(errorMessage(error));
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus aria-hidden className="size-4" />
            職員を登録
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>職員を登録</DialogTitle>
          <DialogDescription>
            登録しただけではログインできません。登録後に招待メールを送ってください。
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <TextField control={form.control} name="name" label="氏名" placeholder="山田 太郎" />
            <TextField
              control={form.control}
              name="email"
              label="メールアドレス"
              type="email"
              placeholder="yamada@example.com"
            />
            <Controller
              control={form.control}
              name="role"
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="field-role">ロール</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="field-role" className="w-56">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldDescription>
                    管理者=全機能 / 支援員=担当利用者の支援 / 閲覧者=閲覧のみ
                  </FieldDescription>
                </Field>
              )}
            />
          </FieldGroup>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={createMutation.isPending}
            >
              キャンセル
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "登録中…" : "登録する"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
