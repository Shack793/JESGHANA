import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireStaff } from "./lib/auth";
import { blockType, pageKey } from "./schema";

export const me = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    return await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
  },
});

export const stats = query({
  args: {},
  handler: async (ctx) => {
    await requireStaff(ctx);
    const banners = await ctx.db.query("banners").take(200);
    const blocks = await ctx.db.query("contentBlocks").take(500);
    const newInquiries = await ctx.db
      .query("inquiries")
      .withIndex("by_status", (q) => q.eq("status", "new"))
      .take(100);
    return {
      banners: banners.length,
      services: blocks.filter((b) => b.type === "service").length,
      values: blocks.filter((b) => b.type === "value").length,
      partners: blocks.filter((b) => b.type === "partner").length,
      newInquiries: newInquiries.length,
    };
  },
});

// ---------- Banners ----------
export const listBanners = query({
  args: {},
  handler: async (ctx) => {
    await requireStaff(ctx);
    const banners = await ctx.db.query("banners").withIndex("by_order").take(100);
    return await Promise.all(
      banners.map(async (b) => ({
        ...b,
        image: b.imageStorageId
          ? await ctx.storage.getUrl(b.imageStorageId)
          : (b.imageUrl ?? null),
      })),
    );
  },
});

const bannerFields = {
  page: pageKey,
  title: v.string(),
  subtitle: v.string(),
  ctaLabel: v.optional(v.string()),
  ctaLink: v.optional(v.string()),
  imageStorageId: v.optional(v.id("_storage")),
  imageUrl: v.optional(v.string()),
  active: v.boolean(),
};

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireStaff(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const createBanner = mutation({
  args: bannerFields,
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    const last = await ctx.db.query("banners").withIndex("by_order").order("desc").first();
    return await ctx.db.insert("banners", { ...args, order: (last?.order ?? 0) + 1 });
  },
});

export const updateBanner = mutation({
  args: { id: v.id("banners"), ...bannerFields },
  handler: async (ctx, { id, ...fields }) => {
    await requireStaff(ctx);
    await ctx.db.patch("banners", id, fields);
    return null;
  },
});

export const moveBanner = mutation({
  args: { id: v.id("banners"), direction: v.union(v.literal("up"), v.literal("down")) },
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    const all = await ctx.db.query("banners").withIndex("by_order").take(100);
    const i = all.findIndex((b) => b._id === args.id);
    const j = args.direction === "up" ? i - 1 : i + 1;
    if (i < 0 || j < 0 || j >= all.length) return null;
    await ctx.db.patch("banners", all[i]._id, { order: all[j].order });
    await ctx.db.patch("banners", all[j]._id, { order: all[i].order });
    return null;
  },
});

export const deleteBanner = mutation({
  args: { id: v.id("banners") },
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    const banner = await ctx.db.get("banners", args.id);
    if (banner?.imageStorageId) await ctx.storage.delete(banner.imageStorageId);
    await ctx.db.delete("banners", args.id);
    return null;
  },
});

// ---------- Content blocks (services / values / partners) ----------
export const listBlocks = query({
  args: { type: blockType },
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    return await ctx.db
      .query("contentBlocks")
      .withIndex("by_type_and_order", (q) => q.eq("type", args.type))
      .take(100);
  },
});

export const createBlock = mutation({
  args: {
    type: blockType,
    title: v.string(),
    description: v.string(),
    meta: v.optional(v.string()),
    active: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    const last = await ctx.db
      .query("contentBlocks")
      .withIndex("by_type_and_order", (q) => q.eq("type", args.type))
      .order("desc")
      .first();
    return await ctx.db.insert("contentBlocks", { ...args, order: (last?.order ?? 0) + 1 });
  },
});

export const updateBlock = mutation({
  args: {
    id: v.id("contentBlocks"),
    title: v.string(),
    description: v.string(),
    meta: v.optional(v.string()),
    active: v.boolean(),
  },
  handler: async (ctx, { id, ...fields }) => {
    await requireStaff(ctx);
    await ctx.db.patch("contentBlocks", id, fields);
    return null;
  },
});

export const deleteBlock = mutation({
  args: { id: v.id("contentBlocks") },
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    await ctx.db.delete("contentBlocks", args.id);
    return null;
  },
});

// ---------- Inquiries ----------
export const listInquiries = query({
  args: {},
  handler: async (ctx) => {
    await requireStaff(ctx);
    return await ctx.db.query("inquiries").order("desc").take(200);
  },
});

export const setInquiryStatus = mutation({
  args: {
    id: v.id("inquiries"),
    status: v.union(v.literal("new"), v.literal("read"), v.literal("archived")),
  },
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    await ctx.db.patch("inquiries", args.id, { status: args.status });
    return null;
  },
});

export const deleteInquiry = mutation({
  args: { id: v.id("inquiries") },
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    await ctx.db.delete("inquiries", args.id);
    return null;
  },
});

// ---------- Settings ----------
export const getSettings = query({
  args: {},
  handler: async (ctx) => {
    await requireStaff(ctx);
    return await ctx.db.query("settings").first();
  },
});

export const saveSettings = mutation({
  args: {
    companyName: v.string(),
    tagline: v.string(),
    intro: v.string(),
    about: v.string(),
    mission: v.string(),
    vision: v.string(),
    address: v.string(),
    hours: v.string(),
    phones: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    const existing = await ctx.db.query("settings").first();
    if (existing) await ctx.db.patch("settings", existing._id, args);
    else await ctx.db.insert("settings", args);
    return null;
  },
});

// ---------- Users ----------
export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    await requireStaff(ctx, true);
    return await ctx.db.query("users").take(200);
  },
});

export const setUserRole = mutation({
  args: {
    id: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("editor"), v.literal("none")),
  },
  handler: async (ctx, args) => {
    const me = await requireStaff(ctx, true);
    if (me._id === args.id) return null; // prevent locking yourself out
    await ctx.db.patch("users", args.id, {
      role: args.role === "none" ? undefined : args.role,
    });
    return null;
  },
});

// ---------- Blog posts ----------
const postFields = {
  title: v.string(),
  excerpt: v.string(),
  body: v.string(),
  imageStorageId: v.optional(v.id("_storage")),
  imageUrl: v.optional(v.string()),
  published: v.boolean(),
};

export const listAllPosts = query({
  args: {},
  handler: async (ctx) => {
    await requireStaff(ctx);
    const posts = await ctx.db.query("posts").order("desc").take(100);
    return await Promise.all(
      posts.map(async (p) => ({
        ...p,
        image: p.imageStorageId ? await ctx.storage.getUrl(p.imageStorageId) : (p.imageUrl ?? null),
      })),
    );
  },
});

export const createPost = mutation({
  args: postFields,
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    return await ctx.db.insert("posts", { ...args, publishedAt: new Date().toISOString() });
  },
});

export const updatePost = mutation({
  args: { id: v.id("posts"), ...postFields },
  handler: async (ctx, { id, ...fields }) => {
    await requireStaff(ctx);
    await ctx.db.patch("posts", id, fields);
    return null;
  },
});

export const deletePost = mutation({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    const post = await ctx.db.get("posts", args.id);
    if (post?.imageStorageId) await ctx.storage.delete(post.imageStorageId);
    await ctx.db.delete("posts", args.id);
    return null;
  },
});
