import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { api } from "@/convex/_generated/api.js";
import type { Doc } from "@/convex/_generated/dataModel.d.ts";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs.tsx";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx";

type BlockType = Doc<"contentBlocks">["type"];
const TABS: { type: BlockType; label: string }[] = [
  { type: "service", label: "Services" },
  { type: "value", label: "Core values" },
  { type: "partner", label: "OEM partners" },
  { type: "scope", label: "Work scopes" },
  { type: "feature", label: "Highlights" },
  { type: "process", label: "Process steps" },
  { type: "faq", label: "FAQs" },
  { type: "testimonial", label: "Testimonials" },
];

function BlockDialog({ type, block, onClose }: { type: BlockType; block: Doc<"contentBlocks"> | null; onClose: () => void }) {
  const create = useMutation(api.admin.createBlock);
  const update = useMutation(api.admin.updateBlock);
  const [active, setActive] = useState(block?.active ?? true);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const title = String(data.get("title"));
    const description = String(data.get("description"));
    const meta = String(data.get("meta") || "") || undefined;
    if (block) await update({ id: block._id, title, description, meta, active });
    else await create({ type, title, description, meta, active });
    toast.success("Saved");
    onClose();
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>{block ? "Edit item" : "New item"}</DialogTitle></DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3">
          <Input name="title" placeholder="Title" defaultValue={block?.title} required />
          <Textarea name="description" placeholder={type === "scope" ? "One bullet per line" : "Description"} defaultValue={block?.description} rows={4} required />
          {type === "testimonial" && <Input name="meta" placeholder="Location, e.g. Kumasi, Ghana" defaultValue={block?.meta} />}
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={active} onCheckedChange={setActive} /> Show on website
          </label>
          <DialogFooter><Button type="submit">Save</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function BlockList({ type }: { type: BlockType }) {
  const blocks = useQuery(api.admin.listBlocks, { type });
  const remove = useMutation(api.admin.deleteBlock);
  const [editing, setEditing] = useState<Doc<"contentBlocks"> | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-3">
      <Button onClick={() => { setEditing(null); setOpen(true); }}><Plus /> Add</Button>
      {blocks === undefined ? (
        <Skeleton className="h-24" />
      ) : blocks.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Nothing here yet.</p>
      ) : (
        blocks.map((b) => (
          <div key={b._id} className="flex items-center gap-3 rounded-xl border bg-card p-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold">{b.title}</p>
                {!b.active && <Badge variant="secondary">Hidden</Badge>}
              </div>
              <p className="line-clamp-2 text-sm text-muted-foreground">{b.description}</p>
            </div>
            <Button size="icon" variant="ghost" onClick={() => { setEditing(b); setOpen(true); }}><Pencil /></Button>
            <Button size="icon" variant="ghost" onClick={() => remove({ id: b._id }).then(() => toast.success("Deleted"))}><Trash2 className="text-destructive" /></Button>
          </div>
        ))
      )}
      {open && <BlockDialog key={editing?._id ?? "new"} type={type} block={editing} onClose={() => setOpen(false)} />}
    </div>
  );
}

export default function ContentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Content</h1>
        <p className="text-muted-foreground">Manage the lists shown across the website.</p>
      </div>
      <Tabs defaultValue="service">
        <TabsList className="h-auto flex-wrap justify-start">{TABS.map((t) => <TabsTrigger key={t.type} value={t.type}>{t.label}</TabsTrigger>)}</TabsList>
        {TABS.map((t) => (
          <TabsContent key={t.type} value={t.type} className="pt-4"><BlockList type={t.type} /></TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
