import { Card } from "@jtl/shared/ui/Card";
import { useState } from "react";
import { CreateTodoForm } from "./CreateTodoForm";
import { TodoList } from "./TodoList";
import type { TodoFilter } from "./TodoList";
import { useTodos } from "../hooks/useTodos";

export function TodoWorkspace({ userId, username }: { userId: string; username: string }) {
  return <TodoWorkspaceContent key={userId} userId={userId} username={username} />;
}

function TodoWorkspaceContent({ userId, username }: { userId: string; username: string }) {
  const todos = useTodos(userId);
  const [filter, setFilter] = useState<TodoFilter>("all");

  return <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
    <Card className="p-5 sm:p-6">
      <h3 className="mb-5 text-lg font-semibold">Create a task</h3>
      {todos.isSuccess ? <CreateTodoForm key={userId} userId={userId} username={username} onValidSubmit={() => setFilter("all")} /> : <p className="text-sm text-neutral-500">Task creation is available after tasks load.</p>}
    </Card>
    <Card className="p-5 sm:p-6">
      {todos.isPending ? <p role="status">Loading tasks…</p>
        : todos.isError ? <div><p role="alert">Tasks could not be loaded.</p><button className="min-h-11 font-semibold" onClick={() => void todos.refetch()}>Try again</button></div>
          : <TodoList items={todos.data} filter={filter} onFilterChange={setFilter} />}
    </Card>
  </div>;
}
