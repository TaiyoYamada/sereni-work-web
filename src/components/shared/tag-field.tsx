"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";

/** タグ確定の区切り文字（読点・カンマ） */
const SEPARATOR_PATTERN = /[、,]/;

function appendTag(tags: string[], draft: string): string[] {
  const tag = draft.trim();
  if (!tag || tags.includes(tag)) return tags;
  return [...tags, tag];
}

/**
 * RHF 制御のタグ入力（値は string[]）。
 * Enter・「、」「,」で確定、確定済みタグは Backspace か × で削除する。
 * suggestions を渡すとブラウザ標準の datalist で入力候補を出す。
 */
export function TagField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder,
  suggestions,
}: {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  description?: string;
  placeholder?: string;
  suggestions?: string[];
}) {
  const id = `field-${name}`;
  const [draft, setDraft] = useState("");

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const tags: string[] = field.value ?? [];

        function commitDraft() {
          const next = appendTag(tags, draft);
          if (next !== tags) field.onChange(next);
          setDraft("");
        }

        return (
          <Field data-invalid={fieldState.invalid || undefined}>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            <div
              className={cn(
                "border-input focus-within:ring-ring/50 flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border bg-transparent px-2.5 py-1.5 text-sm shadow-xs transition-[color,box-shadow] focus-within:ring-2",
                fieldState.invalid && "border-destructive",
              )}
            >
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                  {tag}
                  <button
                    type="button"
                    aria-label={`${tag} を削除`}
                    className="hover:bg-muted-foreground/20 rounded-full p-0.5"
                    onClick={() => field.onChange(tags.filter((item) => item !== tag))}
                  >
                    <X aria-hidden className="size-3" />
                  </button>
                </Badge>
              ))}
              <input
                id={id}
                list={suggestions ? `${id}-suggestions` : undefined}
                className="placeholder:text-muted-foreground min-w-24 flex-1 bg-transparent outline-none"
                value={draft}
                placeholder={tags.length === 0 ? placeholder : undefined}
                aria-invalid={fieldState.invalid || undefined}
                onChange={(e) => {
                  const value = e.target.value;
                  if (SEPARATOR_PATTERN.test(value)) {
                    const next = value
                      .split(SEPARATOR_PATTERN)
                      .reduce((acc, part) => appendTag(acc, part), tags);
                    if (next !== tags) field.onChange(next);
                    setDraft("");
                    return;
                  }
                  setDraft(value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    commitDraft();
                    return;
                  }
                  if (e.key === "Backspace" && draft === "" && tags.length > 0) {
                    field.onChange(tags.slice(0, -1));
                  }
                }}
                onBlur={() => {
                  commitDraft();
                  field.onBlur();
                }}
              />
              {suggestions ? (
                <datalist id={`${id}-suggestions`}>
                  {suggestions
                    .filter((item) => !tags.includes(item))
                    .map((item) => (
                      <option key={item} value={item} />
                    ))}
                </datalist>
              ) : null}
            </div>
            <FieldDescription>
              {description ?? "Enter または「、」で確定して複数入力できます"}
            </FieldDescription>
            {fieldState.error ? <FieldError errors={[fieldState.error]} /> : null}
          </Field>
        );
      }}
    />
  );
}
