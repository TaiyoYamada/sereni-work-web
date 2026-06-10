"use client";

import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

/** RHF + Field の定型を束ねる共通テキスト入力（業務知識は持たない） */
export function TextField<T extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  multiline = false,
  description,
  placeholder,
}: {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  type?: string;
  multiline?: boolean;
  description?: string;
  placeholder?: string;
}) {
  const id = `field-${name}`;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid || undefined}>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          {multiline ? (
            <Textarea
              id={id}
              placeholder={placeholder}
              aria-invalid={fieldState.invalid || undefined}
              {...field}
              value={field.value ?? ""}
            />
          ) : (
            <Input
              id={id}
              type={type}
              placeholder={placeholder}
              aria-invalid={fieldState.invalid || undefined}
              {...field}
              value={field.value ?? ""}
            />
          )}
          {description ? <FieldDescription>{description}</FieldDescription> : null}
          {fieldState.error ? <FieldError errors={[fieldState.error]} /> : null}
        </Field>
      )}
    />
  );
}
