import { describe, expect, it } from "vitest";
import { createFakeApi, type StoragePort } from "./fakeApi";

function createMemoryStorage(initialValue: string | null = null): StoragePort & { value: string | null } {
  return {
    value: initialValue,
    getItem() { return this.value; },
    setItem(_key, value) { this.value = value; },
  };
}

describe("fake API persistence and domain constraints", () => {
  it("restores valid snapshots and falls back for malformed or unsupported snapshots", async () => {
    const storage = createMemoryStorage();
    const initial = createFakeApi({ storage, latencyMs: 0 });
    const created = await initial.createUser({ username: "  Taylor  " });
    const restored = createFakeApi({ storage, latencyMs: 0 });
    expect(await restored.getUserById(created.id)).toEqual({ id: created.id, username: "Taylor" });

    storage.value = "{";
    const malformed = createFakeApi({ storage, latencyMs: 0 });
    expect((await malformed.listUsers()).map((user) => user.username)).toEqual(["alex", "morgan", "sam"]);
    storage.value = JSON.stringify({ version: 99, users: [], todos: [] });
    const unsupported = createFakeApi({ storage, latencyMs: 0 });
    expect((await unsupported.listUsers()).map((user) => user.username)).toEqual(["alex", "morgan", "sam"]);
  });

  it("enforces trimmed, case-sensitive uniqueness against the data set including concurrent requests", async () => {
    const api = createFakeApi({ storage: createMemoryStorage(), latencyMs: 0 });
    await api.createUser({ username: "  Alice  " });
    await api.createUser({ username: "alice" });
    const results = await Promise.allSettled([
      api.createUser({ username: "Alice" }),
      api.createUser({ username: " Alice " }),
    ]);
    expect(results.filter((result) => result.status === "fulfilled")).toHaveLength(0);
    expect((await api.listUsers()).map((user) => user.username)).toContain("alice");
  });

  it("enforces username and todo title limits at the API boundary", async () => {
    const api = createFakeApi({ storage: createMemoryStorage(), latencyMs: 0 });
    await expect(api.createUser({ username: "   " })).rejects.toMatchObject({ code: "INVALID_USERNAME" });
    await expect(api.createUser({ username: "u".repeat(41) })).rejects.toMatchObject({ code: "INVALID_USERNAME" });
    await expect(api.createTodo({ title: "   ", assigneeId: "user-1" })).rejects.toMatchObject({ code: "INVALID_TITLE" });
    await expect(api.createTodo({ title: "t".repeat(201), assigneeId: "user-1" })).rejects.toMatchObject({ code: "INVALID_TITLE" });
  });

  it("does not fail a successful in-memory mutation when storage writes fail", async () => {
    const storage: StoragePort = {
      getItem: () => null,
      setItem: () => { throw new DOMException("Quota exceeded", "QuotaExceededError"); },
    };
    const statuses: string[] = [];
    const api = createFakeApi({ storage, latencyMs: 0, onPersistenceStatusChange: (status) => statuses.push(status) });
    const created = await api.createUser({ username: "Casey" });
    expect(await api.getUserById(created.id)).toEqual(created);
    expect(api.getPersistenceStatus()).toBe("memory-only");
    expect(statuses).toContain("memory-only");
  });

  it("does not mutate or persist data when a todo request fails or the assignee is missing", async () => {
    const storage = createMemoryStorage();
    const before = storage.value;
    const api = createFakeApi({ storage, latencyMs: 0, beforeCreateTodo: () => { throw new Error("forced failure"); } });
    await expect(api.createTodo({ title: "Unpersisted", assigneeId: "user-1" })).rejects.toThrow("forced failure");
    expect(storage.value).toBe(before);

    const regularApi = createFakeApi({ storage, latencyMs: 0 });
    await expect(regularApi.createTodo({ title: "No user", assigneeId: "missing" })).rejects.toMatchObject({ code: "ASSIGNEE_NOT_FOUND" });
  });

  it("uses memory when storage cannot be read", async () => {
    const storage: StoragePort = {
      getItem: () => { throw new DOMException("Blocked", "SecurityError"); },
      setItem: () => { throw new DOMException("Blocked", "SecurityError"); },
    };
    const api = createFakeApi({ storage, latencyMs: 0 });
    expect(api.getPersistenceStatus()).toBe("memory-only");
    expect((await api.listUsers()).length).toBeGreaterThan(0);
  });
});

