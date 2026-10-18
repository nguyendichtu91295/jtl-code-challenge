import { UserIdentity } from "@jtl/shared/ui/UserIdentity";
import type { TodoCounts, User } from "@jtl/shared";

export interface UserListProps {
  users: User[];
  counts: Record<string, TodoCounts> | undefined;
  onViewDetails: (user: User) => void;
}

export function UserList({ users, counts, onViewDetails }: UserListProps) {
  if (!users.length) return <p className="text-sm text-neutral-600">No users yet. Add a user to get started.</p>;
  return <ul className="divide-y divide-neutral-100">{users.map((user) => (
    <li key={user.id}>
      <button type="button" onClick={() => onViewDetails(user)} className="flex min-h-20 w-full min-w-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-lg px-2 py-4 text-left hover:bg-neutral-50">
        <UserIdentity username={user.username} className="flex-1 basis-40 font-semibold text-black" />
        <span className="flex shrink-0 items-center gap-3 text-sm">
          {counts?.[user.id] ? <><span className="text-neutral-600">Doing <strong className="text-black">{counts[user.id].doing}</strong></span><span className="text-[#166534]">Done <strong>{counts[user.id].done}</strong></span></> : <span className="text-neutral-500">Counts unavailable</span>}
          <span aria-hidden="true" className="text-neutral-400">→</span>
        </span>
      </button>
    </li>
  ))}</ul>;
}
