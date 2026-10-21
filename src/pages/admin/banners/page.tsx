import { useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, ImagePlus, Pencil, Plus, Trash2 } from "lucide-react";
import { api } from "@/convex/_generated/api.js";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty.tsx";

type PageKey = "home" | "about" | "services" | "blog" | "contact";
const PAGES: PageKey[] = ["home", "about", "services", "blog", "contact"];

type BannerRow = {
  _id: Id<"banners">;
  page?: PageKey;
  title: string;
  subtitle: string;
  ctaLabel?: string;
  ctaLink?: string;
  imageStorageId?: Id<"_storage">;
  imageUrl?: string;
  image: string | null;
  active: boolean;
};

function BannerDialog({ banner, open, onClose }: { banner: BannerRow | null; open: boolean; onClose: () => void }) {
  const create = useMutation(api.admin.createBanner);
  const update = useMutation(api.admin.updateBanner);
  const genUrl = useMutation(api.admin.generateUploadUrl);
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [active, setActive] = useState(banner?.active ?? true);
  const [page, setPage] = useState<PageKey>(banner?.page ?? "home");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setBusy(true);
    try {
      let imageStorageId = banner?.imageStorageId;
      const file = fileRef.current?.files?.[0];
      if (file) {
        const url = await genUrl({});
        const res = await fetch(url, { method: "POST", headers: { "Content-Type": file.type }, body: file });
        const json: { storageId: Id<"_storage"> } = await res.json();
        imageStorageId = json.storageId;
      }
      const fields = {
        page,
        title: String(data.get("title")),
        subtitle: String(data.get("subtitle")),
        ctaLabel: String(data.get("ctaLabel") || "") || undefined,
        ctaLink: String(data.get("ctaLink") || "") || undefined,
        imageStorageId,
        imageUrl: imageStorageId ? undefined : banner?.imageUrl,
        active,
      };
      if (banner) await update({ id: banner._id, ...fields });
      else await create(fields);
      toast.success("Banner saved");
      onClose();
    } catch {
      toast.error("Could not save banner");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>{banner ? "Edit banner" : "New banner"}</DialogTitle></DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3">
          <Select value={page} onValueChange={(p) => setPage(p as PageKey)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {PAGES.map((p) => <SelectItem key={p} value={p} className="capitalize">{p} page</SelectItem>)}
            </SelectContent>
          </Select>
          <Input name="title" placeholder="Headline" defaultValue={banner?.title} required />
          <Input name="subtitle" placeholder="Supporting text" defaultValue={banner?.subtitle} required />
          <div className="grid grid-cols-2 gap-3">
            <Input name="ctaLabel" placeholder="Button text" defaultValue={banner?.ctaLabel} />
            <Input name="ctaLink" placeholder="/contact" defaultValue={banner?.ctaLink} />
          </div>
          <Input ref={fileRef} type="file" accept="image/*" />
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={active} onCheckedChange={setActive} /> Show on website
          </label>
          <DialogFooter>
            <Button type="submit" disabled={busy}>{busy && <Spinner />} Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function BannersPage() {
  const banners = useQuery(api.admin.listBanners, {});
  const move = useMutation(api.admin.moveBanner);
  const remove = useMutation(api.admin.deleteBanner);
  const [editing, setEditing] = useState<BannerRow | null>(null);
  const [open, setOpen] = useState(false);

  const openDialog = (b: BannerRow | null) => { setEditing(b); setOpen(true); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Banners</h1>
          <p className="text-muted-foreground">Slides for each page, shown in this order. Pages with several live banners become sliders.</p>
        </div>
        <Button onClick={() => openDialog(null)}><Plus /> New banner</Button>
      </div>
      {banners === undefined ? (
        <Skeleton className="h-32" />
      ) : banners.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon"><ImagePlus /></EmptyMedia>
            <EmptyTitle>No banners yet</EmptyTitle>
            <EmptyDescription>Add your first homepage banner.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="space-y-3">
          {banners.map((b, i) => (
            <div key={b._id} className="flex flex-col gap-3 rounded-xl border bg-card p-3 sm:flex-row sm:items-center">
              <div
                className="h-24 w-full shrink-0 rounded-md bg-muted bg-cover bg-center sm:w-44"
                style={b.image ? { backgroundImage: `url(${b.image})` } : undefined}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-semibold">{b.title}</p>
                  <Badge variant={b.active ? "default" : "secondary"}>{b.active ? "Live" : "Hidden"}</Badge>
                  <Badge variant="secondary" className="capitalize">{b.page ?? "home"}</Badge>
                </div>
                <p className="truncate text-sm text-muted-foreground">{b.subtitle}</p>
              </div>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" disabled={i === 0} onClick={() => move({ id: b._id, direction: "up" })}><ArrowUp /></Button>
                <Button size="icon" variant="ghost" disabled={i === banners.length - 1} onClick={() => move({ id: b._id, direction: "down" })}><ArrowDown /></Button>
                <Button size="icon" variant="ghost" onClick={() => openDialog(b)}><Pencil /></Button>
                <Button size="icon" variant="ghost" onClick={() => remove({ id: b._id }).then(() => toast.success("Banner deleted"))}><Trash2 className="text-destructive" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
      {open && <BannerDialog key={editing?._id ?? "new"} banner={editing} open={open} onClose={() => setOpen(false)} />}
    </div>
  );
}
