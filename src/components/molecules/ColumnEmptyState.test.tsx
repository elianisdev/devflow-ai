import { render, screen } from "@testing-library/react";
import { ColumnEmptyState } from "@/components/molecules/ColumnEmptyState";

describe("ColumnEmptyState", () => {
  it("shows its message and the action it receives", () => {
    render(
      <ColumnEmptyState title="Everything starts with a task" text="Write down what you are going to build.">
        <button type="button">+ Create the first one</button>
      </ColumnEmptyState>,
    );

    expect(screen.getByText("Everything starts with a task")).toBeInTheDocument();
    expect(screen.getByText("Write down what you are going to build.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "+ Create the first one" })).toBeInTheDocument();
  });
});
