export const USERNAME_MIN_LENGTH = 1;
export const USERNAME_MAX_LENGTH = 40;

export interface CreateUserErrors {
  username?: string;
}

export function validateUsername(value: string): CreateUserErrors {
  const username = value.trim();
  if (username.length < USERNAME_MIN_LENGTH) return { username: "Enter a username." };
  if (username.length > USERNAME_MAX_LENGTH) return { username: "Username must be 40 characters or fewer." };
  return {};
}
