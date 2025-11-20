import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuthContext } from "@/contexts/AuthContext";
import { User } from "lucide-react";
import React, { useEffect } from "react";
import { BiExit } from "react-icons/bi";

type listItems = {
  item: string;
  icon: React.ReactNode;
};

interface IProfileMenuProps {
  items: listItems[];
  iconProfile?: React.ReactNode | string;
  shrunk?: boolean
}

export function ProfileMenu({ items, iconProfile, shrunk }: IProfileMenuProps) {
  const { logout, user } = useAuthContext();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="cursor-pointer w-[100px] flex flex-col items-center justify-center">
          <User className="hidden md:flex" />
          {!shrunk && <span className="text-xs mt-1">{iconProfile}</span>}
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Meu perfil</SheetTitle>
          <div className="flex flex-col mt-2 gap-1">
            <span className="font-semibold">{user?.name}</span>
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <span className="text-sm text-muted-foreground">{user?.role}</span>
          </div>
        </SheetHeader>
        <hr />
        <div className="mt-6 flex flex-col gap-3">
          {items.map((item, index) => (
            <div key={index} className="grid gap-3">
              <Button
                className="justify-start cursor-pointer"
                variant={"ghost"}
              >
                {item.icon} {item.item}
              </Button>
            </div>
          ))}
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button
              onClick={logout}
              className="cursor-pointer"
              variant="destructive"
            >
              Sair
              <BiExit />
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
