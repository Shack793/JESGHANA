import { Link, NavLink, Outlet } from "react-router-dom";
import { useQuery } from "convex/react";
import { MapPin, Phone, Clock, Mail, Menu } from "lucide-react";
import { api } from "@/convex/_generated/api.js";
import { Button } from "@/components/ui/button.tsx";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet.tsx";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

function NavLinks({ className }: { className?: string }) {
  return (
    <>
      {LINKS.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          end
          className={({ isActive }) =>
            `${className ?? ""} text-sm font-medium transition-colors hover:text-accent ${isActive ? "text-accent" : "text-foreground"}`
          }
        >
          {l.label}
        </NavLink>
      ))}
    </>
  );
}

export default function PublicLayout() {
  const home = useQuery(api.site.getHome, {});
  const s = home?.settings;
  return (
    <div className="flex min-h-screen flex-col overflow-x-clip">
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-bold tracking-tight">
            <img src="https://hercules-cdn.com/file_FrYSiv3qp3iByshxwGm0wbPW" alt="Jurhette Engineering Services" className="h-9 w-auto rounded-sm" />
            <span className="hidden sm:inline">JES Ghana</span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <NavLinks />
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link to="/contact">Get a quote</Link>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent className="flex flex-col gap-6 p-8 pt-16">
                <NavLinks className="text-lg" />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-zinc-900 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
          <div className="space-y-3">
            <p className="text-lg font-bold">{s?.companyName ?? "Jurhette Engineering Services"}</p>
            <p className="text-sm opacity-80">{s?.tagline ?? "One For All Engineering Services"}</p>
          </div>
          <ul className="space-y-3 text-sm opacity-90">
            <li className="flex gap-2"><MapPin className="size-4 shrink-0" />{s?.address ?? "Tema Community 22"}</li>
            <li className="flex gap-2"><Clock className="size-4 shrink-0" />{s?.hours ?? "Mon - Fri: 9am - 5pm"}</li>
            <li className="flex gap-2"><Phone className="size-4 shrink-0" />{s?.phones ?? "0503884224"}</li>
            {s?.email && <li className="flex gap-2"><Mail className="size-4 shrink-0" />{s.email}</li>}
          </ul>
          <div className="flex flex-col gap-2 text-sm">
            <NavLinks className="!text-white" />
            <Link to="/admin" className="opacity-60 hover:opacity-100">Staff login</Link>
          </div>
        </div>
        <p className="border-t border-white/10 py-4 text-center text-xs opacity-70">
          &copy; {new Date().getFullYear()} {s?.companyName ?? "Jurhette Engineering Services"}. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
