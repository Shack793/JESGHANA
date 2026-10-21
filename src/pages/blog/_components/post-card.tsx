import { Link } from "react-router-dom";
import { format } from "date-fns";
import type { Id } from "@/convex/_generated/dataModel.d.ts";

export type PostSummary = {
  _id: Id<"posts">;
  title: string;
  excerpt: string;
  publishedAt: string;
  image: string | null;
};

export default function PostCard({ post }: { post: PostSummary }) {
  return (
    <Link
      to={`/blog/${post._id}`}
      className="group block h-full overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="aspect-[16/9] overflow-hidden bg-muted">
        {post.image && (
          <img src={post.image} alt="" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
        )}
      </div>
      <div className="space-y-2 p-5">
        <p className="text-xs text-muted-foreground">{format(new Date(post.publishedAt), "d MMM yyyy")}</p>
        <h3 className="font-semibold group-hover:text-accent">{post.title}</h3>
        <p className="line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
      </div>
    </Link>
  );
}
