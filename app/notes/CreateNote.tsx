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
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { StickyNote, FileText } from "lucide-react";

type NoteFormData = {
  title: string;
  content: string; // For quicknotes, this will be plain text
  folderId: string | null;
  tags?: string[];
};

const CreateNote = () => {
  const createNote = useAction(api.notesAction.createNote);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [noteType, setNoteType] = useState<"quicknote" | "richnote">("quicknote");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,

  } = useForm<NoteFormData>({
    defaultValues: {
      title: "",
      content: "",
      folderId: null,
      tags: [],
    },
  });

  const onSubmit = async (data: NoteFormData) => {
    try {
      if (noteType === "richnote") {
        // For rich notes, redirect to /simple route to create
        setIsOpen(false);
        router.push("/simple");
        return;
      }

      // For quicknotes, create with plain text content
      await createNote({
        title: data.title,
        noteType: noteType,
        body: data.content,
      });
      reset();
      setNoteType("quicknote");
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  };

  const handleRichNoteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
    router.push("/simple");
  };
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="items-center">Create Note</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Create New Note</DialogTitle>
              <DialogDescription>
                Choose the type of note you want to create.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup className="py-4">
              <Tabs value={noteType} onValueChange={(v) => setNoteType(v as "quicknote" | "richnote")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="quicknote">
                    <StickyNote className="mr-2 h-4 w-4" />
                    Quick Note
                  </TabsTrigger>
                  <TabsTrigger value="richnote">
                    <FileText className="mr-2 h-4 w-4" />
                    Rich Note
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="quicknote" className="space-y-4 mt-4">
                  <Field>
                    <FieldLabel
                      htmlFor="title"
                      className={cn(errors.title && "text-destructive")}
                    >
                      Title
                    </FieldLabel>
                    <Input
                      id="title"
                      placeholder="Enter note title"
                      aria-invalid={errors.title ? "true" : "false"}
                      {...register("title", { required: "Title is required" })}
                    />
                    <FieldError
                      errors={errors.title ? [errors.title] : undefined}
                    />
                  </Field>
                  <Field>
                    <FieldLabel
                      htmlFor="content"
                      className={cn(errors.content && "text-destructive")}
                    >
                      Content
                    </FieldLabel>
                    <Textarea
                      id="content"
                      placeholder="Enter your note content..."
                      className="min-h-[150px]"
                      aria-invalid={errors.content ? "true" : "false"}
                      {...register("content", { required: "Content is required" })}
                    />
                    <FieldError
                      errors={errors.content ? [errors.content] : undefined}
                    />
                  </Field>
                </TabsContent>
                <TabsContent value="richnote" className="space-y-4 mt-4">
                  <div className="text-sm text-muted-foreground p-4 bg-muted rounded-lg">
                    <p className="mb-2">
                      Rich notes use the TipTap editor for advanced formatting.
                    </p>
                    <p>
                      Click &quot;Create Rich Note&quot; to open the editor where you can create
                      formatted documents with headings, lists, images, and more.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              {noteType === "richnote" ? (
                <Button
                  type="button"
                  onClick={handleRichNoteClick}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Rich Note"}
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Note"}
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateNote;
