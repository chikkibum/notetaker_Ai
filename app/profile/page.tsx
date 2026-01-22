import React from "react";
import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
import UserDetails from "./UserDetails";

const page = () => {
  return (
    <MaxWidthWrapper maxWidth="7xl" className="lg:py-[100px] py-[48px]">
      page2
      <UserDetails/>
    </MaxWidthWrapper>
  );
};

export default page;
