"use client";

import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, Edit, Plus, FileText } from "lucide-react";
import { useState } from "react";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ViewMode = "list" | "create" | "edit";

export function SimpleDocuments() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [editingNoteId, setEditingNoteId] = useState<Id<"notes"> | null>(null);
  const [title, setTitle] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Id<"notes"> | null>(null);
  const richNotes = useQuery(api.notes.getRichNotes);
  const createNote = useAction(api.notesAction.createNote);
  const updateNote = useMutation(api.notes.update);
  const deleteNote = useMutation(api.notes.softDelete);

  const isLoading = richNotes === undefined;

  const handleCreate = () => {
    setTitle("Untitled Document");
    setEditingNoteId(null);
    setViewMode("create");
  };

  const handleEdit = (noteId: Id<"notes">, noteTitle: string) => {
    setEditingNoteId(noteId);
    setTitle(noteTitle);
    setViewMode("edit");
  };

  const handleSave = async (data: { html: string; json: unknown; text: string }) => {
    try {
      if (viewMode === "create") {
        await createNote({
          title: title || "Untitled Document",
          body: data.text,
        });
      } else if (viewMode === "edit" && editingNoteId) {
        await updateNote({
          noteId: editingNoteId,
          title: title || "Untitled Document",
          content: data.json,
        });
      }
      setViewMode("list");
      setEditingNoteId(null);
      setTitle("");
    } catch (error) {
      console.error("Failed to save document:", error);
    }
  };

  const handleDeleteClick = (noteId: Id<"notes">) => {
    setNoteToDelete(noteId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!noteToDelete) return;
    
    try {
      await deleteNote({ noteId: noteToDelete });
      setDeleteDialogOpen(false);
      setNoteToDelete(null);
    } catch (error) {
      console.error("Failed to delete document:", error);
      setDeleteDialogOpen(false);
      setNoteToDelete(null);
    }
  };

  const handleCancel = () => {
    setViewMode("list");
    setEditingNoteId(null);
    setTitle("");
  };

  // Show editor view
  if (viewMode === "create" || viewMode === "edit") {
    const note = viewMode === "edit" && editingNoteId
      ? richNotes?.find((n) => n._id === editingNoteId)
      : null;

    return (
      <MaxWidthWrapper maxWidth="7xl" className="mt-10 lg:mt-20">
        <div className="mb-4">
          <Button variant="outline" onClick={handleCancel}>
            ← Back to Documents
          </Button>
        </div>
        <SimpleEditor
          initialContent={note?.content}
          onSave={handleSave}
          title={title}
          onTitleChange={setTitle}
        />
      </MaxWidthWrapper>
    );
  }

  // Show list view
  return (
    <MaxWidthWrapper maxWidth="7xl" className="mt-10 lg:mt-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">TipTap Documents</h1>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Create New
        </Button>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-4">
              <CardHeader>
                <Skeleton className="h-5 w-2/3 mb-2" />
                <Skeleton className="h-3 w-1/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-3 w-1/2" />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && richNotes?.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No documents found</p>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Document
          </Button>
        </div>
      )}

      {!isLoading && richNotes && richNotes.length > 0 && (
        <ScrollArea className="h-[70vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {richNotes.map((note) => (
              <Card key={note._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="line-clamp-2">
                    {note.title || "Untitled Document"}
                  </CardTitle>
                  <CardDescription>
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {typeof note.content === "string"
                      ? note.content
                      : "Rich text content"}
                  </p>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(note._id, note.title)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteClick(note._id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the document.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MaxWidthWrapper>
  );
}

