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
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ReadNote from "@/components/notes-dialog";

const NotesComponent = () => {
  const notes = useQuery(api.notes.getNotes);
  const user = useQuery(api.users.getUserDetails);
  const [viewNotes, setViewNotes] = useState(false);

  const isLoading = notes === undefined;

  console.log(notes, "noets");
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Notes</h1>

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
      {!isLoading && notes?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((data) => (
            <Card key={data._id}>
              <CardHeader>
                <CardTitle>{data.title || "Untitled Note"}</CardTitle>
                <CardDescription>
                  {data.createdAt
                    ? new Date(data.createdAt).toLocaleDateString()
                    : ""}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-gray-600">
                  {data?.content?.type}

                  {data?._creationTime || data?.title || "No content"}
                </p>
              </CardContent>

              <CardFooter className="text-xs ">

                  <ReadNote
                    isOpen={viewNotes}
                    setIsOpen={setViewNotes}
                    data={data}
                  />
                
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesComponent;
