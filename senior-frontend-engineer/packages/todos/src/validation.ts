export const TODO_TITLE_MIN_LENGTH = 1;
export const TODO_TITLE_MAX_LENGTH = 200;

export interface CreateTodoErrors {
  title?: string;
  assigneeId?: string;
}

export function validateCreateTodo(titleValue: string, assigneeId: string): CreateTodoErrors {
  const title = titleValue.trim();
  if (!title.length) return { title: "Enter a task title." };
  if (title.length > TODO_TITLE_MAX_LENGTH) return { title: "Task title must be 200 characters or fewer." };
  if (!assigneeId) return { assigneeId: "Choose a user." };
  return {};
}
