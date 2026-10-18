import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Provider } from "jotai";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@jtl/shared";
import { usersApi } from "../api/usersApi";
import { CreateUserForm } from "./CreateUserForm";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function renderForm() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return render(
    <Provider>
      <QueryClientProvider client={queryClient}>
        <CreateUserForm onCreated={vi.fn()} />
      </QueryClientProvider>
    </Provider>,
  );
}

describe("CreateUserForm", () => {
  it("shows a field error and focuses the input before submitting invalid data", () => {
    const createSpy = vi.spyOn(usersApi, "create");
    renderForm();
    fireEvent.click(screen.getByRole("button", { name: "Create user" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a username.");
    expect(screen.getByLabelText("Username")).toHaveFocus();
    expect(createSpy).not.toHaveBeenCalled();
  });

  it("preserves the draft and maps a dataset conflict to the username field", async () => {
    vi.spyOn(usersApi, "create").mockRejectedValue(new ApiError("USERNAME_TAKEN", "This username is already taken."));
    renderForm();
    const input = screen.getByLabelText("Username");
    fireEvent.change(input, { target: { value: "  alex  " } });
    fireEvent.click(screen.getByRole("button", { name: "Create user" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("This username is already taken.");
    expect(input).toHaveValue("  alex  ");
  });

  it("clears the draft only after a successful create", async () => {
    const onCreated = vi.fn();
    vi.spyOn(usersApi, "create").mockResolvedValue({ id: "user-new", username: "Riley" });
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
    render(<Provider><QueryClientProvider client={queryClient}><CreateUserForm onCreated={onCreated} /></QueryClientProvider></Provider>);
    const input = screen.getByLabelText("Username");
    fireEvent.change(input, { target: { value: " Riley " } });
    fireEvent.click(screen.getByRole("button", { name: "Create user" }));
    await waitFor(() => expect(input).toHaveValue(""));
    expect(onCreated).toHaveBeenCalledWith({ id: "user-new", username: "Riley" });
  });
});
