import {
  BadgeCheck,
  CalendarCheck,
  CircleCheck,
  CirclePlay,
  CircleX,
  Pencil,
  Send,
  Sparkles,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AssignmentStatus, ReportStatus } from "@/types/api";

/**
 * 状態バッジ。色・アイコン・ラベルの対応は docs/design-system.md の対応表（iOS と共通）。
 * 色だけに依存しない原則のため、必ずアイコン + ラベルを併記する。
 */

type StatusConfig = { label: string; icon: LucideIcon; className: string };

const assignmentStatusConfig: Record<AssignmentStatus, StatusConfig> = {
  DRAFT: { label: "下書き", icon: Pencil, className: "text-muted-foreground" },
  PROPOSED: { label: "提案中", icon: Sparkles, className: "text-proposed" },
  CONFIRMED: { label: "確定", icon: CalendarCheck, className: "text-info" },
  IN_PROGRESS: { label: "実習中", icon: CirclePlay, className: "text-primary" },
  COMPLETED: { label: "完了", icon: CircleCheck, className: "text-success" },
  CANCELLED: { label: "中止", icon: CircleX, className: "text-destructive" },
};

const reportStatusConfig: Record<ReportStatus, StatusConfig> = {
  DRAFT: { label: "下書き", icon: Pencil, className: "text-muted-foreground" },
  SUBMITTED: { label: "提出済み", icon: Send, className: "text-info" },
  REVIEWED: { label: "確認済み", icon: BadgeCheck, className: "text-success" },
  NEEDS_ACTION: { label: "要対応", icon: TriangleAlert, className: "text-warning" },
};

function StatusBadge({ config }: { config: StatusConfig }) {
  return (
    <Badge variant="outline" className={cn("gap-1 font-normal", config.className)}>
      <config.icon aria-hidden className="size-3" />
      {config.label}
    </Badge>
  );
}

export function AssignmentStatusBadge({ status }: { status: AssignmentStatus }) {
  return <StatusBadge config={assignmentStatusConfig[status]} />;
}

export function ReportStatusBadge({ status }: { status: ReportStatus }) {
  return <StatusBadge config={reportStatusConfig[status]} />;
}

export const assignmentStatusLabels = Object.fromEntries(
  Object.entries(assignmentStatusConfig).map(([key, value]) => [key, value.label]),
) as Record<AssignmentStatus, string>;

export const reportStatusLabels = Object.fromEntries(
  Object.entries(reportStatusConfig).map(([key, value]) => [key, value.label]),
) as Record<ReportStatus, string>;
