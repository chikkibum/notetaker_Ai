import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";
 
const schema = defineSchema({
  ...authTables,
  
  // Notes table - stores notes with TipTap rich text content
  notes: defineTable({
    userId: v.id("users"), // Reference to the user who owns the note
    title: v.string(), // Note title
    content: v.any(), // TipTap/ProseMirror JSON content
    folderId: v.union(v.id("folders"), v.null()), // Optional folder organization
    tags: v.array(v.string()), // Array of tags for categorization
    isArchived: v.boolean(), // Whether the note is archived
    isDeleted: v.boolean(), // Soft delete flag
    createdAt: v.number(), // Timestamp when note was created
    updatedAt: v.number(), // Timestamp when note was last updated
  })
    .index("by_user", ["userId"])
    .index("by_user_created", ["userId", "createdAt"])
    .index("by_user_updated", ["userId", "updatedAt"])
    .index("by_folder", ["folderId"])
    .index("by_user_archived", ["userId", "isArchived"])
    .index("by_user_deleted", ["userId", "isDeleted"]),
  
  // Folders table - for organizing notes into folders
  folders: defineTable({
    userId: v.id("users"), // Reference to the user who owns the folder
    name: v.string(), // Folder name
    parentId: v.union(v.id("folders"), v.null()), // Optional parent folder for nesting
    color: v.union(v.string(), v.null()), // Optional color for folder (e.g., "#FF5733")
    icon: v.union(v.string(), v.null()), // Optional icon identifier
    createdAt: v.number(), // Timestamp when folder was created
    updatedAt: v.number(), // Timestamp when folder was last updated
  })
    .index("by_user", ["userId"])
    .index("by_parent", ["parentId"])
    .index("by_user_parent", ["userId", "parentId"]),
});
 
export default schema;