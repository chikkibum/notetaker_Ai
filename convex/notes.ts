import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Doc, getAuthUserId } from "@convex-dev/auth/server";

// Create a new note
export const create = mutation({
  args: {
    title: v.string(),
    content: v.any(), // TipTap/ProseMirror JSON content or simple text for quicknotes
    noteType: v.optional(v.union(v.literal("quicknote"), v.literal("richnote"))),
    folderId: v.union(v.id("folders"), v.null()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const now = Date.now();
    const noteId = await ctx.db.insert("notes", {
      userId,
      title: args.title,
      content: args.content,
      noteType: args.noteType || "richnote", // Default to richnote for backward compatibility
      folderId: args.folderId,
      tags: args.tags || [],
      isArchived: false,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    });

    return noteId;
  },
});

// Update an existing note
export const update = mutation({
  args: {
    noteId: v.id("notes"),
    title: v.optional(v.string()),
    content: v.optional(v.any()), // TipTap/ProseMirror JSON content or simple text for quicknotes
    noteType: v.optional(v.union(v.literal("quicknote"), v.literal("richnote"))),
    folderId: v.optional(v.union(v.id("folders"), v.null())),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Verify the note belongs to the user
    const note = await ctx.db.get(args.noteId);
    if (!note) {
      throw new Error("Note not found");
    }
    if (note.userId !== userId) {
      throw new Error("Not authorized to update this note");
    }

    const updates: any = {
      updatedAt: Date.now(),
    };

    if (args.title !== undefined) {
      updates.title = args.title;
    }
    if (args.content !== undefined) {
      updates.content = args.content;
    }
    if (args.noteType !== undefined) {
      updates.noteType = args.noteType;
    }
    if (args.folderId !== undefined) {
      updates.folderId = args.folderId;
    }
    if (args.tags !== undefined) {
      updates.tags = args.tags;
    }

    await ctx.db.patch(args.noteId, updates);
    return await ctx.db.get(args.noteId);
  },
});

// Soft delete a note (sets isDeleted to true)
export const softDelete = mutation({
  args: {
    noteId: v.id("notes"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Verify the note belongs to the user
    const note = await ctx.db.get(args.noteId);
    if (!note) {
      throw new Error("Note not found");
    }
    if (note.userId !== userId) {
      throw new Error("Not authorized to delete this note");
    }

    await ctx.db.patch(args.noteId, {
      isDeleted: true,
      updatedAt: Date.now(),
    });
  },
});

// Permanently delete a note
export const deletePermanently = mutation({
  args: {
    noteId: v.id("notes"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Verify the note belongs to the user
    const note = await ctx.db.get(args.noteId);
    if (!note) {
      throw new Error("Note not found");
    }
    if (note.userId !== userId) {
      throw new Error("Not authorized to delete this note");
    }

    await ctx.db.delete(args.noteId);
  },
});

// Archive a noteauth.getAuthUserId
export const archive = mutation({
  args: {
    noteId: v.id("notes"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Verify the note belongs to the user
    const note = await ctx.db.get(args.noteId);
    if (!note) {
      throw new Error("Note not found");
    }
    if (note.userId !== userId) {
      throw new Error("Not authorized to archive this note");
    }

    await ctx.db.patch(args.noteId, {
      isArchived: true,
      updatedAt: Date.now(),
    });
  },
});

// Unarchive a note
export const unarchive = mutation({
  args: {
    noteId: v.id("notes"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Verify the note belongs to the user
    const note = await ctx.db.get(args.noteId);
    if (!note) {
      throw new Error("Note not found");
    }
    if (note.userId !== userId) {
      throw new Error("Not authorized to unarchive this note");
    }

    await ctx.db.patch(args.noteId, {
      isArchived: false,
      updatedAt: Date.now(),
    });
  },
});

// Restore a soft-deleted note
export const restore = mutation({
  args: {
    noteId: v.id("notes"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Verify the note belongs to the user
    const note = await ctx.db.get(args.noteId);
    if (!note) {
      throw new Error("Note not found");
    }
    if (note.userId !== userId) {
      throw new Error("Not authorized to restore this note");
    }

    await ctx.db.patch(args.noteId, {
      isDeleted: false,
      updatedAt: Date.now(),
    });
  },
});

// Move a note to a different folder
export const moveToFolder = mutation({
  args: {
    noteId: v.id("notes"),
    folderId: v.union(v.id("folders"), v.null()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Verify the note belongs to the user
    const note = await ctx.db.get(args.noteId);
    if (!note) {
      throw new Error("Note not found");
    }
    if (note.userId !== userId) {
      throw new Error("Not authorized to move this note");
    }

    // If moving to a folder, verify the folder belongs to the user
    if (args.folderId) {
      const folder = await ctx.db.get(args.folderId);
      if (!folder) {
        throw new Error("Folder not found");
      }
      if (folder.userId !== userId) {
        throw new Error("Not authorized to move note to this folder");
      }
    }

    await ctx.db.patch(args.noteId, {
      folderId: args.folderId,
      updatedAt: Date.now(),
    });
  },
});

// queries

export const getNotes = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const notes = await ctx.db
      .query("notes")
      .withIndex("by_user_updated", (q) => q.eq("userId", userId))
      .order("desc") // Orders by updatedAt in descending order
      .filter((q) =>
        q.and(
          q.eq(q.field("isDeleted"), false),
          q.eq(q.field("isArchived"), false)
        )
      )
      .take(10);
    return notes;
  },
});

export const getNoteByID =  query({
  args:{
    noteId: v.id("notes"),
  },
  handler: async(ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Verify the note belongs to the user
    const note = await ctx.db.get(args.noteId);
    if (!note) {
      throw new Error("Note not found");
    }

    return note;
  },
});

// Get only rich notes (for /simple route)
export const getRichNotes = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const notes = await ctx.db
      .query("notes")
      .withIndex("by_user_noteType", (q) => 
        q.eq("userId", userId).eq("noteType", "richnote")
      )
      .order("desc")
      .filter((q) =>
        q.and(
          q.eq(q.field("isDeleted"), false),
          q.eq(q.field("isArchived"), false)
        )
      )
      .collect();
    
    // Also include notes without noteType (backward compatibility - treat as richnote)
    const notesWithoutType = await ctx.db
      .query("notes")
      .withIndex("by_user_updated", (q) => q.eq("userId", userId))
      .order("desc")
      .filter((q) =>
        q.and(
          q.eq(q.field("isDeleted"), false),
          q.eq(q.field("isArchived"), false),
          q.eq(q.field("noteType"), undefined)
        )
      )
      .collect();
    
    // Combine and sort by updatedAt
    const allNotes = [...notes, ...notesWithoutType];
    return allNotes.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

// Get only quick notes
export const getQuickNotes = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const notes = await ctx.db
      .query("notes")
      .withIndex("by_user_noteType", (q) => 
        q.eq("userId", userId).eq("noteType", "quicknote")
      )
      .order("desc")
      .filter((q) =>
        q.and(
          q.eq(q.field("isDeleted"), false),
          q.eq(q.field("isArchived"), false)
        )
      )
      .collect();
    
    return notes;
  },
});
