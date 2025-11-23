import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
import NotesComponent from "./NotesComponent";
import CreateNote from "./CreateNote";

const page = () => {
  return (
    <MaxWidthWrapper maxWidth="7xl" className="py-[48px] lg:py-[100px]">
      <div className="flex justify-end">
      <CreateNote/>
      </div>
      <NotesComponent/>
    </MaxWidthWrapper>
  );
};

export default page;
