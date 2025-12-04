"use client";

import { loadResponses } from "@/api/posts";
import { Spinner } from "@/components/ui/spinner";
import { useAuthContext } from "@/contexts/AuthContext";
import { convertDate } from "@/services/formateDate";
import { IResponsesComment } from "@/types";
import { User2Icon } from "lucide-react";
import { useEffect, useState } from "react";

import dynamic from "next/dynamic";

const PostTools = dynamic(
  () => import("../../PostTools/PostTools"),
  { ssr: false }
);

interface IResponsesProp {
  comment_id: number;
  openResps: number | null;
  loadReps: boolean;
}

export const Responses = ({
  comment_id,
  openResps,
  loadReps,
}: IResponsesProp) => {
  const [responses, setResponses] = useState<IResponsesComment[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { token, user } = useAuthContext();

  // Listar respostas
  const handleListResponses = async () => {
    setLoading(true);
    try {
      const data = await loadResponses(comment_id, token);
      setResponses(data.data);
      console.log(data.data)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!openResps) return;
    handleListResponses();
  }, [loadReps]);

  return (
    <div className="flex flex-col gap-3.5">
      {loading ? (
        <span className="h-full w-full gap-1.5 flex justify-center items-center">
          <Spinner className="size-6 text-blue-600" />
          Carregando
        </span>
      ) : (
        Array.isArray(responses) &&
        responses.length === 0 || responses === null ? (
          <span className="flex justify-center items-center">Nenhuma resposta...</span>
        ) : (
          responses?.map((resp) => (
          <div key={resp.id} className="p-3 dark:bg-gray-700 rounded-lg bg-blue-100 ml-1.5">
            <span className="flex justify-between">
              <div className="flex py-3 items-center gap-2">
                <User2Icon className="size-6 md:size-8" />
                <div className="text-sm flex flex-col font-semibold">
                  <span>{resp.user.name}</span>
                  {/* <span className="font-light">
                    {convertDate(resp.created_at)}
                  </span> */}
                </div>
              </div>
              {resp.user.id === user?.id && (
                <PostTools
                  ID={resp.id}
                  type="editResponse"
                  content={resp.content}
                  commentId={comment_id}
                />
              )}
            </span>
            <p className="text-sm">{resp.content}</p>
          </div>
        ))
      )
      )}
    </div>
  );
};
