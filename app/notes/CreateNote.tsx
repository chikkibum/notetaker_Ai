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
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { useState } from "react";

type NoteFormData = {
  title: string;
  content: any;
  folderId: string | null;
  tags?: string[];
};

const CreateNote = () => {
  const create = useMutation(api.notes.create);
  const [isOpen, setIsOpen] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<NoteFormData>({
    defaultValues: {
      title: "",
      content: { type: "doc", content: [] }, // Default TipTap/ProseMirror structure
      folderId: null,
      tags: [],
    },
  });

  const onSubmit = async (data: NoteFormData) => {
    try {
      await create({
        title: data.title,
        content: data.content,
        folderId: data.folderId as any,
        tags: data.tags,
      });
      reset();
      setIsOpen(false)
      
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  };
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Create Note</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Create New Note</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new note.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup className="py-4">
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
                <Input
                  id="content"
                  placeholder="Note content (JSON format)"
                  aria-invalid={errors.content ? "true" : "false"}
                  {...register("content", { required: "Content is required" })}
                />
                <FieldError
                  errors={errors.content ? [errors.content] : undefined}
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Note"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateNote;
