import { useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { Newspaper, Pencil, Plus, Trash2 } from "lucide-react";
import { api } from "@/convex/_generated/api.js";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty.tsx";

type PostRow = {
  _id: Id<"posts">;
  title: string;
  excerpt: string;
  body: string;
  imageStorageId?: Id<"_storage">;
  imageUrl?: string;
  image: string | null;
  published: boolean;
};

function PostDialog({ post, onClose }: { post: PostRow | null; onClose: () => void }) {
  const create = useMutation(api.admin.createPost);
  const update = useMutation(api.admin.updatePost);
  const genUrl = useMutation(api.admin.generateUploadUrl);
  const fileRef = useRef<HTMLInputElement>(null);
  const [published, setPublished] = useState(post?.published ?? true);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    setBusy(true);
    try {
      let imageStorageId = post?.imageStorageId;
      const file = fileRef.current?.files?.[0];
      if (file) {
        const url = await genUrl({});
        const res = await fetch(url, { method: "POST", headers: { "Content-Type": file.type }, body: file });
        const json: { storageId: Id<"_storage"> } = await res.json();
        imageStorageId = json.storageId;
      }
      const fields = {
        title: String(d.get("title")),
        excerpt: String(d.get("excerpt")),
        body: String(d.get("body")),
        imageStorageId,
        imageUrl: imageStorageId ? undefined : post?.imageUrl,
        published,
      };
      if (post) await update({ id: post._id, ...fields });
      else await create(fields);
      toast.success("Article saved");
      onClose();
    } catch {
      toast.error("Could not save article");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{post ? "Edit article" : "New article"}</DialogTitle></DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3">
          <Input name="title" placeholder="Title" defaultValue={post?.title} required />
          <Textarea name="excerpt" placeholder="Short summary" defaultValue={post?.excerpt} rows={2} required />
          <Textarea name="body" placeholder="Article text" defaultValue={post?.body} rows={8} required />
          <Input ref={fileRef} type="file" accept="image/*" />
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={published} onCheckedChange={setPublished} /> Published
          </label>
          <DialogFooter><Button type="submit" disabled={busy}>{busy && <Spinner />} Save</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function PostsAdminPage() {
  const posts = useQuery(api.admin.listAllPosts, {});
  const remove = useMutation(api.admin.deletePost);
  const [editing, setEditing] = useState<PostRow | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blog posts</h1>
          <p className="text-muted-foreground">News and insights shown on the blog.</p>
        </div>
        <Button onClick={() => { setEditing(null); setOpen(true); }}><Plus /> New article</Button>
      </div>
      {posts === undefined ? (
        <Skeleton className="h-32" />
      ) : posts.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon"><Newspaper /></EmptyMedia>
            <EmptyTitle>No articles yet</EmptyTitle>
            <EmptyDescription>Write your first article.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        posts.map((p) => (
          <div key={p._id} className="flex items-center gap-3 rounded-xl border bg-card p-3">
            <div
              className="size-16 shrink-0 rounded-md bg-muted bg-cover bg-center"
              style={p.image ? { backgroundImage: `url(${p.image})` } : undefined}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate font-semibold">{p.title}</p>
                <Badge variant={p.published ? "default" : "secondary"}>{p.published ? "Live" : "Draft"}</Badge>
              </div>
              <p className="truncate text-sm text-muted-foreground">{p.excerpt}</p>
            </div>
            <Button size="icon" variant="ghost" onClick={() => { setEditing(p); setOpen(true); }}><Pencil /></Button>
            <Button size="icon" variant="ghost" onClick={() => remove({ id: p._id }).then(() => toast.success("Deleted"))}><Trash2 className="text-destructive" /></Button>
          </div>
        ))
      )}
      {open && <PostDialog key={editing?._id ?? "new"} post={editing} onClose={() => setOpen(false)} />}
    </div>
  );
}
