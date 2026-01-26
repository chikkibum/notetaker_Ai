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
import { FunctionReturnType } from "convex/server";
import { api } from "@/convex/_generated/api";
import { TipTapRenderer } from "@/components/tiptap-renderer";
import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";
// Get the return type of a specific query
type NoteData = FunctionReturnType<typeof api.notes.getNoteByID>;

interface ReadNoteProps {
  data: NoteData;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const ReadNote = ({ data, isOpen, setIsOpen }: ReadNoteProps) => {
  const router = useRouter();
  const noteType = data?.noteType || "richnote"; // Default to richnote for backward compatibility
  const isRichNote = noteType === "richnote";

  const handleOpenInEditor = () => {
    if (data?._id) {
      router.push(`/notes/${data._id}/edit`);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">View Note</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[640px] w-full max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{data?.title || "Untitled Note"}</DialogTitle>
          <DialogDescription>
            {isRichNote ? "Rich text note" : "Quick note"}
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable area for note content */}
        <div className="flex-1 overflow-auto pr-2 space-y-4 min-h-0">
          {/* Content */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-2 text-muted-foreground">
              Content
            </label>
            <div className="rounded-md border px-3 py-2 text-sm bg-muted/50 min-h-[200px]">
              {isRichNote ? (
                data?.content ? (
                  <TipTapRenderer content={data.content} />
                ) : (
                  <p className="text-muted-foreground">No content</p>
                )
              ) : (
                <p className="whitespace-pre-wrap">
                  {typeof data?.content === "string"
                    ? data.content || "No content"
                    : "No content"}
                </p>
              )}
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

        <DialogFooter className="mt-2 flex gap-2">
          {isRichNote && (
            <Button
              type="button"
              variant="default"
              onClick={handleOpenInEditor}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open in Editor
            </Button>
          )}
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
