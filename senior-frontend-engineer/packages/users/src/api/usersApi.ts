import { fakeApi } from "@jtl/shared";

export const usersApi = {
  list: fakeApi.listUsers,
  getById: fakeApi.getUserById,
  create: fakeApi.createUser,
};
