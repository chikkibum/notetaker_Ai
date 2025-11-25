"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import ReadNote from "@/components/notes-dialog";
import { FileText, StickyNote } from "lucide-react";

const NotesComponent = () => {
  const notes = useQuery(api.notes.getNotes);
  const [viewNotes, setViewNotes] = useState<string | null>(null);

  const isLoading = notes === undefined;

  // Helper to get note type (default to richnote for backward compatibility)
  const getNoteType = (note: any): "quicknote" | "richnote" => {
    return note.noteType || "richnote";
  };

  // Helper to get content preview
  const getContentPreview = (note: any): string => {
    const noteType = getNoteType(note);
    if (noteType === "quicknote") {
      return typeof note.content === "string" 
        ? note.content.substring(0, 100) + (note.content.length > 100 ? "..." : "")
        : "No content";
    } else {
      // For rich notes, try to extract text from JSON
      if (note.content && typeof note.content === "object") {
        const extractText = (obj: any): string => {
          if (typeof obj === "string") return obj;
          if (Array.isArray(obj)) {
            return obj.map(extractText).join(" ");
          }
          if (obj && typeof obj === "object") {
            if (obj.text) return obj.text;
            if (obj.content) return extractText(obj.content);
          }
          return "";
        };
        const text = extractText(note.content);
        return text.substring(0, 100) + (text.length > 100 ? "..." : "") || "Rich text content";
      }
      return "Rich text content";
    }
  };

  return (
    <div className="">

      {/* ------- Loading State with Skeleton -------- */}
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

      {/* ------- No Notes Found -------- */}
      {!isLoading && notes?.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No notes found</p>
      )}

      {/* ------- Notes List -------- */}
      {!isLoading && notes && notes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((data) => {
            const noteType = getNoteType(data);
            const isQuickNote = noteType === "quicknote";
            return (
              <Card key={data._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="flex-1 line-clamp-2">
                      {data.title || "Untitled Note"}
                    </CardTitle>
                    <Badge
                      variant={isQuickNote ? "default" : "secondary"}
                      className="shrink-0"
                    >
                      {isQuickNote ? (
                        <>
                          <StickyNote className="mr-1 h-3 w-3" />
                          Quick
                        </>
                      ) : (
                        <>
                          <FileText className="mr-1 h-3 w-3" />
                          Rich
                        </>
                      )}
                    </Badge>
                  </div>
                  <CardDescription>
                    {data.updatedAt
                      ? new Date(data.updatedAt).toLocaleDateString()
                      : data.createdAt
                      ? new Date(data.createdAt).toLocaleDateString()
                      : ""}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {getContentPreview(data)}
                  </p>
                </CardContent>

                <CardFooter>
                  <ReadNote
                    isOpen={viewNotes === data._id}
                    setIsOpen={(open) => setViewNotes(open ? data._id : null)}
                    data={data}
                  />
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotesComponent;
