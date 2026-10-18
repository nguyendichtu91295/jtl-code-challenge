import { UserIdentity } from "@jtl/shared/ui/UserIdentity";
import { useState, type ReactNode } from "react";
import { Card } from "@jtl/shared/ui/Card";
import { Button } from "@jtl/shared/ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@jtl/shared/ui/Dialog";
import { ApiError, type TodoCounts, type User } from "@jtl/shared";
import { CreateUserForm } from "./CreateUserForm";
import { UserList } from "./UserList";
import { useUser, useUsers } from "../hooks/useUsers";

interface UsersPageProps {
  onCreated: (user: User) => void;
  onViewDetails: (user: User) => void;
  counts: Record<string, TodoCounts> | undefined;
  countsPending: boolean;
  countsError: boolean;
  onRetryCounts: () => void;
}

export function UsersPage({ onCreated, onViewDetails, counts, countsPending, countsError, onRetryCounts }: UsersPageProps) {
  const users = useUsers();
  const [open, setOpen] = useState(false);
  return <div className="space-y-6">
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-2xl font-semibold tracking-tight">Users</h2>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild><Button>Add user</Button></DialogTrigger>
        <DialogContent>
          <DialogTitle className="pr-8 text-xl font-semibold">Add user</DialogTitle>
          <DialogDescription className="mb-5 mt-2 text-sm text-neutral-600">Create a user to assign tasks to.</DialogDescription>
          <CreateUserForm onCreated={(user) => { onCreated(user); setOpen(false); }} />
        </DialogContent>
      </Dialog>
    </div>
    <Card className="p-4 sm:p-6">
      {countsPending && <p role="status" className="mb-3 text-sm text-neutral-500">Loading task counts…</p>}
      {countsError && <div className="mb-3"><p role="alert" className="text-sm text-red-700">Task counts could not be loaded.</p><Button variant="ghost" onClick={onRetryCounts}>Retry counts</Button></div>}
      {users.isPending ? <p role="status">Loading users…</p>
        : users.isError ? <div><p role="alert">Users could not be loaded.</p><Button variant="ghost" onClick={() => void users.refetch()}>Try again</Button></div>
          : <UserList users={users.data} counts={countsError ? undefined : counts} onViewDetails={onViewDetails} />}
    </Card>
  </div>;
}

export function UserDetailPage({ userId, children }: { userId: string; children: (user: User) => ReactNode }) {
  const user = useUser(userId);
  if (user.isPending) return <p role="status">Loading user…</p>;
  if (user.isError) {
    const missing = user.error instanceof ApiError && user.error.code === "USER_NOT_FOUND";
    return <div><p role="alert">{missing ? "This user could not be found." : "We could not load this user."}</p>
      {!missing && <Button variant="ghost" onClick={() => void user.refetch()}>Try again</Button>}
    </div>;
  }
  return <div className="space-y-6">
    <div><h2 className="break-words text-2xl font-semibold"><UserIdentity username={user.data.username} size="heading" /></h2><p className="mt-2 text-sm text-neutral-500">Assigned tasks</p></div>
    {children(user.data)}
  </div>;
}
