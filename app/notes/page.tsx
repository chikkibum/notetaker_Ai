
import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
import NotesComponent from "./NotesComponent";
import CreateNote from "./CreateNote";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const page = () => {
  return (
    <MaxWidthWrapper maxWidth="7xl" className="mt-10 lg:mt-20">
      <div className="flex items-center gap-2 justify-end">
        <Button className="items-center">
          Ask Ai <Star className="text-xs" size={2} />
        </Button>
        <CreateNote />
      </div>
      <Suspense fallback={<div>loading</div>}>
      <h1 className="text-2xl font-bold mb-6">Notes</h1>
        <ScrollArea suppressContentEditableWarning className="h-[70vh] p-6  rounded-xl bg-muted">
          <NotesComponent />
        </ScrollArea>
      </Suspense>
    </MaxWidthWrapper>
  );
};

export default page;
