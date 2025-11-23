"use client";

import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useConvexAuth } from "convex/react";
import { Header } from "@/components/resizeable-navbar/Navbar";


export default function Home() {
  const tasks = useQuery(api.tasks.get);
  const {isAuthenticated,isLoading} = useConvexAuth()

  console.log(isAuthenticated,"isauthendicated")
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* <Header/> */}
      {tasks?.map(({ _id, text }) => <div key={_id}>{text}</div>)}
      {tasks?.map(({ _id, text }) => <div key={_id}>{text}</div>)}
      {tasks?.map(({ _id, text }) => <div key={_id}>{text}</div>)}
      {tasks?.map(({ _id, text }) => <div key={_id}>{text}</div>)}
      {tasks?.map(({ _id, text }) => <div key={_id}>{text}</div>)}
      {tasks?.map(({ _id, text }) => <div key={_id}>{text}</div>)}
      {tasks?.map(({ _id, text }) => <div key={_id}>{text}</div>)}
      {tasks?.map(({ _id, text }) => <div key={_id}>{text}</div>)}
      {tasks?.map(({ _id, text }) => <div key={_id}>{text}</div>)}
      {tasks?.map(({ _id, text }) => <div key={_id}>{text}</div>)}
      {tasks?.map(({ _id, text }) => <div key={_id}>{text}</div>)}
      {tasks?.map(({ _id, text }) => <div key={_id}>{text}</div>)}
      {tasks?.map(({ _id, text }) => <div key={_id}>{text}</div>)}
      {tasks?.map(({ _id, text }) => <div key={_id}>{text}</div>)}
      {tasks?.map(({ _id, text }) => <div key={_id}>{text}</div>)}
      {tasks?.map(({ _id, text }) => <div key={_id}>{text}</div>)}
      {tasks?.map(({ _id, text }) => <div key={_id}>{text}</div>)}
      {tasks?.map(({ _id, text }) => <div key={_id}>{text}</div>)}

    </main>
  );
}