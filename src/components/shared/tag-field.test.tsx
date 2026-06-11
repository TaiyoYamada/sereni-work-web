import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";

import { TagField } from "./tag-field";

function TestForm() {
  const form = useForm<{ tags: string[] }>({ defaultValues: { tags: ["既存"] } });
  return (
    <form>
      <TagField control={form.control} name="tags" label="タグ" />
    </form>
  );
}

describe("TagField", () => {
  it("Enter でタグが確定する", async () => {
    const user = userEvent.setup();
    render(<TestForm />);
    await user.type(screen.getByLabelText("タグ"), "事務{Enter}");
    expect(screen.getByText("事務")).toBeInTheDocument();
    expect(screen.getByLabelText("タグ")).toHaveValue("");
  });

  it("読点区切りで複数タグが確定する", async () => {
    const user = userEvent.setup();
    render(<TestForm />);
    await user.type(screen.getByLabelText("タグ"), "清掃、接客、");
    expect(screen.getByText("清掃")).toBeInTheDocument();
    expect(screen.getByText("接客")).toBeInTheDocument();
  });

  it("重複したタグは追加されない", async () => {
    const user = userEvent.setup();
    render(<TestForm />);
    await user.type(screen.getByLabelText("タグ"), "既存{Enter}");
    expect(screen.getAllByText("既存")).toHaveLength(1);
  });

  it("× ボタンでタグを削除できる", async () => {
    const user = userEvent.setup();
    render(<TestForm />);
    await user.click(screen.getByRole("button", { name: "既存 を削除" }));
    expect(screen.queryByText("既存")).not.toBeInTheDocument();
  });

  it("入力が空のとき Backspace で末尾のタグを削除する", async () => {
    const user = userEvent.setup();
    render(<TestForm />);
    await user.type(screen.getByLabelText("タグ"), "{Backspace}");
    expect(screen.queryByText("既存")).not.toBeInTheDocument();
  });
});
