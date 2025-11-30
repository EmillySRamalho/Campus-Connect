"use client";

import { LoadGroups } from "@/api/groups";
import { LoadingPage } from "@/components/Loading/LoadingPage";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { useAuthContext } from "@/contexts/AuthContext";
import { IUser } from "@/types";
import { GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";

type Teacher = {
  departament: string;
  formation: string;
};

type Members = {
  id: number;
  student_id: number;
  student: {
    id: number;
    name: string;
    email: string;
    bio: string;
    role: string;
  };
};

interface IGroup {
  id: string;
  nome: string;
  Description: string;
  teacher_id: number;
  teacher: Teacher;
  user: IUser;
  members: Members;
}

export default function Groups() {
  const [myGroups, setMyGroups] = useState<IGroup[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { token } = useAuthContext();

  const handleList = async () => {
    setLoading(true);
    try {
      const data = await LoadGroups(token);
      console.log(data);
      setMyGroups(data.groups);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleList();
  }, []);

  if(loading) {
    return <LoadingPage />
  }

  return (
    <div className="flex justify-between">
        <div className="hidden md:flex sticky top-25 h-full">
            <Sidebar />
        </div>
      <div className="w-screen">
          <h1 className="text-center text-2xl my-5">Listagem de grupos</h1>
          <div className="grid grid-cols-1 w-100% sm:grid-cols-2 justify-items-center items-center md:grid-cols-2 gap-4">
            {
              myGroups?.map((group) => (
                <div
                  key={group.id}
                  className="p-4
                        flex flex-col items-center justify-center
                        mx-3.5
                        cursor-pointer
                        bg-white
                        border-2 border-transparent
                        rounded-lg
                        shadow-lg
                        hover:border-blue-500 hover:shadow-xl hover:scale-[1.02]
                        transition-all duration-300
                        w-[90%]
                        h-full"
                >
                  <span>
                    <GraduationCap />
                  </span>
                  <h2 className="font-bold">{group.nome}</h2>
                  <p>{group.Description}</p>
                </div>
              ))
            }
          </div>
      </div>
    </div>
  );
}
