import type { TodoItem, User } from "./types";

export const seedUsers: User[] = [
  { id: "user-1", username: "alex" },
  { id: "user-2", username: "morgan" },
  { id: "user-3", username: "sam" },
];

export const seedTodos: TodoItem[] = [
  { id: "todo-1", title: "Review the project plan", assigneeId: "user-1", status: "doing", createdAt: "2026-10-01T09:00:00.000Z" },
  { id: "todo-2", title: "Prepare the weekly update", assigneeId: "user-2", status: "doing", createdAt: "2026-10-01T10:30:00.000Z" },
];
