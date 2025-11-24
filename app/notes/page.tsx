import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
import NotesComponent from "./NotesComponent";
import CreateNote from "./CreateNote";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const page = () => {
  return (
    <MaxWidthWrapper maxWidth="7xl" className="py-[48px] lg:py-[100px]">
      <div className="flex items-center gap-2 justify-end">
        <Button className="items-center">
          Ask Ai <Star className="text-xs" size={2}/>
        </Button>
      <CreateNote/>
      </div>
      <Suspense fallback={<div>loading</div>}>
      <NotesComponent/>
      </Suspense>
    </MaxWidthWrapper>
  );
};

export default page;
