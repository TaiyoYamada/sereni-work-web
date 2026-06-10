"use client";

import { Pencil } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { paths } from "@/config/paths";
import { useMe } from "@/lib/auth";

import { useCompany } from "../api/get-company";

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-2 py-2 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="col-span-2">{children ?? "—"}</dd>
    </div>
  );
}

export function CompanyDetail({ companyId }: { companyId: string }) {
  const { data: me } = useMe();
  const { data: company, isPending } = useCompany(companyId);

  if (isPending) {
    return <Skeleton className="h-96 w-full max-w-2xl" />;
  }
  if (!company) return null;

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title={company.name}
        description={company.industry ?? undefined}
        actions={
          me?.role === "admin" ? (
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href={paths.companies.edit(company.id)} />}
            >
              <Pencil aria-hidden className="size-4" />
              編集
            </Button>
          ) : undefined
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">受け入れ情報</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="divide-y">
            <DetailRow label="状態">
              {company.isActive ? (
                <Badge variant="secondary">受け入れ中</Badge>
              ) : (
                <Badge variant="outline">停止中</Badge>
              )}
            </DetailRow>
            <DetailRow label="実習内容">{company.internshipDescription}</DetailRow>
            <DetailRow label="必要スキル">
              {company.requiredSkills.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {company.requiredSkills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              ) : (
                "—"
              )}
            </DetailRow>
            <DetailRow label="対応可能な配慮">
              {company.supportedAccommodations.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {company.supportedAccommodations.map((item) => (
                    <Badge key={item} variant="outline">
                      {item}
                    </Badge>
                  ))}
                </div>
              ) : (
                "—"
              )}
            </DetailRow>
            <DetailRow label="受け入れ人数">
              <span className="tabular-nums">{company.capacity} 名</span>
            </DetailRow>
            <DetailRow label="受け入れ可能日程">{company.availableSchedule}</DetailRow>
            <DetailRow label="勤務時間">{company.workHours}</DetailRow>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">連絡先・アクセス</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="divide-y">
            <DetailRow label="担当者">{company.contactName}</DetailRow>
            <DetailRow label="メール">{company.contactEmail}</DetailRow>
            <DetailRow label="電話番号">{company.contactPhone}</DetailRow>
            <DetailRow label="所在地">{company.address}</DetailRow>
            <DetailRow label="持ち物・服装">{company.belongings}</DetailRow>
            <DetailRow label="緊急連絡先">{company.emergencyContact}</DetailRow>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
