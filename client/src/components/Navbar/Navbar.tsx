"use client";

import Link from "next/link";
import { ProfileMenu } from "../ProfileMenu/ProfileMenu";
import {
  Menu,
  Home,
  Compass,
  MessageCircle,
  Edit,
  Settings,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AiOutlinePartition } from "react-icons/ai";

export const Navbar = () => {
  const itemsMobile = [
    { item: "Home", icon: <Home /> },
    { item: "Explorar", icon: <Compass /> },
    { item: "Mensagens", icon: <MessageCircle /> },
    { item: "Editar Perfil", icon: <Edit /> },
    { item: "Configurações", icon: <Settings /> },
  ];

  const itemsDesktop = [
    { item: "Editar Perfil", icon: <Edit /> },
    { item: "Configurações", icon: <Settings /> },
  ];

  const [shrunk, setShrunk] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);

  // Evento de scroll para o navbar
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;

      if (current > lastScroll && current > 60) {
        // Descendo
        setShrunk(true);
      } else {
        // Subindo
        setShrunk(false);
      }

      setLastScroll(current);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--header-height",
      shrunk ? "48px" : "80px"
    );
  }, [shrunk]);

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm
        transition-all duration-300
        ${shrunk ? "h-12" : "h-20"}
      `}
    >
      <nav className="h-full flex items-center justify-around px-4">
        <div>
          <Link href={"/"}>
            <h1 className="text-[20px] flex items-center gap-3 justify-center font-bold md:text-2xl">
              <span>Campus <span className="text-blue-700">Connect</span></span>
              <AiOutlinePartition />
            </h1>
          </Link>
        </div>
        <div className="flex md:hidden">
          <ProfileMenu iconProfile={<Menu />} items={itemsMobile} />
        </div>
        <ul className="hidden items-center md:flex md:justify-evenly md:w-[50%]">
          <li>
            <Link
              className="flex w-[100px] px-2 py-2 hover:text-white hover:bg-blue-600 hover:transition hover:rounded-2xl flex-col items-center justify-center"
              href={"/"}
            >
              <Home />
              {!shrunk && <span className="text-xs mt-1">Home</span>}
            </Link>
          </li>
          <li>
            <Link
              className="flex w-[100px] px-2 py-2 hover:text-white hover:bg-blue-600 hover:transition hover:rounded-2xl flex-col items-center justify-center"
              href={"/explorer"}
            >
              <Compass />
              {!shrunk && <span className="text-xs mt-1">Explorar</span>}
            </Link>
          </li>
          <li>
            <Link
              className="flex w-[100px] px-2 py-2 hover:text-white hover:bg-blue-600 hover:transition hover:rounded-2xl flex-col items-center justify-center"
              href={"#"}
            >
              <MessageCircle />
              {!shrunk && <span className="text-xs mt-1">Mensagens</span>}
            </Link>
          </li>
          <li className="flex px-2 py-2 hover:text-white hover:bg-blue-600 hover:transition hover:rounded-2xl flex-col items-center justify-center">
            <ProfileMenu shrunk={shrunk} iconProfile="Perfil" items={itemsDesktop} />
          </li>
        </ul>
      </nav>
    </header>
  );
};
