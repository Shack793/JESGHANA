import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const blockType = v.union(
  v.literal("service"),
  v.literal("value"),
  v.literal("partner"),
  v.literal("scope"), // title = discipline, description = one bullet per line
  v.literal("feature"),
  v.literal("process"),
  v.literal("faq"),
  v.literal("testimonial"), // meta = location
);

export const pageKey = v.union(
  v.literal("home"),
  v.literal("about"),
  v.literal("services"),
  v.literal("blog"),
  v.literal("contact"),
);

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    role: v.optional(v.union(v.literal("admin"), v.literal("editor"))),
  }).index("by_token", ["tokenIdentifier"]),

  banners: defineTable({
    // Missing page means the home page (banners created before page support)
    page: v.optional(pageKey),
    title: v.string(),
    subtitle: v.string(),
    ctaLabel: v.optional(v.string()),
    ctaLink: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
    order: v.number(),
    active: v.boolean(),
  }).index("by_order", ["order"]),

  contentBlocks: defineTable({
    type: blockType,
    title: v.string(),
    description: v.string(),
    meta: v.optional(v.string()),
    order: v.number(),
    active: v.boolean(),
  }).index("by_type_and_order", ["type", "order"]),

  posts: defineTable({
    title: v.string(),
    excerpt: v.string(),
    body: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
    published: v.boolean(),
    publishedAt: v.string(),
  }).index("by_published_and_publishedAt", ["published", "publishedAt"]),

  inquiries: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    message: v.string(),
    status: v.union(v.literal("new"), v.literal("read"), v.literal("archived")),
  }).index("by_status", ["status"]),

  settings: defineTable({
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
  }),
});
