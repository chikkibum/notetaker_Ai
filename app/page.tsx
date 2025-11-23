"use client";

import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useConvexAuth } from "convex/react";

import { Header } from "@/components/resizeable-navbar/Navbar";
import { useAuthActions } from "@convex-dev/auth/react";


export default function Home() {
  const {isAuthenticated,isLoading} = useConvexAuth()

  console.log(isAuthenticated,"isauthendicated")
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* <Header/> */}
      welcome {}

    </main>
  );
}