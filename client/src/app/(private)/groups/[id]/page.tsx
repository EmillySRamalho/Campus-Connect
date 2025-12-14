"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadGroup } from "@/api/groups";
import { useAuthContext } from "@/contexts/AuthContext";
import { LoadingPage } from "@/components/Loading/LoadingPage";
import { IGroup } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PiChalkboardTeacherThin } from "react-icons/pi";
import { PiStudent } from "react-icons/pi";
import { Post } from "@/components/groups/Post/Post";
import { ModalPosts } from "@/components/groups/modal/Modal";
import { SettingsGroups } from "@/components/groups/settings/Settings";

export default function GroupDetail() {
  const [group, setGroup] = useState<IGroup | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { id } = useParams();
  const { token, user } = useAuthContext();

  const group_id = id;

  const listDetail = async () => {
    setLoading(true);
    try {
      if (!id) return;
      const data = await LoadGroup(token, group_id);
      setGroup(data.dataFormated);
      console.log(data.dataFormated);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    listDetail();
  }, [id]);

  if (loading) return <LoadingPage />;

  return (
    <div className="max-w-4xl mx-auto py-6 px-3.5">
      {/* HEADER */}
      <h1 className="text-3xl font-bold">{group?.name}</h1>
      <p className="text-gray-600">{group?.description}</p>

      <div className="mt-6">
        <Tabs defaultValue="posts">
          <TabsList>
            <TabsTrigger value="posts">Postagens</TabsTrigger>
            <TabsTrigger value="students">Participantes</TabsTrigger>
            {user?.role === "professor" && (
              <TabsTrigger value="settings">Configurações</TabsTrigger>
            )}
          </TabsList>

          <TabsContent className="my-10" value="posts">
            <div>
              <span className="flex justify-between items-center">
                <h1>Atividades da turma</h1>
                {user?.role === "professor" && (
                  <ModalPosts  group_id={String(group_id)} />
                )}
              </span>
              <hr className="my-5" />
              <Post group_id={String(group_id)} />
            </div>
          </TabsContent>

          <TabsContent value="students">
            <div className="mt-6">
              <span className="text-2xl">Professor</span>

              <hr className="my-1.5" />
              <div className="flex flex-row gap-2 mt-5 text-[18px] items-center">
                <PiChalkboardTeacherThin />
                <span>{group?.author.name}</span>
              </div>
            </div>

            <div className="mt-10">
              <div className="flex flex-row justify-between">
                <span className="text-2xl">Participantes</span>
                <span>{group?.members.length} participantes</span>
              </div>
              <hr className="my-3" />
              {group?.members.map((m) => (
                <div key={m.id}>
                  <div className="flex items-center gap-1.5">
                    {m.id !== user?.id && (
                      <>
                        <span className="flex items-center gap-1.5">
                          <PiStudent />
                          {m.name}
                        </span>
                        <hr className="my-3" />
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {user?.role === "professor" && (
            <TabsContent value="settings">
              <SettingsGroups
                title={group?.name}
                description={group?.description}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
