import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach, expect, it, vi } from "vitest";
import { todosApi } from "../api/todosApi";
import { TodoWorkspace } from "./TodoWorkspace";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

it("resets the selected filter and loads only the new user's tasks when the user changes", async () => {
  vi.spyOn(todosApi, "listByUserId").mockImplementation(async (userId) => [{
    id: `${userId}-task`, title: `${userId} task`, assigneeId: userId, status: "done", createdAt: "2026-10-17T00:00:00Z",
  }]);
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  const view = render(<QueryClientProvider client={queryClient}><TodoWorkspace userId="user-1" username="alex" /></QueryClientProvider>);
  fireEvent.click(await screen.findByRole("button", { name: "Done 1" }));
  expect(screen.getByRole("button", { name: "Done 1" })).toHaveAttribute("aria-pressed", "true");

  view.rerender(<QueryClientProvider client={queryClient}><TodoWorkspace userId="user-2" username="morgan" /></QueryClientProvider>);
  await waitFor(() => expect(screen.getByRole("button", { name: "All 1" })).toHaveAttribute("aria-pressed", "true"));
  expect(await screen.findByText("user-2 task")).toBeVisible();
  expect(screen.queryByText("user-1 task")).not.toBeInTheDocument();
});
