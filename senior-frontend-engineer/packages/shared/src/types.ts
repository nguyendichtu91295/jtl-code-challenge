export interface User {
  id: string;
  username: string;
}

export type TodoStatus = "doing" | "done";

export interface TodoCounts {
  doing: number;
  done: number;
}

export interface UpdateTodoStatusInput {
  id: string;
  status: TodoStatus;
}

export interface TodoItem {
  status: TodoStatus;
  id: string;
  title: string;
  assigneeId: string;
  createdAt: string;
}

export interface CreateUserInput {
  username: string;
}

export interface CreateTodoInput {
  title: string;
  assigneeId: string;
}
