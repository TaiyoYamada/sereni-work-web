import { render, screen } from "@testing-library/react";

import { AssignmentStatusBadge, ReportStatusBadge } from "./status-badge";

describe("AssignmentStatusBadge", () => {
  it.each([
    ["DRAFT", "下書き"],
    ["PROPOSED", "提案中"],
    ["CONFIRMED", "確定"],
    ["IN_PROGRESS", "実習中"],
    ["COMPLETED", "完了"],
    ["CANCELLED", "中止"],
  ] as const)("%s は「%s」と表示される", (status, label) => {
    render(<AssignmentStatusBadge status={status} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });
});

describe("ReportStatusBadge", () => {
  it.each([
    ["DRAFT", "下書き"],
    ["SUBMITTED", "提出済み"],
    ["REVIEWED", "確認済み"],
    ["NEEDS_ACTION", "要対応"],
  ] as const)("%s は「%s」と表示される", (status, label) => {
    render(<ReportStatusBadge status={status} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });
});
