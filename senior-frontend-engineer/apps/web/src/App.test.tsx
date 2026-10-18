import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach, expect, it, vi } from "vitest";
import { createMemoryHistory } from "@tanstack/react-router";
import { App, createAppRouter } from "./App";

function renderApp(path = "/users") {
  const appRouter = createAppRouter(createMemoryHistory({ initialEntries: [path] }));
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  render(<QueryClientProvider client={client}><App appRouter={appRouter} /></QueryClientProvider>);
  return { client, appRouter };
}
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

it("creates a user in a dialog, stays on users, and opens their fixed-assignee detail", async () => {
  const { appRouter } = renderApp();
  await screen.findByRole("button", { name: /alex/ }, { timeout: 5000 });
  expect(screen.queryByLabelText("Username")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Add user" }));
  const dialog = await screen.findByRole("dialog", { name: "Add user" });
  fireEvent.change(within(dialog).getByLabelText("Username"), { target: { value: "FlowUser" } });
  fireEvent.click(within(dialog).getByRole("button", { name: "Create user" }));
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  expect(appRouter.state.location.pathname).toBe("/users");
  const row = await screen.findByRole("button", { name: /FlowUser/ });
  fireEvent.click(row);
  await screen.findByLabelText("Task title", {}, { timeout: 5000 });
  expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Back to users" })).toHaveAttribute("href", "/users");
  fireEvent.change(screen.getByLabelText("Task title"), { target: { value: "For FlowUser" } });
  fireEvent.click(screen.getByRole("button", { name: "Create task" }));
  await screen.findByText("For FlowUser");
  await waitFor(() => expect(screen.getByRole("button", { name: "Mark done: For FlowUser" })).toBeEnabled());
  fireEvent.click(screen.getByRole("link", { name: "Back to users" }));
  await screen.findByRole("button", { name: /FlowUser/ }, { timeout: 10000 });
}, 20000);

it("keeps a failed username draft in its dialog", async () => {
  renderApp();
  await screen.findByRole("button", { name: "Add user" }, { timeout: 5000 });
  fireEvent.click(screen.getByRole("button", { name: "Add user" }));
  fireEvent.change(screen.getByLabelText("Username"), { target: { value: "alex" } });
  fireEvent.click(screen.getByRole("button", { name: "Create user" }));
  await screen.findByText("This username is already taken.");
  expect(screen.getByRole("dialog")).toBeVisible();
  expect(screen.getByLabelText("Username")).toHaveValue("alex");
});

it("uses the direct-entry user ID and gives a reliable return link", async () => {
  renderApp("/users/user-2");
  await screen.findByLabelText("Task title", {}, { timeout: 5000 });
  expect(screen.getByRole("heading", { name: "morgan" })).toBeVisible();
  expect(screen.getByText("Prepare the weekly update")).toBeVisible();
  expect(screen.queryByText("Review the project plan")).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Back to users" })).toHaveAttribute("href", "/users");
});

it("does not expose task creation for missing users or the removed todos route", async () => {
  const { appRouter } = renderApp("/users/missing");
  await screen.findByText("This user could not be found.", {}, { timeout: 5000 });
  expect(screen.queryByLabelText("Task title")).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Back to users" })).toHaveAttribute("href", "/users");
  await appRouter.navigate({ href: "/todos" });
  await screen.findByText("Page not found", {}, { timeout: 5000 });
});
