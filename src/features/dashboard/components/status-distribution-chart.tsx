"use client";

import { Pie, PieChart } from "recharts";

import { assignmentStatusLabels } from "@/components/shared/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import type { AssignmentStatus } from "@/types/api";

const statusColors: Record<AssignmentStatus, string> = {
  DRAFT: "var(--chart-4)",
  PROPOSED: "var(--chart-5)",
  CONFIRMED: "var(--chart-3)",
  IN_PROGRESS: "var(--chart-1)",
  COMPLETED: "var(--chart-2)",
  CANCELLED: "var(--muted-foreground)",
};

const ALL_STATUSES: AssignmentStatus[] = [
  "DRAFT",
  "PROPOSED",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

const chartConfig = Object.fromEntries(
  ALL_STATUSES.map((status) => [
    status,
    { label: assignmentStatusLabels[status], color: statusColors[status] },
  ]),
) satisfies ChartConfig;

export function StatusDistributionChart({
  data,
}: {
  data: { status: AssignmentStatus; count: number }[] | undefined;
}) {
  const chartData = data?.map((row) => ({
    ...row,
    fill: statusColors[row.status],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">実習割当の内訳</CardTitle>
        <CardDescription>状態別の割当件数</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData === undefined ? (
          <Skeleton className="h-64 w-full" />
        ) : chartData.length === 0 ? (
          <p className="text-muted-foreground flex h-64 items-center justify-center text-sm">
            まだ割当がありません
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <PieChart accessibilityLayer>
              <ChartTooltip content={<ChartTooltipContent nameKey="status" />} />
              <Pie data={chartData} dataKey="count" nameKey="status" innerRadius={55} />
              <ChartLegend content={<ChartLegendContent nameKey="status" />} />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
