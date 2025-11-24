"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { FunctionReturnType } from "convex/server";
import { api } from "@/convex/_generated/api";

// Get the return type of a specific query
type NoteData = FunctionReturnType<typeof api.notes.getNoteByID>;

interface ReadNoteProps {
  data: NoteData;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const ReadNote = ({ data, isOpen, setIsOpen }: ReadNoteProps) => {
  console.log(data, "data ssopen={isOpen} onOpenChange={setIsOpen}");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View Note</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[640px] w-full">
        <DialogHeader>
          <DialogTitle>Note Details</DialogTitle>
          <DialogDescription>View the details of this note.</DialogDescription>
        </DialogHeader>

        {/* Scrollable area for note content */}
        <div className="max-h-[60vh] overflow-auto pr-2 space-y-4">
          {/* Title */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1 text-muted-foreground">
              Title
            </label>
            <div className="rounded-md border px-3 py-2 text-sm bg-muted/50">
              {data?.title || "Untitled"}
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1 text-muted-foreground">
              Content
            </label>
            <div className="rounded-md border px-3 py-2 text-sm bg-muted/50 min-h-[200px] whitespace-pre-wrap">
              {/* {data?.content || "No content"} */}
            </div>
          </div>

          {/* Folder ID */}
          {data?.folderId && (
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1 text-muted-foreground">
                Folder ID
              </label>
              <div className="rounded-md border px-3 py-2 text-sm bg-muted/50">
                {data.folderId}
              </div>
            </div>
          )}

          {/* Tags */}
          {data?.tags && data.tags.length > 0 && (
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1 text-muted-foreground">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {data.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="mt-2">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReadNote;
