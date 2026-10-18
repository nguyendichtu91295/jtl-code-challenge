import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../api/usersApi";
import type { CreateUserInput, User } from "@jtl/shared";

export const userQueryKeys = {
  all: ["users"] as const,
  detail: (userId: string) => ["users", userId] as const,
};

export function useUsers() {
  return useQuery({ queryKey: userQueryKeys.all, queryFn: usersApi.list });
}

export function useUser(userId: string) {
  return useQuery({
    queryKey: userQueryKeys.detail(userId),
    queryFn: () => usersApi.getById(userId),
    enabled: Boolean(userId),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateUserInput) => usersApi.create(input),
    onSuccess: async (user: User) => {
      queryClient.setQueryData<User[]>(userQueryKeys.all, (users) =>
        users ? [...users.filter((item) => item.id !== user.id), user] : [user],
      );
      queryClient.setQueryData(userQueryKeys.detail(user.id), user);
      await queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
    },
  });
}
