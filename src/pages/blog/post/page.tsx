import { useQuery } from "convex/react";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { api } from "@/convex/_generated/api.js";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Button } from "@/components/ui/button.tsx";

export default function BlogPostPage() {
  const { id } = useParams();
  const post = useQuery(api.site.getPost, id ? { id: id as Id<"posts"> } : "skip");

  if (post === undefined) return <Skeleton className="mx-auto my-16 h-96 max-w-3xl" />;
  if (post === null) {
    return (
      <div className="mx-auto max-w-xl space-y-4 px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Article not found</h1>
        <Button asChild><Link to="/blog">Back to blog</Link></Button>
      </div>
    );
  }
  return (
    <article className="mx-auto max-w-3xl space-y-6 px-4 py-16">
      <Button asChild variant="ghost" size="sm"><Link to="/blog"><ArrowLeft /> All articles</Link></Button>
      <p className="text-sm text-muted-foreground">{format(new Date(post.publishedAt), "d MMMM yyyy")}</p>
      <h1 className="text-balance text-4xl font-extrabold">{post.title}</h1>
      {post.image && <img src={post.image} alt="" className="w-full rounded-xl object-cover" />}
      <div className="whitespace-pre-wrap leading-relaxed text-muted-foreground">{post.body}</div>
    </article>
  );
}
