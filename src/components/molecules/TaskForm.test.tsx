import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskForm, type TaskFormLabels } from "@/components/molecules/TaskForm";

const labels: TaskFormLabels = {
  title: "Title",
  description: "Description (optional)",
  descriptionPlaceholder: "What needs to be done",
  cancel: "Cancel",
  submit: "Create task",
  pending: "Creating…",
  errors: { titleRequired: "Write a title for the task.", titleTooLong: "Use 120 characters or fewer." },
};

describe("TaskForm", () => {
  it("shows the validation error next to the field and announces it", async () => {
    const action = jest.fn().mockResolvedValue({ errors: { title: "titleRequired" } });
    render(<TaskForm action={action} labels={labels} onCancel={jest.fn()} onSuccess={jest.fn()} />);

    await userEvent.click(screen.getByRole("button", { name: "Create task" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Write a title for the task.");
    expect(screen.getByLabelText("Title")).toHaveAttribute("aria-invalid", "true");
  });

  it("counts the title characters and calls onSuccess when the action succeeds", async () => {
    const action = jest.fn().mockResolvedValue({ success: true });
    const onSuccess = jest.fn();
    render(<TaskForm action={action} labels={labels} onCancel={jest.fn()} onSuccess={onSuccess} />);

    await userEvent.type(screen.getByLabelText("Title"), "Ship it");
    expect(screen.getByText("7/120")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Create task" }));

    expect(onSuccess).toHaveBeenCalled();
    expect(action.mock.calls[0][1].get("title")).toBe("Ship it");
  });

  it("cancels without submitting", async () => {
    const action = jest.fn();
    const onCancel = jest.fn();
    render(<TaskForm action={action} labels={labels} onCancel={onCancel} onSuccess={jest.fn()} />);

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onCancel).toHaveBeenCalled();
    expect(action).not.toHaveBeenCalled();
  });
});
