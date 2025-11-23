import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
import NotesComponent from "./NotesComponent";
import CreateNote from "./CreateNote";
import { Suspense } from "react";
import { getUserDetails } from "@/convex/users";

const page = () => {
  return (
    <MaxWidthWrapper maxWidth="7xl" className="py-[48px] lg:py-[100px]">
      <div className="flex justify-end">
      <CreateNote/>
      </div>
      <Suspense fallback={<div>loading</div>}>
      <NotesComponent/>
      </Suspense>
    </MaxWidthWrapper>
  );
};

export default page;
