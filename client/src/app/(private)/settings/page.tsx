"use client";

import { Button } from "@/components/ui/button";
import { Paintbrush } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { MdLightMode, MdDarkMode } from "react-icons/md";

export default function Settings() {
  const { setTheme } = useTheme();
  const [dark, setDark] = useState<boolean>(false);

  const handleTheme = () => {
    setDark((prev) => !prev);
    dark ? setTheme("dark") : setTheme("light");
  };
  return (
    <div className="mx-2.5 h-100">
      <div>
        <div className="flex items-center gap-1.5">
          <span className="text-2xl">Tema</span>
          <span>
            <Paintbrush />
          </span>
        </div>
        <hr className="my-1.5" />

        <div>
          <Button
            onClick={() => handleTheme()}
            className="cursor-pointer"
            variant={"outline"}
          >
            {dark ? <MdDarkMode /> : <MdLightMode />}
          </Button>
        </div>
      </div>
    </div>
  );
}
