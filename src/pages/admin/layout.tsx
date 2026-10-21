import { NavLink, Outlet } from "react-router-dom";
import { Authenticated, AuthLoading, Unauthenticated, useQuery } from "convex/react";
import {
  LayoutDashboard, Image, Layers, Inbox, Settings, Users, HardHat, Newspaper, ExternalLink, ShieldAlert,
} from "lucide-react";
import { api } from "@/convex/_generated/api.js";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Button } from "@/components/ui/button.tsx";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/banners", label: "Banners", icon: Image },
  { to: "/admin/content", label: "Content", icon: Layers },
  { to: "/admin/posts", label: "Blog posts", icon: Newspaper },
  { to: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { to: "/admin/settings", label: "Site settings", icon: Settings },
  { to: "/admin/users", label: "Users", icon: Users, adminOnly: true },
];

function Shell() {
  const me = useQuery(api.admin.me, {});
  if (me === undefined) return <Skeleton className="m-8 h-64" />;
  if (!me?.role) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 p-6 text-center">
        <ShieldAlert className="size-10 text-destructive" />
        <h1 className="text-xl font-bold">No access yet</h1>
        <p className="text-sm text-muted-foreground">
          Your account is signed in but has not been given admin access. Ask the site admin to assign you a role.
        </p>
        <SignInButton variant="secondary" />
      </div>
    );
  }
  const items = NAV.filter((n) => !n.adminOnly || me.role === "admin");
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="border-b bg-zinc-900 text-white md:w-60 md:border-b-0">
        <div className="flex items-center gap-2 p-4 font-bold">
          <HardHat className="size-5 text-accent" /> JES Admin
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-2 md:flex-col md:pb-0">
          {items.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${isActive ? "bg-white/15 font-semibold" : "opacity-80 hover:bg-white/10"}`
              }
            >
              <n.icon className="size-4" /> {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden space-y-2 p-4 md:block">
          <Button asChild variant="ghost" size="sm" className="w-full justify-start">
            <a href="/"><ExternalLink /> View site</a>
          </Button>
          <SignInButton variant="ghost" size="sm" className="w-full justify-start" />
        </div>
      </aside>
      <main className="flex-1 bg-background p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default function AdminLayout() {
  return (
    <>
      <AuthLoading><Skeleton className="m-8 h-64" /></AuthLoading>
      <Unauthenticated>
        <div className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center gap-4 p-6 text-center">
          <HardHat className="size-10 text-accent" />
          <h1 className="text-2xl font-bold">JES Ghana admin</h1>
          <p className="text-sm text-muted-foreground">Sign in to manage banners, content and enquiries.</p>
          <SignInButton signInText="Sign in" />
        </div>
      </Unauthenticated>
      <Authenticated><Shell /></Authenticated>
    </>
  );
}
