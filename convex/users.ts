import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getUserDetails = query({
    handler: async(ctx) => {
        const userId = await getAuthUserId(ctx);

        if (!userId) {
            throw new Error("Not authenticated");
          }

          const user = await ctx.db.get(userId);
          if (!user) {
            throw new Error("user not found");
          }

          return user;
    },
})