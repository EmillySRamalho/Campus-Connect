"use client";

import { TabsDemo } from "@/components/TabsForm/TabsForm";
import { AiOutlinePartition } from "react-icons/ai";


export default function Login() {
  return (
    <div className="w-full h-screen flex flex-col justify-evenly items-center p-3">
      <h1 className="text-[25px] flex items-center gap-3 justify-center font-bold md:text-2xl">
        <span>Campus <span className="text-blue-700">Connect</span></span>
        <AiOutlinePartition />
      </h1>
      <TabsDemo />
    </div>
  );
}
