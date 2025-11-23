import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import type { Doc, Id } from "./_generated/dataModel";

// Create a new folder
export const create = mutation({
  args: {
    name: v.string(),
    parentId: v.union(v.id("folders"), v.null()),
    color: v.optional(v.union(v.string(), v.null())),
    icon: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // If creating a subfolder, verify the parent folder belongs to the user
    if (args.parentId) {
      const parentFolder = await ctx.db.get(args.parentId);
      if (!parentFolder) {
        throw new Error("Parent folder not found");
      }
      if (parentFolder.userId !== userId) {
        throw new Error("Not authorized to create folder in this parent");
      }
    }

    const now = Date.now();
    const folderId = await ctx.db.insert("folders", {
      userId,
      name: args.name,
      parentId: args.parentId,
      color: args.color ?? null,
      icon: args.icon ?? null,
      createdAt: now,
      updatedAt: now,
    });

    return folderId;
  },
});

// Update an existing folder
export const update = mutation({
  args: {
    folderId: v.id("folders"),
    name: v.optional(v.string()),
    parentId: v.optional(v.union(v.id("folders"), v.null())),
    color: v.optional(v.union(v.string(), v.null())),
    icon: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Verify the folder belongs to the user
    const folder = await ctx.db.get(args.folderId);
    if (!folder) {
      throw new Error("Folder not found");
    }
    if (folder.userId !== userId) {
      throw new Error("Not authorized to update this folder");
    }

    // If changing parent, verify the new parent belongs to the user
    // and prevent circular references
    if (args.parentId !== undefined) {
      if (args.parentId === args.folderId) {
        throw new Error("Folder cannot be its own parent");
      }

      if (args.parentId) {
        const parentFolder = await ctx.db.get(args.parentId);
        if (!parentFolder) {
          throw new Error("Parent folder not found");
        }
        if (parentFolder.userId !== userId) {
          throw new Error("Not authorized to move folder to this parent");
        }

        // Check for circular reference (prevent moving folder into its own descendant)
        let currentParentId: Id<"folders"> | null = args.parentId;
        while (currentParentId) {
          if (currentParentId === args.folderId) {
            throw new Error("Cannot move folder into its own descendant");
          }
          const currentParent = await ctx.db.get(currentParentId) as Doc<"folders"> | null;
          if (!currentParent) {
            break;
          }
          currentParentId = currentParent.parentId;
        }
      }
    }

    const updates: any = {
      updatedAt: Date.now(),
    };

    if (args.name !== undefined) {
      updates.name = args.name;
    }
    if (args.parentId !== undefined) {
      updates.parentId = args.parentId;
    }
    if (args.color !== undefined) {
      updates.color = args.color;
    }
    if (args.icon !== undefined) {
      updates.icon = args.icon;
    }

    await ctx.db.patch(args.folderId, updates);
    return await ctx.db.get(args.folderId);
  },
});

// Delete a folder
export const deleteFolder = mutation({
  args: {
    folderId: v.id("folders"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Verify the folder belongs to the user
    const folder = await ctx.db.get(args.folderId);
    if (!folder) {
      throw new Error("Folder not found");
    }
    if (folder.userId !== userId) {
      throw new Error("Not authorized to delete this folder");
    }

    // Check if folder has subfolders
    const subfolders = await ctx.db
      .query("folders")
      .withIndex("by_parent", (q) => q.eq("parentId", args.folderId))
      .collect();

    if (subfolders.length > 0) {
      throw new Error("Cannot delete folder with subfolders. Delete or move subfolders first.");
    }

    // Check if folder has notes
    const notes = await ctx.db
      .query("notes")
      .withIndex("by_folder", (q) => q.eq("folderId", args.folderId))
      .filter((q) => q.eq(q.field("isDeleted"), false))
      .collect();

    if (notes.length > 0) {
      throw new Error("Cannot delete folder with notes. Move or delete notes first.");
    }

    await ctx.db.delete(args.folderId);
  },
});

// Move a folder to a different parent
export const moveToParent = mutation({
  args: {
    folderId: v.id("folders"),
    parentId: v.union(v.id("folders"), v.null()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Verify the folder belongs to the user
    const folder = await ctx.db.get(args.folderId);
    if (!folder) {
      throw new Error("Folder not found");
    }
    if (folder.userId !== userId) {
      throw new Error("Not authorized to move this folder");
    }

    // Prevent moving folder to itself
    if (args.parentId === args.folderId) {
      throw new Error("Folder cannot be its own parent");
    }

    // If moving to a parent, verify the parent belongs to the user
    // and prevent circular references
    if (args.parentId) {
      const parentFolder = await ctx.db.get(args.parentId);
      if (!parentFolder) {
        throw new Error("Parent folder not found");
      }
      if (parentFolder.userId !== userId) {
        throw new Error("Not authorized to move folder to this parent");
      }

      // Check for circular reference (prevent moving folder into its own descendant)
      let currentParentId: Id<"folders"> | null = args.parentId;
      while (currentParentId) {
        if (currentParentId === args.folderId) {
          throw new Error("Cannot move folder into its own descendant");
        }
        const currentParent = await ctx.db.get(currentParentId) as Doc<"folders"> | null;
        if (!currentParent) {
          break;
        }
        currentParentId = currentParent.parentId;
      }
    }

    await ctx.db.patch(args.folderId, {
      parentId: args.parentId,
      updatedAt: Date.now(),
    });
  },
});

