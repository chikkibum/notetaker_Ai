"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useParams, useRouter } from "next/navigation";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { ArrowLeft, Trash2 } from "lucide-react";
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

export default function EditNotePage() {
  const params = useParams();
  const router = useRouter();
  const noteId = params.id as Id<"notes">;
  const note = useQuery(api.notes.getNoteByID, { noteId });
  const updateNote = useMutation(api.notes.update);
  const deleteNote = useMutation(api.notes.softDelete);
  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
    }
  }, [note]);

  const handleSave = async (data: { html: string; json: unknown; text: string }) => {
    if (!noteId) return;
    
    setIsSaving(true);
    try {
      await updateNote({
        noteId,
        title: title || "Untitled Note",
        content: data.json,
      });
      // Optionally navigate back after save
      // router.push("/notes");
    } catch (error) {
      console.error("Failed to save note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!noteId) return;
    
    try {
      await deleteNote({ noteId });
      setDeleteDialogOpen(false);
      router.push("/notes");
    } catch (error) {
      console.error("Failed to delete note:", error);
      setDeleteDialogOpen(false);
    }
  };

  const handleBack = () => {
    router.push("/notes");
  };

  if (note === undefined) {
    return (
      <MaxWidthWrapper maxWidth="7xl" className="mt-10 lg:mt-20">
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-[600px] w-full" />
        </div>
      </MaxWidthWrapper>
    );
  }

  if (note === null) {
    return (
      <MaxWidthWrapper maxWidth="7xl" className="mt-10 lg:mt-20">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Note not found</p>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Notes
          </Button>
        </div>
      </MaxWidthWrapper>
    );
  }

  // Only allow editing rich notes
  const noteType = note.noteType || "richnote";
  if (noteType !== "richnote") {
    return (
      <MaxWidthWrapper maxWidth="7xl" className="mt-10 lg:mt-20">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            This note type cannot be edited in the rich text editor.
          </p>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Notes
          </Button>
        </div>
      </MaxWidthWrapper>
    );
  }

  return (
    <MaxWidthWrapper maxWidth="7xl" className="mt-10 lg:mt-20">
      <div className="mb-4 flex items-center justify-between">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Notes
        </Button>
        <Button
          variant="destructive"
          onClick={handleDeleteClick}
          disabled={isSaving}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
      {isSaving && (
        <div className="mb-4 text-sm text-muted-foreground">
          Saving...
        </div>
      )}
      <SimpleEditor
        initialContent={note.content}
        onSave={handleSave}
        title={title}
        onTitleChange={setTitle}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the note.
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