describe("task status migration and summaries", () => {
  it("migrates saved v1 users and tasks without losing their identities", async () => {
    const legacy = { version: 1, users: [{ id: "custom", username: "Alice" }], todos: [{ id: "legacy", title: "Keep this", assigneeId: "custom", createdAt: "2026-10-01T00:00:00.000Z" }] };
    const storage = createMemoryStorage(JSON.stringify(legacy));
    const api = createFakeApi({ storage, latencyMs: 0 });
    expect(await api.listUsers()).toEqual(legacy.users);
    expect(await api.listTodosByUserId("custom")).toEqual([{ ...legacy.todos[0], status: "doing" }]);
    await api.updateTodoStatus({ id: "legacy", status: "done" });
    expect(JSON.parse(storage.value!).version).toBe(2);
    const restored = createFakeApi({ storage, latencyMs: 0 });
    expect(await restored.listTodoCounts()).toEqual({ custom: { doing: 0, done: 1 } });
    await restored.updateTodoStatus({ id: "legacy", status: "doing" });
    expect((await createFakeApi({ storage, latencyMs: 0 }).listTodosByUserId("custom"))[0].status).toBe("doing");
  });

  it("counts every user, defaults new tasks to doing, and isolates status changes", async () => {
    const api = createFakeApi({ storage: null, latencyMs: 0 });
    const task = await api.createTodo({ title: "New", assigneeId: "user-3" });
    expect(task.status).toBe("doing");
    await api.updateTodoStatus({ id: task.id, status: "done" });
    expect(await api.listTodoCounts()).toEqual({ "user-1": { doing: 1, done: 0 }, "user-2": { doing: 1, done: 0 }, "user-3": { doing: 0, done: 1 } });
    const user = await api.createUser({ username: "Zero" });
    expect((await api.listTodoCounts())[user.id]).toEqual({ doing: 0, done: 0 });
    await expect(api.updateTodoStatus({ id: "missing", status: "done" })).rejects.toMatchObject({ code: "TODO_NOT_FOUND" });
    // @ts-expect-error Runtime boundary must also reject invalid status values.
    await expect(api.updateTodoStatus({ id: task.id, status: "invalid" })).rejects.toMatchObject({ code: "INVALID_STATUS" });
  });

  it("does not change or persist a failed status update", async () => {
    const storage = createMemoryStorage();
    const api = createFakeApi({ storage, latencyMs: 0, beforeUpdateTodoStatus: () => { throw new Error("Offline"); } });
    await expect(api.updateTodoStatus({ id: "todo-1", status: "done" })).rejects.toThrow("Offline");
    expect((await api.listTodosByUserId("user-1"))[0].status).toBe("doing");
    expect(storage.value).toBeNull();
  });

  it("rejects malformed v2 statuses and preserves in-memory status when writes fail", async () => {
    const invalid = createMemoryStorage(JSON.stringify({ version: 2, users: [{ id: "custom", username: "Alice" }], todos: [{ id: "legacy", title: "Keep this", assigneeId: "custom", createdAt: "2026-10-01T00:00:00.000Z", status: "other" }] }));
    expect((await createFakeApi({ storage: invalid, latencyMs: 0 }).listUsers())[0].id).toBe("user-1");
    const api = createFakeApi({ storage: { getItem: () => null, setItem: () => { throw new Error("Blocked"); } }, latencyMs: 0 });
    await api.updateTodoStatus({ id: "todo-1", status: "done" });
    expect((await api.listTodosByUserId("user-1"))[0].status).toBe("done");
    expect(api.getPersistenceStatus()).toBe("memory-only");
  });
});
