import { useRef, useState, type FormEvent } from "react";
import { ApiError } from "@jtl/shared";
import { Button } from "@jtl/shared/ui/Button";
import { Input } from "@jtl/shared/ui/Input";
import { Label } from "@jtl/shared/ui/Label";
import type { User } from "@jtl/shared";
import { useCreateUser } from "../hooks/useUsers";
import { validateUsername } from "../validation";

interface CreateUserFormProps {
  onCreated: (user: User) => void;
}

export function CreateUserForm({ onCreated }: CreateUserFormProps) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const createUser = useCreateUser();

  function handleChange(value: string) {
    setUsername(value);
    if (error) setError(validateUsername(value).username ?? "");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (createUser.isPending) return;
    const validation = validateUsername(username);
    if (validation.username) {
      setError(validation.username);
      inputRef.current?.focus();
      return;
    }
    setError("");
    createUser.mutate({ username: username.trim() }, {
      onSuccess: (user) => {
        setUsername("");
        setError("");
        onCreated(user);
      },
      onError: (cause) => {
        setError(cause instanceof ApiError && cause.code === "USERNAME_TAKEN"
          ? cause.message
          : "We could not create this user. Please try again.");
        inputRef.current?.focus();
      },
    });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          ref={inputRef}
          id="username"
          name="username"
          autoComplete="off"
          maxLength={80}
          disabled={createUser.isPending}
          value={username}
          onChange={(event) => handleChange(event.target.value)}
          aria-describedby={error ? "username-help username-error" : "username-help"}
          aria-invalid={Boolean(error)}
          required
        />
        <p id="username-help" className="text-sm text-slate-600">1–40 characters. Case-sensitive; must be unique.</p>
        {error && <p id="username-error" className="text-sm font-medium text-red-700" role="alert">{error}</p>}
      </div>
      <Button type="submit" disabled={createUser.isPending}>
        {createUser.isPending ? "Creating…" : "Create user"}
      </Button>
      <p className="sr-only" role="status" aria-live="polite">{createUser.isPending ? "Creating user" : ""}</p>
    </form>
  );
}
