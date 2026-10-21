import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { Archive, Check, Inbox, Trash2 } from "lucide-react";
import { api } from "@/convex/_generated/api.js";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty.tsx";

export default function InquiriesPage() {
  const items = useQuery(api.admin.listInquiries, {});
  const setStatus = useMutation(api.admin.setInquiryStatus);
  const remove = useMutation(api.admin.deleteInquiry);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Inquiries</h1>
        <p className="text-muted-foreground">Messages sent from the contact form.</p>
      </div>
      {items === undefined ? (
        <Skeleton className="h-32" />
      ) : items.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon"><Inbox /></EmptyMedia>
            <EmptyTitle>No inquiries yet</EmptyTitle>
            <EmptyDescription>New messages will appear here.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        items.map((m) => (
          <div key={m._id} className="space-y-2 rounded-xl border bg-card p-4">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold">{m.name}</p>
              <Badge variant={m.status === "new" ? "default" : "secondary"}>{m.status}</Badge>
              <span className="ml-auto text-xs text-muted-foreground">{new Date(m._creationTime).toLocaleString()}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              <a className="underline" href={`mailto:${m.email}`}>{m.email}</a>{m.phone ? ` · ${m.phone}` : ""}
            </p>
            <p className="whitespace-pre-wrap text-sm">{m.message}</p>
            <div className="flex gap-2 pt-1">
              <Button size="sm" variant="secondary" onClick={() => setStatus({ id: m._id, status: "read" })}><Check /> Mark read</Button>
              <Button size="sm" variant="secondary" onClick={() => setStatus({ id: m._id, status: "archived" })}><Archive /> Archive</Button>
              <Button size="sm" variant="ghost" onClick={() => remove({ id: m._id }).then(() => toast.success("Deleted"))}><Trash2 className="text-destructive" /></Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
