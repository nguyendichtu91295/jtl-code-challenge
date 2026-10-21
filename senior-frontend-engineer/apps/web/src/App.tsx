import { createRootRoute, createRoute, createRouter, createBrowserHistory, Link, Outlet, redirect, RouterProvider, useNavigate, useParams, type AnyRouter } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { persistenceStatusAtom, type TodoCounts } from "@jtl/shared";
import { UsersPage, UserDetailPage } from "@jtl/users";
import { TodoWorkspace, todoQueryKeys, useTodoCounts } from "@jtl/todos";

function RootLayout() {
  const persistenceStatus = useAtomValue(persistenceStatusAtom);
  return <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-6 sm:px-6 sm:py-10">
    <header className="mb-6 border-b border-neutral-200 pb-5 sm:mb-8">
      <p className="text-sm font-medium text-neutral-500">People & tasks</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Workspace</h1>
    </header>
    {persistenceStatus === "memory-only" && <p className="mb-5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950" role="status">Changes cannot be saved on this device. They will remain available until you close or refresh this page.</p>}
    <Outlet />
  </main>;
}

function UserDetailRoute() {
  const { userId } = useParams({ from: "/users/$userId" });
  return <div>
    <Link to="/users" className="mb-5 inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-medium text-neutral-600 hover:text-black"><ArrowLeft size={18} aria-hidden="true" />Back to users</Link>
    <UserDetailPage key={userId} userId={userId}>{(user) => <TodoWorkspace userId={user.id} username={user.username} />}</UserDetailPage>
  </div>;
}

function UsersRoute() {
  const navigate = useNavigate();
  const client = useQueryClient();
  const counts = useTodoCounts();
  return <UsersPage counts={counts.data} countsPending={counts.isPending} countsError={counts.isError}
    onRetryCounts={() => void counts.refetch()}
    onCreated={(user) => {
      client.setQueryData<Record<string, TodoCounts>>(todoQueryKeys.counts, (current) => current ? { ...current, [user.id]: { doing: 0, done: 0 } } : current);
      void client.invalidateQueries({ queryKey: todoQueryKeys.counts });
    }}
    onViewDetails={(user) => void navigate({ to: "/users/$userId", params: { userId: user.id } })}
  />;
}

const rootRoute = createRootRoute({ component: RootLayout, notFoundComponent: () => <div><h2 className="text-xl font-semibold">Page not found</h2><Link to="/users" className="mt-4 inline-flex min-h-11 items-center underline">Back to users</Link></div> });
const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: "/", beforeLoad: () => { throw redirect({ to: "/users" }); } });
const usersRoute = createRoute({ getParentRoute: () => rootRoute, path: "/users", component: UsersRoute });
const userDetailRoute = createRoute({ getParentRoute: () => rootRoute, path: "/users/$userId", component: UserDetailRoute });
const routeTree = rootRoute.addChildren([indexRoute, usersRoute, userDetailRoute]);

export function createAppRouter(history = createBrowserHistory()) {
  return createRouter({ routeTree, history });
}

const router = createAppRouter();

declare module "@tanstack/react-router" { interface Register { router: typeof router } }
export function App({ appRouter = router }: { appRouter?: AnyRouter }) { return <RouterProvider router={appRouter} />; }
