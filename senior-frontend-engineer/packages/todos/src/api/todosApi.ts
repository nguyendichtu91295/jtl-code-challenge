import { fakeApi } from "@jtl/shared";

export const todosApi = {
  listByUserId: fakeApi.listTodosByUserId,
  counts: fakeApi.listTodoCounts,
  updateStatus: fakeApi.updateTodoStatus,
  create: fakeApi.createTodo,
};
