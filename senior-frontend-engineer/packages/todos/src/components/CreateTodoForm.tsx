import { UserIdentity } from "@jtl/shared/ui/UserIdentity";
import { useRef, useState, type FormEvent } from "react";
import { ApiError } from "@jtl/shared";
import { Button } from "@jtl/shared/ui/Button";
import { Input } from "@jtl/shared/ui/Input";
import { Label } from "@jtl/shared/ui/Label";
import { useCreateTodo } from "../hooks/useTodos";
import { validateCreateTodo } from "../validation";

interface CreateTodoFormProps {
  userId: string;
  username: string;
  onValidSubmit?: () => void;
}

export function CreateTodoForm({ userId: assigneeId, username, onValidSubmit }: CreateTodoFormProps) {
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState<{ title?: string; assigneeId?: string; request?: string }>({});
  const titleRef = useRef<HTMLInputElement>(null);
  const createTodo = useCreateTodo();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (createTodo.isPending) return;
    const validation = validateCreateTodo(title, assigneeId);
    setErrors(validation);
    if (validation.title) {
      titleRef.current?.focus();
      return;
    }
    if (validation.assigneeId) {
      return;
    }
    onValidSubmit?.();
    createTodo.mutate({ title: title.trim(), assigneeId }, {
      onSuccess: () => {
        setTitle("");
        setErrors({});
      },
      onError: (error) => {
        if (error instanceof ApiError && error.code === "ASSIGNEE_NOT_FOUND") {
          setErrors({ assigneeId: error.message });
              return;
        }
        setErrors({ request: "We could not create this task. Your draft is still here; please try again." });
      },
    });
  }

  function handleTitleChange(value: string) {
    setTitle(value);
    if (errors.title || errors.request) setErrors(validateCreateTodo(value, assigneeId));
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <div className="space-y-2">
        <Label htmlFor="todo-title">Task title</Label>
        <Input
          ref={titleRef}
          id="todo-title"
          name="title"
          disabled={createTodo.isPending}
          value={title}
          onChange={(event) => handleTitleChange(event.target.value)}
          maxLength={200}
          aria-describedby={errors.title ? "todo-title-help todo-title-error" : "todo-title-help"}
          aria-invalid={Boolean(errors.title)}
          required
        />
        <p id="todo-title-help" className="text-sm text-slate-600">1–200 characters.</p>
        {errors.title && <p id="todo-title-error" role="alert" className="text-sm font-medium text-red-700">{errors.title}</p>}
      </div>
      <p className="flex flex-wrap items-center gap-2 text-sm text-neutral-600"><span>Assigned to</span> <UserIdentity username={username} size="compact" className="font-medium text-black" /></p>
      {errors.assigneeId && <p role="alert" className="text-sm text-red-700">{errors.assigneeId}</p>}
      {errors.request && <p role="alert" className="text-sm font-medium text-red-700">{errors.request}</p>}
      <Button type="submit" disabled={createTodo.isPending || !assigneeId}>
        {createTodo.isPending ? "Creating…" : "Create task"}
      </Button>
      <p className="sr-only" role="status" aria-live="polite">{createTodo.isPending ? "Creating task" : ""}</p>
    </form>
  );
}
