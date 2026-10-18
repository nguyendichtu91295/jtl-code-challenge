import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { todosApi } from "../api/todosApi";
import { CreateTodoForm } from "./CreateTodoForm";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("CreateTodoForm", () => {
  it("preserves the title draft and displays request failure feedback", async () => {
    vi.spyOn(todosApi, "create").mockRejectedValue(new Error("Network error"));
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
    render(<QueryClientProvider client={queryClient}><CreateTodoForm userId="user-1" username="alex" /></QueryClientProvider>);
    const title = screen.getByLabelText("Task title");
    fireEvent.change(title, { target: { value: " Keep my draft " } });
    fireEvent.click(screen.getByRole("button", { name: "Create task" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("We could not create this task.");
    expect(title).toHaveValue(" Keep my draft ");
  });
});

it("submits the fixed assignee without a selector", async () => {
  const create = vi.spyOn(todosApi, "create").mockResolvedValue({ id: "new", title: "Assigned", assigneeId: "user-2", status: "doing", createdAt: "2026-10-17T00:00:00Z" });
  render(<QueryClientProvider client={new QueryClient()}><CreateTodoForm userId="user-2" username="morgan" /></QueryClientProvider>);
  expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  expect(screen.getByText("morgan")).toBeVisible();
  fireEvent.change(screen.getByLabelText("Task title"), { target: { value: "Assigned" } });
  fireEvent.click(screen.getByRole("button", { name: "Create task" }));
  await waitFor(() => expect(create).toHaveBeenCalledWith({ title: "Assigned", assigneeId: "user-2" }, expect.anything()));
});

it("runs the valid-submit callback only after the title passes validation", async () => {
  vi.spyOn(todosApi, "create").mockResolvedValue({ id: "new", title: "Assigned", assigneeId: "user-1", status: "doing", createdAt: "2026-10-17T00:00:00Z" });
  const onValidSubmit = vi.fn();
  render(<QueryClientProvider client={new QueryClient()}><CreateTodoForm userId="user-1" username="alex" onValidSubmit={onValidSubmit} /></QueryClientProvider>);

  fireEvent.click(screen.getByRole("button", { name: "Create task" }));
  expect(onValidSubmit).not.toHaveBeenCalled();

  fireEvent.change(screen.getByLabelText("Task title"), { target: { value: "New task" } });
  fireEvent.click(screen.getByRole("button", { name: "Create task" }));
  await waitFor(() => expect(onValidSubmit).toHaveBeenCalledTimes(1));
});
