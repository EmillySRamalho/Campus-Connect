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
} from "lucide-react";
import { MdUpload } from "react-icons/md";

import { useEffect, useState } from "react";
import { AiOutlinePartition } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { FaRegBookmark } from "react-icons/fa";

export const NavbarClient = () => {
  const router = useRouter();

  // Items para o mobile
  const itemsMobile = [
    {
      item: "Home",
      icon: <Home />,
      onClick: () => router.push("/"),
    },
    {
      item: "Explorar",
      icon: <Compass />,
      onClick: () => router.push("/explorer"),
    },
    {
      item: "Mensagens",
      icon: <MessageCircle />,
      onClick: () => router.push("/messages"),
    },
    {
      item: "Editar Perfil",
      icon: <Edit />,
      onClick: () => router.push("/profile-edit"),
    },
    {
      item: "Configurações",
      icon: <Settings />,
      onClick: () => router.push("/settings"),
    },
    {
      item: "Minhas postagens",
      icon: <MdUpload />,
      onClick: () => router.push("my-posts"),
    },
    {
      item: "Postagens Salvas",
      icon: <FaRegBookmark />,
      onClick: () => router.push("posts-saved"),
    }
  ];

  // Items para o desktop
  const itemsDesktop = [
    {
      item: "Editar Perfil",
      icon: <Edit />,
      onClick: () => router.push("/profile-edit"),
    },
    {
      item: "Configurações",
      icon: <Settings />,
      onClick: () => router.push("/settings"),
    },
    {
      item: "Minhas postagens",
      icon: <MdUpload />,
      onClick: () => router.push("my-posts"),
    },
    {
      item: "Postagens Salvas",
      icon: <FaRegBookmark />,
      onClick: () => router.push("posts-saved"),
    }
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
        transition-all duration-300 dark:bg-gray-800
        ${shrunk ? "h-12" : "h-20"}
      `}
    >
      <nav className="h-full flex items-center justify-around px-4">
        <div>
          <Link href={"/"}>
            <h1 className="text-[20px] flex items-center gap-3 justify-center font-bold md:text-2xl">
              <span>
                Campus <span className="dark:text-blue-300 text-blue-600">Connect</span>
              </span>
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
              className="flex w-[100px] px-2 py-2 hover:text-white dark:hover:bg-blue-500 hover:bg-blue-600 hover:transition hover:rounded-2xl flex-col items-center justify-center"
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
              href={"/messages"}
            >
              <MessageCircle />
              {!shrunk && <span className="text-xs mt-1">Mensagens</span>}
            </Link>
          </li>
          <li className="flex px-2 py-2 hover:text-white hover:bg-blue-600 hover:transition hover:rounded-2xl flex-col items-center justify-center">
            <ProfileMenu
              shrunk={shrunk}
              iconProfile="Perfil"
              items={itemsDesktop}
            />
          </li>
        </ul>
      </nav>
    </header>
  );
};
