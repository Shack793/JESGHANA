import { useQuery } from "convex/react";
import { Newspaper } from "lucide-react";
import { api } from "@/convex/_generated/api.js";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty.tsx";
import Reveal from "@/components/reveal.tsx";
import BannerCarousel from "../_components/banner-carousel.tsx";
import PostCard from "./_components/post-card.tsx";

export default function BlogPage() {
  const home = useQuery(api.site.getHome, {});
  const posts = useQuery(api.site.listPosts, {});
  return (
    <>
      <BannerCarousel compact banners={home?.banners.filter((b) => b.page === "blog") ?? []} />
      <div className="mx-auto max-w-6xl px-4 py-16">
        {posts === undefined ? (
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-72" />)}
          </div>
        ) : posts.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon"><Newspaper /></EmptyMedia>
              <EmptyTitle>No articles yet</EmptyTitle>
              <EmptyDescription>Check back soon for news and insights.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => <Reveal key={p._id} delay={(i % 3) * 0.08}><PostCard post={p} /></Reveal>)}
          </div>
        )}
      </div>
    </>
  );
}
