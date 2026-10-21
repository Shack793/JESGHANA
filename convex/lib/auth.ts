import { ConvexError } from "convex/values";
import type { Doc } from "../_generated/dataModel.d.ts";
import type { MutationCtx, QueryCtx } from "../_generated/server";

// Admins and editors can manage content; only admins manage users.
export async function requireStaff(
  ctx: QueryCtx | MutationCtx,
  adminOnly = false,
): Promise<Doc<"users">> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError({ code: "UNAUTHENTICATED", message: "Please sign in" });
  }
  const user = await ctx.db
    .query("users")
    .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
    .unique();
  if (!user || !user.role || (adminOnly && user.role !== "admin")) {
    throw new ConvexError({ code: "FORBIDDEN", message: "You do not have access" });
  }
  return user;
}
