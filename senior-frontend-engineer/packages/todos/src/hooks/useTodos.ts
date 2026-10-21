import { useMutation, useQueries, useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import type { CreateTodoInput, TodoCounts, TodoItem, UpdateTodoStatusInput } from "@jtl/shared";
import { todosApi } from "../api/todosApi";

export const todoQueryKeys = {
  all: ["todos"] as const,
  byUser: (userId: string) => ["todos", "by-user", userId] as const,
  counts: ["todos", "counts"] as const,
  create: ["todos", "create"] as const,
  status: ["todos", "status"] as const,
};

export interface OptimisticTodo extends TodoItem { isPending: true }
type CachedTodo = TodoItem | OptimisticTodo;
interface OptimisticContext { assigneeId: string; optimisticId: string }

async function refreshWhenSettled(client: QueryClient) {
  // The current mutation is still pending inside onSettled. Never refetch over another write.
  if (client.isMutating({ mutationKey: todoQueryKeys.all }) <= 1) {
    await client.invalidateQueries({ queryKey: todoQueryKeys.all });
  }
}

export function useTodos(userId: string | null) {
  const client = useQueryClient();
  return useQuery({
    queryKey: userId ? todoQueryKeys.byUser(userId) : [...todoQueryKeys.all, "none"],
    queryFn: async () => {
      const saved = await todosApi.listByUserId(userId!);
      const current = client.getQueryData<CachedTodo[]>(todoQueryKeys.byUser(userId!));
      // Refocus/navigation refetches must not hide in-flight creations.
      return [...saved, ...(current?.filter((item) => "isPending" in item && item.isPending) ?? [])];
    },
    enabled: Boolean(userId),
  });
}

export function useTodoCounts() {
  const summary = useQuery({ queryKey: todoQueryKeys.counts, queryFn: todosApi.counts });
  const userIds = Object.keys(summary.data ?? {});
  // Observe existing detail caches without issuing a request for each user.
  const details = useQueries({ queries: userIds.map((userId) => ({
    queryKey: todoQueryKeys.byUser(userId),
    queryFn: () => todosApi.listByUserId(userId),
    enabled: false,
  })) });
  const data = summary.data ? Object.fromEntries(userIds.map((id, index) => {
    const items = details[index].data;
    const counts = items?.reduce<TodoCounts>((total, item) => {
      total[item.status] += 1;
      return total;
    }, { doing: 0, done: 0 });
    return [id, counts ?? summary.data[id]];
  })) : undefined;
  return { ...summary, data };
}

export function useCreateTodo() {
  const queryClient = useQueryClient();
  return useMutation<TodoItem, Error, CreateTodoInput, OptimisticContext>({
    mutationKey: todoQueryKeys.create,
    mutationFn: todosApi.create,
    onMutate: async (variables) => {
      const queryKey = todoQueryKeys.byUser(variables.assigneeId);
      await queryClient.cancelQueries({ queryKey });
      const optimisticId = `pending-${crypto.randomUUID()}`;
      const optimisticTodo: OptimisticTodo = {
        id: optimisticId, title: variables.title.trim(), assigneeId: variables.assigneeId,
        status: "doing", createdAt: new Date().toISOString(), isPending: true,
      };
      queryClient.setQueryData<CachedTodo[]>(queryKey, (current = []) => [...current, optimisticTodo]);
      return { assigneeId: variables.assigneeId, optimisticId };
    },
    onSuccess: (created, _variables, context) => {
      queryClient.setQueryData<CachedTodo[]>(todoQueryKeys.byUser(context.assigneeId), (current = []) =>
        [...current.filter((item) => item.id !== context.optimisticId && item.id !== created.id), created],
      );
    },
    onError: (_error, _variables, context) => {
      if (!context) return;
      queryClient.setQueryData<CachedTodo[]>(todoQueryKeys.byUser(context.assigneeId), (current) =>
        current?.filter((item) => item.id !== context.optimisticId),
      );
    },
    onSettled: () => refreshWhenSettled(queryClient),
  });
}

export function useUpdateTodoStatus(assigneeId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationKey: todoQueryKeys.status,
    mutationFn: (input: UpdateTodoStatusInput) => todosApi.updateStatus(input),
    onMutate: () => client.cancelQueries({ queryKey: todoQueryKeys.byUser(assigneeId) }),
    onSuccess: (updated) => {
      client.setQueryData<CachedTodo[]>(todoQueryKeys.byUser(updated.assigneeId), (current) =>
        current?.map((item) => item.id === updated.id ? updated : item),
      );
    },
    onSettled: () => refreshWhenSettled(client),
  });
}

export type { TodoItem, CreateTodoInput } from "@jtl/shared";
