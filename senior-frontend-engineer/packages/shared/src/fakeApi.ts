import { ApiError } from "./apiError";
import { seedTodos, seedUsers } from "./seed";
import { appStateStore, persistenceStatusAtom } from "./selectedUserIdAtom";
import type { CreateTodoInput, CreateUserInput, TodoItem, TodoCounts, UpdateTodoStatusInput, User } from "./types";

const STORAGE_KEY = "jtl-people-tasks:v1";
const SNAPSHOT_VERSION = 2;

interface DataSnapshot {
  version: 2;
  users: User[];
  todos: TodoItem[];
}

export interface StoragePort {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export type PersistenceStatus = "available" | "memory-only";

export interface FakeApiOptions {
  storage?: StoragePort | null;
  latencyMs?: number;
  beforeUpdateTodoStatus?: () => void | Promise<void>;
  beforeCreateTodo?: () => void | Promise<void>;
  onPersistenceStatusChange?: (status: PersistenceStatus) => void;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

function parseSnapshot(value: unknown): DataSnapshot | null {
  if (!isRecord(value) || (value.version !== 1 && value.version !== SNAPSHOT_VERSION)) return null;
  if (!Array.isArray(value.users) || !Array.isArray(value.todos)) return null;

  const userIds = new Set<string>();
  const usernames = new Set<string>();
  for (const candidate of value.users) {
    if (!isRecord(candidate) || typeof candidate.id !== "string" || typeof candidate.username !== "string") return null;
    const username = candidate.username;
    if (!candidate.id || userIds.has(candidate.id) || username !== username.trim() || username.length < 1 || username.length > 40 || usernames.has(username)) return null;
    userIds.add(candidate.id);
    usernames.add(username);
  }

  const todoIds = new Set<string>();
  for (const candidate of value.todos) {
    if (!isRecord(candidate) || typeof candidate.id !== "string" || typeof candidate.title !== "string" || typeof candidate.assigneeId !== "string" || typeof candidate.createdAt !== "string") return null;
    if (!candidate.id || todoIds.has(candidate.id) || !candidate.title.trim() || candidate.title !== candidate.title.trim() || candidate.title.length > 200 || !userIds.has(candidate.assigneeId) || Number.isNaN(Date.parse(candidate.createdAt))) return null;
    if (value.version === 2 && candidate.status !== "doing" && candidate.status !== "done") return null;
    todoIds.add(candidate.id);
  }

  return {
    version: 2,
    users: value.users.map((user) => ({ id: user.id as string, username: user.username as string })),
    todos: value.todos.map((todo) => ({
      id: todo.id as string, title: todo.title as string, assigneeId: todo.assigneeId as string,
      createdAt: todo.createdAt as string,
      status: value.version === 1 ? "doing" : todo.status as TodoItem["status"],
    })),
  };
}

function getBrowserStorage(): StoragePort | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

function wait(milliseconds: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));
}

function createId(prefix: string) {
  return `${prefix}-${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`}`;
}

export function createFakeApi(options: FakeApiOptions = {}) {
  const storage = options.storage === undefined ? getBrowserStorage() : options.storage;
  const latencyMs = Math.max(0, options.latencyMs ?? 120);
  let persistenceStatus: PersistenceStatus = storage ? "available" : "memory-only";
  let users = seedUsers.map((user) => ({ ...user }));
  let todos = seedTodos.map((todo) => ({ ...todo }));

  if (storage) {
    try {
      const serialized = storage.getItem(STORAGE_KEY);
      if (serialized) {
        const parsed: unknown = JSON.parse(serialized);
        const snapshot = parseSnapshot(parsed);
        if (snapshot) {
          users = snapshot.users.map((user) => ({ ...user }));
          todos = snapshot.todos.map((todo) => ({ ...todo }));
        }
      }
    } catch {
      persistenceStatus = "memory-only";
    }
  }
  options.onPersistenceStatusChange?.(persistenceStatus);

  function updatePersistenceStatus(status: PersistenceStatus) {
    if (status === persistenceStatus) return;
    persistenceStatus = status;
    options.onPersistenceStatusChange?.(status);
  }

  function persist() {
    if (!storage) {
      updatePersistenceStatus("memory-only");
      return;
    }
    try {
      const snapshot: DataSnapshot = { version: SNAPSHOT_VERSION, users, todos };
      storage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
      updatePersistenceStatus("available");
    } catch {
      updatePersistenceStatus("memory-only");
    }
  }

  async function delay() {
    if (latencyMs > 0) await wait(latencyMs);
  }

  return {
    getPersistenceStatus: () => persistenceStatus,

    async listUsers(): Promise<User[]> {
      await delay();
      return users.map((user) => ({ ...user }));
    },

    async getUserById(id: string): Promise<User> {
      await delay();
      const user = users.find((item) => item.id === id);
      if (!user) throw new ApiError("USER_NOT_FOUND", "This user could not be found.");
      return { ...user };
    },

    async createUser(input: CreateUserInput): Promise<User> {
      await delay();
      const username = input.username.trim();
      if (username.length < 1 || username.length > 40) {
        throw new ApiError("INVALID_USERNAME", "Enter a username from 1 to 40 characters.");
      }
      if (users.some((user) => user.username === username)) {
        throw new ApiError("USERNAME_TAKEN", "This username is already taken.");
      }
      const user = { id: createId("user"), username };
      users = [...users, user];
      persist();
      return { ...user };
    },

    async listTodosByUserId(assigneeId: string): Promise<TodoItem[]> {
      await delay();
      if (!users.some((user) => user.id === assigneeId)) {
        throw new ApiError("USER_NOT_FOUND", "This user could not be found.");
      }
      return todos.filter((todo) => todo.assigneeId === assigneeId).map((todo) => ({ ...todo }));
    },

    async listTodoCounts(): Promise<Record<string, TodoCounts>> {
      await delay();
      const counts = Object.fromEntries(users.map((user) => [user.id, { doing: 0, done: 0 }]));
      for (const todo of todos) counts[todo.assigneeId][todo.status] += 1;
      return counts;
    },

    async updateTodoStatus(input: UpdateTodoStatusInput): Promise<TodoItem> {
      await delay();
      if (options.beforeUpdateTodoStatus) await options.beforeUpdateTodoStatus();
      if (input.status !== "doing" && input.status !== "done") {
        throw new ApiError("INVALID_STATUS", "Choose Doing or Done.");
      }
      const existing = todos.find((todo) => todo.id === input.id);
      if (!existing) throw new ApiError("TODO_NOT_FOUND", "This task could not be found.");
      const updated = { ...existing, status: input.status };
      todos = todos.map((todo) => todo.id === updated.id ? updated : todo);
      persist();
      return { ...updated };
    },

    async createTodo(input: CreateTodoInput): Promise<TodoItem> {
      await delay();
      if (options.beforeCreateTodo) await options.beforeCreateTodo();
      const title = input.title.trim();
      if (title.length < 1 || title.length > 200) {
        throw new ApiError("INVALID_TITLE", "Enter a task title from 1 to 200 characters.");
      }
      if (!users.some((user) => user.id === input.assigneeId)) {
        throw new ApiError("ASSIGNEE_NOT_FOUND", "Choose an existing user.");
      }
      const todo: TodoItem = {
        id: createId("todo"),
        title,
        assigneeId: input.assigneeId,
        status: "doing",
        createdAt: new Date().toISOString(),
      };
      todos = [...todos, todo];
      persist();
      return { ...todo };
    },
  };
}

export const fakeApi = createFakeApi({
  onPersistenceStatusChange: (status) => appStateStore.set(persistenceStatusAtom, status),
});
