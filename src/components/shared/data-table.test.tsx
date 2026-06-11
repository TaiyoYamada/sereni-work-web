import type { ColumnDef } from "@tanstack/react-table";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Inbox } from "lucide-react";
import { vi } from "vitest";

import { DataTable } from "./data-table";
import { EmptyState } from "./empty-state";

type Row = { id: string; name: string };

const columns: ColumnDef<Row>[] = [
  { id: "name", header: "名前", cell: ({ row }) => row.original.name },
];

const empty = <EmptyState icon={Inbox} title="データがありません" description="説明文" />;

describe("DataTable", () => {
  it("行データを表示する", () => {
    render(
      <DataTable
        columns={columns}
        data={[
          { id: "1", name: "田中" },
          { id: "2", name: "鈴木" },
        ]}
        empty={empty}
      />,
    );
    expect(screen.getByText("名前")).toBeInTheDocument();
    expect(screen.getByText("田中")).toBeInTheDocument();
    expect(screen.getByText("鈴木")).toBeInTheDocument();
  });

  it("0件のときは空状態を表示する", () => {
    render(<DataTable columns={columns} data={[]} empty={empty} />);
    expect(screen.getByText("データがありません")).toBeInTheDocument();
    expect(screen.getByText("説明文")).toBeInTheDocument();
  });

  it("ローディング中は空状態ではなくスケルトン行を表示する", () => {
    render(<DataTable columns={columns} data={undefined} isPending empty={empty} />);
    expect(screen.queryByText("データがありません")).not.toBeInTheDocument();
    // ヘッダー行は表示されたまま
    expect(screen.getByText("名前")).toBeInTheDocument();
  });

  it("行クリックでコールバックが呼ばれる", async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={[{ id: "1", name: "田中" }]}
        empty={empty}
        onRowClick={onRowClick}
      />,
    );
    await user.click(screen.getByText("田中"));
    expect(onRowClick).toHaveBeenCalledWith({ id: "1", name: "田中" });
  });
});
