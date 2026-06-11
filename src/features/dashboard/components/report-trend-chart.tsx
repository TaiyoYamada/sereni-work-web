"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
import type { ReportTrendPoint } from "@/types/api";

const chartConfig = {
  expected: { label: "提出想定", color: "var(--chart-4)" },
  submitted: { label: "提出済み", color: "var(--chart-1)" },
} satisfies ChartConfig;

/** "YYYY-MM-DD" → "M/D" */
function shortDate(date: string): string {
  const [, month, day] = date.split("-");
  return `${Number(month)}/${Number(day)}`;
}

export function ReportTrendChart({ data }: { data: ReportTrendPoint[] | undefined }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">日報の提出状況</CardTitle>
        <CardDescription>直近2週間の提出想定数と提出数</CardDescription>
      </CardHeader>
      <CardContent>
        {data === undefined ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <BarChart data={data} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={shortDate}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis allowDecimals={false} width={28} tickLine={false} axisLine={false} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) =>
                      typeof label === "string" ? shortDate(label) : label
                    }
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="expected" fill="var(--color-expected)" radius={4} />
              <Bar dataKey="submitted" fill="var(--color-submitted)" radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
