import { UserRound } from "lucide-react";
import { cn } from "./cn";

interface UserIdentityProps {
  username: string;
  size?: "compact" | "list" | "heading";
  className?: string;
}

const sizes = {
  compact: { avatar: "size-6", icon: 14, gap: "gap-2" },
  list: { avatar: "size-8", icon: 18, gap: "gap-3" },
  heading: { avatar: "size-10", icon: 22, gap: "gap-3" },
};

export function UserIdentity({ username, size = "list", className }: UserIdentityProps) {
  const style = sizes[size];
  return (
    <span className={cn("inline-flex min-w-0 max-w-full items-center align-middle", style.gap, className)}>
      <span aria-hidden="true" className={cn("inline-flex shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-600", style.avatar)}>
        <UserRound size={style.icon} aria-hidden="true" focusable="false" />
      </span>
      <span className="min-w-0 [overflow-wrap:anywhere]">{username}</span>
    </span>
  );
}
