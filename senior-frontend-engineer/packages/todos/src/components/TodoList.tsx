import { CircleCheck, CircleDashed } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { TodoItem, TodoStatus } from "@jtl/shared";
import { useUpdateTodoStatus, type OptimisticTodo } from "../hooks/useTodos";

export type TodoFilter = "all" | TodoStatus;

interface FocusRequest {
  sourceId: string;
  nextId?: string;
  previousId?: string;
  shouldRestore: boolean;
  succeeded: boolean;
}

function StatusIcon({ status }: { status: TodoStatus }) {
  return status === "done"
    ? <CircleCheck size={22} strokeWidth={2} className="text-[#15803d]" aria-hidden="true" />
    : <CircleDashed size={22} strokeWidth={2} className="text-neutral-600" aria-hidden="true" />;
}

function TodoRow({
  item,
  onToggleStart,
  onToggleSuccess,
  buttonRef,
}: {
  item: TodoItem | OptimisticTodo;
  onToggleStart: (id: string) => void;
  onToggleSuccess: (id: string) => void;
  buttonRef: (element: HTMLButtonElement | null) => void;
}) {
  const update = useUpdateTodoStatus(item.assigneeId);
  const creating = "isPending" in item && item.isPending;
  const nextStatus = item.status === "done" ? "doing" : "done";
  const action = item.status === "done" ? "Undo" : "Mark done";

  async function handleToggle() {
    onToggleStart(item.id);
    try {
      await update.mutateAsync({ id: item.id, status: nextStatus });
      // The cache update may unmount this row before a per-call mutation callback runs.
      onToggleSuccess(item.id);
    } catch {
      // The mutation error remains visible on the unchanged row below.
    }
  }

  return (
    <li className="py-3">
      <div className="flex items-start gap-3">
        <button
          ref={buttonRef}
          type="button"
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={creating || update.isPending}
          aria-label={`${action}: ${item.title}`}
          title={`${action}: ${item.title}`}
          onClick={handleToggle}
        >
          <StatusIcon status={item.status} />
        </button>
        <p className="min-w-0 flex-1 pt-2.5 whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-sm font-medium leading-6 text-black">
          {item.title}
        </p>
      </div>
      {(creating || update.isPending) && <p role="status" className="sr-only">Saving {item.title}</p>}
      {update.isError && <p role="alert" className="ml-14 mt-1 text-sm text-red-700">Could not update this task. Use {item.status === "done" ? "Undo" : "Mark done"} to try again.</p>}
    </li>
  );
}

export function TodoList({
  items,
  filter,
  onFilterChange,
}: {
  items: Array<TodoItem | OptimisticTodo>;
  filter: TodoFilter;
  onFilterChange: (filter: TodoFilter) => void;
}) {
  const statusButtons = useRef(new Map<string, HTMLButtonElement>());
  const filterButtons = useRef(new Map<TodoFilter, HTMLButtonElement>());
  const focusRequest = useRef<FocusRequest | null>(null);
  const [focusTick, setFocusTick] = useState(0);
  const visibleItems = items.filter((item) => filter === "all" || item.status === filter);
  const counts = {
    all: items.length,
    doing: items.filter((item) => item.status === "doing").length,
    done: items.filter((item) => item.status === "done").length,
  };

  useEffect(() => {
    function handleFocusIn(event: FocusEvent) {
      const request = focusRequest.current;
      if (!request || !request.shouldRestore) return;
      const target = event.target;
      const sourceButton = statusButtons.current.get(request.sourceId);
      if (target instanceof HTMLElement && target !== sourceButton && target !== document.body) {
        request.shouldRestore = false;
      }
    }
    document.addEventListener("focusin", handleFocusIn);
    return () => document.removeEventListener("focusin", handleFocusIn);
  }, []);

  useLayoutEffect(() => {
    const request = focusRequest.current;
    if (!request?.succeeded || !request.shouldRestore) return;
    if (visibleItems.some((item) => item.id === request.sourceId)) return;
    const target = (request.nextId ? statusButtons.current.get(request.nextId) : undefined)
      ?? (request.previousId ? statusButtons.current.get(request.previousId) : undefined)
      ?? filterButtons.current.get(filter);
    target?.focus();
    request.shouldRestore = false;
    focusRequest.current = null;
  }, [filter, focusTick, visibleItems]);

  function handleToggleStart(id: string) {
    const index = visibleItems.findIndex((item) => item.id === id);
    const item = visibleItems[index];
    if (filter === "all" || !item || item.status !== filter) {
      focusRequest.current = null;
      return;
    }
    focusRequest.current = {
      sourceId: id,
      nextId: visibleItems[index + 1]?.id,
      previousId: visibleItems[index - 1]?.id,
      shouldRestore: true,
      succeeded: false,
    };
  }

  function handleToggleSuccess(id: string) {
    const request = focusRequest.current;
    if (!request || request.sourceId !== id || !request.shouldRestore) return;
    request.succeeded = true;
    setFocusTick((tick) => tick + 1);
  }

  const filters: Array<{ value: TodoFilter; label: string }> = [
    { value: "all", label: "All" },
    { value: "doing", label: "Doing" },
    { value: "done", label: "Done" },
  ];

  return (
    <section aria-labelledby="tasks-heading">
      <h3 id="tasks-heading" className="mb-4 text-lg font-semibold">Tasks</h3>
      <div className="mb-4 grid w-full grid-cols-3 gap-2" role="group" aria-label="Task filters">
        {filters.map(({ value, label }) => {
          const selected = filter === value;
          return (
            <button
              key={value}
              ref={(element) => {
                if (element) filterButtons.current.set(value, element);
                else filterButtons.current.delete(value);
              }}
              type="button"
              aria-pressed={selected}
              onClick={() => onFilterChange(value)}
              className={`min-h-11 min-w-0 rounded-xl border px-2 text-sm font-medium focus-visible:outline-none ${selected ? "border-black bg-black text-white" : "border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50"}`}
            >
              {label} <span className={selected ? "text-neutral-300" : "text-neutral-500"}>{counts[value]}</span>
            </button>
          );
        })}
      </div>
      {visibleItems.length > 0 ? (
        <ul className="divide-y divide-neutral-100">
          {visibleItems.map((item) => (
            <TodoRow
              key={item.id}
              item={item}
              onToggleStart={handleToggleStart}
              onToggleSuccess={handleToggleSuccess}
              buttonRef={(element) => {
                if (element) statusButtons.current.set(item.id, element);
                else statusButtons.current.delete(item.id);
              }}
            />
          ))}
        </ul>
      ) : (
        <p className="py-3 text-sm text-neutral-500">
          {filter === "all" ? "No tasks yet." : filter === "doing" ? "No tasks in progress." : "No completed tasks yet."}
        </p>
      )}
    </section>
  );
}
