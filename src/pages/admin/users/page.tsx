import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import { api } from "@/convex/_generated/api.js";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Navigate } from "react-router-dom";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select.tsx";

export default function UsersPage() {
  const me = useQuery(api.admin.me, {});
  const users = useQuery(api.admin.listUsers, me?.role === "admin" ? {} : "skip");
  const setRole = useMutation(api.admin.setUserRole);

  if (me && me.role !== "admin") return <Navigate to="/admin" replace />;
  if (!users) return <Skeleton className="h-48" />;

  const onChange = async (id: (typeof users)[number]["_id"], role: "admin" | "editor" | "none") => {
    try {
      await setRole({ id, role });
      toast.success("Role updated");
    } catch (e) {
      toast.error(e instanceof ConvexError ? "Not allowed" : "Failed");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-muted-foreground">Anyone who has signed in appears here. Give them a role to grant admin access.</p>
      </div>
      <div className="divide-y rounded-xl border bg-card">
        {users.map((u) => (
          <div key={u._id} className="flex items-center gap-3 p-4">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{u.name ?? "Unnamed"}</p>
              <p className="truncate text-sm text-muted-foreground">{u.email}</p>
            </div>
            <Select
              value={u.role ?? "none"}
              disabled={u._id === me?._id}
              onValueChange={(r) => onChange(u._id, r as "admin" | "editor" | "none")}
            >
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="none">No access</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </div>
  );
}
