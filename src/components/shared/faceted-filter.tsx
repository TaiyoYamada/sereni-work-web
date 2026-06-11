"use client";

import { ListFilter } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type FacetedFilterOption = {
  value: string;
  label: string;
};

/**
 * 一覧の絞り込みチップ（単一選択）。選択値は URL（searchParams）に保持する想定。
 * 同じ項目をもう一度選ぶと解除される。
 */
export function FacetedFilter({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: FacetedFilterOption[];
  value: string | undefined;
  onChange: (value: string | undefined) => void;
}) {
  const selected = options.find((option) => option.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="sm" className="border-dashed">
            <ListFilter aria-hidden className="size-4" />
            {label}
            {selected ? (
              <Badge variant="secondary" className="ml-1 font-normal">
                {selected.label}
              </Badge>
            ) : null}
          </Button>
        }
      />
      <DropdownMenuContent align="start">
        <DropdownMenuRadioGroup
          value={value ?? ""}
          onValueChange={(next) => onChange(next === value ? undefined : next)}
        >
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        {selected ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onChange(undefined)}>絞り込みを解除</DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
