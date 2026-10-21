import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { QueryCtx } from "./_generated/server";
import type { Doc } from "./_generated/dataModel.d.ts";

type BlockKind = Doc<"contentBlocks">["type"];

async function activeBlocks(ctx: QueryCtx, type: BlockKind) {
  const rows = await ctx.db
    .query("contentBlocks")
    .withIndex("by_type_and_order", (q) => q.eq("type", type))
    .take(50);
  return rows.filter((b) => b.active);
}

async function imageOf(
  ctx: QueryCtx,
  doc: { imageStorageId?: Doc<"banners">["imageStorageId"]; imageUrl?: string },
) {
  return doc.imageStorageId ? await ctx.storage.getUrl(doc.imageStorageId) : (doc.imageUrl ?? null);
}

// Public: everything the marketing pages need in one subscription.
export const getHome = query({
  args: {},
  handler: async (ctx) => {
    const banners = await ctx.db.query("banners").withIndex("by_order").take(60);
    const activeBanners = await Promise.all(
      banners
        .filter((b) => b.active)
        .map(async (b) => ({
          _id: b._id,
          page: b.page ?? "home",
          title: b.title,
          subtitle: b.subtitle,
          ctaLabel: b.ctaLabel,
          ctaLink: b.ctaLink,
          image: await imageOf(ctx, b),
        })),
    );
    const latest = await ctx.db
      .query("posts")
      .withIndex("by_published_and_publishedAt", (q) => q.eq("published", true))
      .order("desc")
      .take(3);
    return {
      banners: activeBanners,
      services: await activeBlocks(ctx, "service"),
      values: await activeBlocks(ctx, "value"),
      partners: await activeBlocks(ctx, "partner"),
      scopes: await activeBlocks(ctx, "scope"),
      features: await activeBlocks(ctx, "feature"),
      process: await activeBlocks(ctx, "process"),
      faqs: await activeBlocks(ctx, "faq"),
      testimonials: await activeBlocks(ctx, "testimonial"),
      latestPosts: await Promise.all(
        latest.map(async (p) => ({
          _id: p._id,
          title: p.title,
          excerpt: p.excerpt,
          publishedAt: p.publishedAt,
          image: await imageOf(ctx, p),
        })),
      ),
      settings: await ctx.db.query("settings").first(),
    };
  },
});

export const listPosts = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_published_and_publishedAt", (q) => q.eq("published", true))
      .order("desc")
      .take(30);
    return await Promise.all(
      posts.map(async (p) => ({
        _id: p._id,
        title: p.title,
        excerpt: p.excerpt,
        publishedAt: p.publishedAt,
        image: await imageOf(ctx, p),
      })),
    );
  },
});

export const getPost = query({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    const p = await ctx.db.get("posts", args.id);
    if (!p || !p.published) return null;
    return {
      _id: p._id,
      title: p.title,
      excerpt: p.excerpt,
      body: p.body,
      publishedAt: p.publishedAt,
      image: await imageOf(ctx, p),
    };
  },
});

export const submitInquiry = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("inquiries", {
      name: args.name.slice(0, 120),
      email: args.email.slice(0, 200),
      phone: args.phone?.slice(0, 40),
      message: args.message.slice(0, 3000),
      status: "new",
    });
    return null;
  },
});
