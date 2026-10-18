import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { TodoItem } from "@jtl/shared";
import { todosApi } from "../api/todosApi";
import { todoQueryKeys, useCreateTodo, useUpdateTodoStatus, useTodoCounts, type OptimisticTodo } from "./useTodos";

const originalTodo: TodoItem = { id: "existing", title: "Existing", assigneeId: "user-1", status: "doing", createdAt: "2026-10-01T00:00:00.000Z" };

function createHarness() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  const wrapper = ({ children }: { children: React.ReactNode }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  return { queryClient, wrapper };
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

afterEach(() => vi.restoreAllMocks());

describe("useCreateTodo", () => {
  it("shows a pending item immediately and replaces it with the saved item", async () => {
    const request = deferred<TodoItem>();
    vi.spyOn(todosApi, "create").mockReturnValue(request.promise);
    const { queryClient, wrapper } = createHarness();
    const key = todoQueryKeys.byUser("user-1");
    queryClient.setQueryData(key, [originalTodo]);
    const { result } = renderHook(() => useCreateTodo(), { wrapper });

    act(() => result.current.mutate({ title: "  New item  ", assigneeId: "user-1" }));
    await waitFor(() => expect(queryClient.getQueryData<OptimisticTodo[]>(key)?.some((item) => item.isPending)).toBe(true));
    expect(queryClient.getQueryData<OptimisticTodo[]>(key)?.map((item) => item.title)).toEqual(["Existing", "New item"]);

    const saved: TodoItem = { id: "saved-1", title: "New item", assigneeId: "user-1", status: "doing", createdAt: "2026-10-17T00:00:00.000Z" };
    await act(async () => { request.resolve(saved); await request.promise; });
    await waitFor(() => expect(queryClient.getQueryData<TodoItem[]>(key)?.map((item) => item.id)).toEqual(["existing", "saved-1"]));
  });

  it("removes only a failed optimistic item and preserves cached data", async () => {
    const request = deferred<TodoItem>();
    vi.spyOn(todosApi, "create").mockReturnValue(request.promise);
    const { queryClient, wrapper } = createHarness();
    const key = todoQueryKeys.byUser("user-1");
    queryClient.setQueryData(key, [originalTodo]);
    const { result } = renderHook(() => useCreateTodo(), { wrapper });

    act(() => result.current.mutate({ title: "Will fail", assigneeId: "user-1" }));
    await waitFor(() => expect(queryClient.getQueryData<OptimisticTodo[]>(key)?.length).toBe(2));
    await act(async () => { request.reject(new Error("Request failed")); await request.promise.catch(() => undefined); });
    await waitFor(() => expect(queryClient.getQueryData<TodoItem[]>(key)).toEqual([originalTodo]));
  });

  it("keeps overlapping optimistic items until each request settles", async () => {
    const first = deferred<TodoItem>();
    const second = deferred<TodoItem>();
    vi.spyOn(todosApi, "create").mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
    const { queryClient, wrapper } = createHarness();
    const key = todoQueryKeys.byUser("user-1");
    queryClient.setQueryData(key, [originalTodo]);
    const { result } = renderHook(() => [useCreateTodo(), useCreateTodo()] as const, { wrapper });

    act(() => {
      result.current[0].mutate({ title: "First", assigneeId: "user-1" });
      result.current[1].mutate({ title: "Second", assigneeId: "user-1" });
    });
    await waitFor(() => expect(queryClient.getQueryData<OptimisticTodo[]>(key)?.filter((item) => "isPending" in item && item.isPending)).toHaveLength(2));
    await act(async () => { first.resolve({ id: "saved-1", title: "First", assigneeId: "user-1", status: "doing", createdAt: "2026-10-17T00:00:00.000Z" }); await first.promise; });
    await waitFor(() => expect(queryClient.getQueryData<(TodoItem | OptimisticTodo)[]>(key)?.some((item) => item.title === "Second" && "isPending" in item)).toBe(true));
    await act(async () => { second.resolve({ id: "saved-2", title: "Second", assigneeId: "user-1", status: "doing", createdAt: "2026-10-17T00:00:01.000Z" }); await second.promise; });
    await waitFor(() => expect(queryClient.getQueryData<TodoItem[]>(key)?.map((item) => item.title)).toEqual(["Existing", "First", "Second"]));
  });
});

// Summary observers use the same detail cache, so optimistic records are counted once.
describe("task status and overview coherence", () => {
  it("retains pending creations across status success and rolls back only the failed creation", async () => {
    const creation = deferred<TodoItem>();
    const status = deferred<TodoItem>();
    vi.spyOn(todosApi, "create").mockReturnValue(creation.promise);
    vi.spyOn(todosApi, "updateStatus").mockReturnValue(status.promise);
    vi.spyOn(todosApi, "counts").mockResolvedValue({ "user-1": { doing: 0, done: 1 } });
    const { queryClient, wrapper } = createHarness();
    const key = todoQueryKeys.byUser("user-1");
    queryClient.setQueryData(key, [originalTodo]);
    queryClient.setQueryData(todoQueryKeys.counts, { "user-1": { doing: 1, done: 0 } });
    const { result } = renderHook(() => ({ create: useCreateTodo(), update: useUpdateTodoStatus("user-1"), counts: useTodoCounts() }), { wrapper });
    act(() => result.current.create.mutate({ title: "Pending", assigneeId: "user-1" }));
    await waitFor(() => expect(result.current.counts.data?.["user-1"]).toEqual({ doing: 2, done: 0 }));
    act(() => result.current.update.mutate({ id: "existing", status: "done" }));
    await act(async () => { status.resolve({ ...originalTodo, status: "done" }); await status.promise; });
    await waitFor(() => expect(result.current.counts.data?.["user-1"]).toEqual({ doing: 1, done: 1 }));
    expect(queryClient.getQueryData<TodoItem[]>(key)).toHaveLength(2);
    await act(async () => { creation.reject(new Error("Offline")); await creation.promise.catch(() => undefined); });
    await waitFor(() => expect(result.current.counts.data?.["user-1"]).toEqual({ doing: 0, done: 1 }));
    expect(queryClient.getQueryData<TodoItem[]>(key)).toEqual([{ ...originalTodo, status: "done" }]);
  });

  it("keeps original state on status failure and supports undo", async () => {
    vi.spyOn(todosApi, "updateStatus").mockRejectedValueOnce(new Error("Offline")).mockResolvedValueOnce({ ...originalTodo, status: "doing" });
    const { queryClient, wrapper } = createHarness();
    const key = todoQueryKeys.byUser("user-1");
    queryClient.setQueryData(key, [{ ...originalTodo, status: "done" }]);
    const { result } = renderHook(() => useUpdateTodoStatus("user-1"), { wrapper });
    act(() => result.current.mutate({ id: "existing", status: "doing" }));
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(queryClient.getQueryData<TodoItem[]>(key)?.[0].status).toBe("done");
    act(() => result.current.mutate({ id: "existing", status: "doing" }));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(queryClient.getQueryData<TodoItem[]>(key)?.[0].status).toBe("doing");
  });
});
