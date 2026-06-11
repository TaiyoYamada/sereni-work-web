"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

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
import type { ConditionTrendPoint } from "@/types/api";

const chartConfig = {
  condition: { label: "体調", color: "var(--chart-1)" },
  fatigue: { label: "疲労", color: "var(--chart-2)" },
  anxiety: { label: "不安", color: "var(--chart-5)" },
} satisfies ChartConfig;

const SCALE_MIN = 1;
const SCALE_MAX = 5;

function shortDate(date: string): string {
  const [, month, day] = date.split("-");
  return `${Number(month)}/${Number(day)}`;
}

export function ConditionTrendChart({ data }: { data: ConditionTrendPoint[] | undefined }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">体調トレンド</CardTitle>
        <CardDescription>実習前チェックの平均値（1〜5、直近2週間）</CardDescription>
      </CardHeader>
      <CardContent>
        {data === undefined ? (
          <Skeleton className="h-64 w-full" />
        ) : data.length === 0 ? (
          <p className="text-muted-foreground flex h-64 items-center justify-center text-sm">
            この期間のプレチェック記録はまだありません
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <LineChart data={data} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={shortDate}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis domain={[SCALE_MIN, SCALE_MAX]} width={28} tickLine={false} axisLine={false} />
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
              <Line
                dataKey="condition"
                stroke="var(--color-condition)"
                strokeWidth={2}
                dot={false}
                connectNulls
              />
              <Line
                dataKey="fatigue"
                stroke="var(--color-fatigue)"
                strokeWidth={2}
                dot={false}
                connectNulls
              />
              <Line
                dataKey="anxiety"
                stroke="var(--color-anxiety)"
                strokeWidth={2}
                dot={false}
                connectNulls
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
