import { useMutation, useQuery } from "convex/react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Image, Layers, Inbox, Handshake, Wand2 } from "lucide-react";
import { api } from "@/convex/_generated/api.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Button } from "@/components/ui/button.tsx";

export default function AdminDashboard() {
  const stats = useQuery(api.admin.stats, {});
  const me = useQuery(api.admin.me, {});
  const seed = useMutation(api.seed.seedContent);

  const onSeed = async () => {
    const done = await seed({});
    toast[done ? "success" : "info"](done ? "Content from jesghana.com imported" : "Content already exists");
  };

  const cards = stats && [
    { label: "Active banners", value: stats.banners, icon: Image, to: "/admin/banners" },
    { label: "Services", value: stats.services, icon: Layers, to: "/admin/content" },
    { label: "Partners", value: stats.partners, icon: Handshake, to: "/admin/content" },
    { label: "New inquiries", value: stats.newInquiries, icon: Inbox, to: "/admin/inquiries" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back{me?.name ? `, ${me.name}` : ""}.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards
          ? cards.map((c) => (
              <Link key={c.label} to={c.to}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardHeader className="flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
                    <c.icon className="size-4 text-accent" />
                  </CardHeader>
                  <CardContent className="text-3xl font-bold">{c.value}</CardContent>
                </Card>
              </Link>
            ))
          : Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
      </div>
      {me?.role === "admin" && stats && stats.services === 0 && (
        <Card>
          <CardContent className="flex flex-col items-start gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm">Your site is empty. Import the existing jesghana.com text, services and a first banner.</p>
            <Button onClick={onSeed}><Wand2 /> Import starter content</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
