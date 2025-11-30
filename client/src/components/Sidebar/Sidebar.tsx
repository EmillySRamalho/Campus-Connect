"use client";

import { MdGroups, MdOutlineGroupAdd } from "react-icons/md";
import { IoSchoolSharp } from "react-icons/io5";
import { FaPlusCircle } from "react-icons/fa";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Dialogs } from "../Dialog/Dialog";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "../ui/button";
import Link from "next/link";

const title = {
  value: "Adicionar Postagem",
  icon: <FaPlusCircle />,
};

const titleGroup = {
  value: "Adicionar Turma",
  icon: <MdOutlineGroupAdd />,
};

const myGroups = {
  value: "Minhas turmas",
  icon: <MdGroups />,
};

export function Sidebar() {
  const { user } = useAuthContext();

  return (
    <Command className="rounded-lg border shadow-md md:w-[350px]">
      <CommandInput placeholder="Busque por atalhos..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {user?.role === "professor" && (
          <>
            <CommandGroup heading="Postagens">
              <CommandItem>
                <Dialogs
                  type="createPost"
                  title="Nova Postagem"
                  label="Post"
                  botton={title}
                />
              </CommandItem>
            </CommandGroup>
            <CommandGroup heading="Turmas">
              <CommandItem>
                <Dialogs
                  type="createGroup"
                  title="Nova Turma"
                  label="Descrição"
                  botton={titleGroup}
                />
              </CommandItem>
              <CommandItem>
                <Link
                  href={"/groups"}
                >
                  <Button
                    variant={"ghost"}
                    className="cursor-pointer"
                  >
                    <MdGroups />
                    <span>Minhas turmas</span>
                  </Button>
                </Link>
              </CommandItem>
              <CommandItem>
                <IoSchoolSharp />
                <span>Tarefas</span>
              </CommandItem>
            </CommandGroup>
          </>
        )}

        {user?.role === "estudante" && (
          <CommandGroup>
            <CommandItem>
              <span>Minhas turmas</span>
            </CommandItem>
          </CommandGroup>
        )}

        <CommandSeparator />
        <CommandGroup heading="Tarefas / Atividades Pendentes">
          <CommandItem>- 2 tarefas pendentes</CommandItem>
          <CommandItem>- 2 tarefas pendentes</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
