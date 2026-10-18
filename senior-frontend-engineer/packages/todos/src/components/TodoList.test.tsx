import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { useState } from "react";
import type { TodoItem } from "@jtl/shared";
import { todosApi } from "../api/todosApi";
import { todoQueryKeys } from "../hooks/useTodos";
import { TodoList, type TodoFilter } from "./TodoList";

let serverItems: TodoItem[];

function TodoListHarness() {
  const [filter, setFilter] = useState<TodoFilter>("all");
  const { data = [] } = useQuery({
    queryKey: todoQueryKeys.byUser("user-1"),
    queryFn: async () => serverItems,
    initialData: serverItems,
  });
  return <TodoList items={data} filter={filter} onFilterChange={setFilter} />;
}

function renderList() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return render(<QueryClientProvider client={queryClient}><TodoListHarness /></QueryClientProvider>);
}

afterEach(() => { cleanup(); vi.restoreAllMocks(); });
beforeEach(() => {
  serverItems = [
    { id: "one", title: "First task", assigneeId: "user-1", status: "doing", createdAt: "2026-10-17T00:00:00Z" },
    { id: "two", title: "Second task", assigneeId: "user-1", status: "doing", createdAt: "2026-10-17T00:01:00Z" },
    { id: "three", title: "Finished task", assigneeId: "user-1", status: "done", createdAt: "2026-10-17T00:02:00Z" },
  ];
});

it("shows counts from the full list and filters one unified list", async () => {
  renderList();
  expect(screen.getByRole("button", { name: "All 3" })).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByRole("button", { name: "Doing 2" })).toHaveAttribute("aria-pressed", "false");
  expect(screen.getByRole("button", { name: "Done 1" })).toHaveAttribute("aria-pressed", "false");
  expect(screen.getByRole("list").children).toHaveLength(3);

  fireEvent.click(screen.getByRole("button", { name: "Done 1" }));
  expect(screen.getByRole("button", { name: "Done 1" })).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByText("Finished task")).toBeVisible();
  expect(screen.queryByText("First task")).not.toBeInTheDocument();
  expect(screen.getByRole("list").children).toHaveLength(1);

  fireEvent.click(screen.getByRole("button", { name: "Doing 2" }));
  expect(screen.getByText("First task")).toBeVisible();
  expect(screen.getByText("Second task")).toBeVisible();
  expect(screen.queryByText("Finished task")).not.toBeInTheDocument();
});

it("moves focus to the next task when a filtered status change removes the focused row", async () => {
  vi.spyOn(todosApi, "updateStatus").mockImplementation(async ({ id, status }) => {
    await new Promise((resolve) => setTimeout(resolve, 30));
    const updated = serverItems.find((item) => item.id === id)!;
    updated.status = status;
    return { ...updated };
  });
  renderList();
  fireEvent.click(screen.getByRole("button", { name: "Doing 2" }));
  fireEvent.click(screen.getByRole("button", { name: "Mark done: First task" }));
  await waitFor(() => expect(screen.getByRole("button", { name: "Mark done: Second task" })).toHaveFocus());
  expect(screen.getByRole("button", { name: "Doing 1" })).toHaveAttribute("aria-pressed", "true");
});

it("keeps a pending task disabled and gives the All filter its own empty state", () => {
  const queryClient = new QueryClient();
  render(<QueryClientProvider client={queryClient}>
    <TodoList items={[{ ...serverItems[0], isPending: true }]} filter="all" onFilterChange={() => undefined} />
  </QueryClientProvider>);
  expect(screen.getByRole("button", { name: "Mark done: First task" })).toBeDisabled();

  cleanup();
  render(<QueryClientProvider client={new QueryClient()}>
    <TodoList items={[]} filter="all" onFilterChange={() => undefined} />
  </QueryClientProvider>);
  expect(screen.getByText("No tasks yet.")).toBeVisible();
});

it("shows distinct empty copy for each status filter", () => {
  render(<QueryClientProvider client={new QueryClient()}>
    <TodoList items={[]} filter="doing" onFilterChange={() => undefined} />
  </QueryClientProvider>);
  expect(screen.getByText("No tasks in progress.")).toBeVisible();
  cleanup();
  render(<QueryClientProvider client={new QueryClient()}>
    <TodoList items={[]} filter="done" onFilterChange={() => undefined} />
  </QueryClientProvider>);
  expect(screen.getByText("No completed tasks yet.")).toBeVisible();
});
