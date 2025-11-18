"use client";

import * as React from "react";

import { FiSend } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import { GrSend } from "react-icons/gr";


import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { FaRegCommentDots } from "react-icons/fa";
import { useActionContext } from "@/contexts/ActionsContext";
import { useAuthContext } from "@/contexts/AuthContext";
import { IComment } from "@/types";
import { Spinner } from "../ui/spinner";
import { createComents } from "@/api/posts";
import { convertDate } from "@/services/formateDate";
import { CommentTools } from "../CommentTools/CommentTools";

interface ICommentsProps {
  post_id: number;
}

export function Comments({ post_id }: ICommentsProps) {
  const [text, setText] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [comment, setComments] = React.useState<IComment[] | null>(null);
  const [loadingComments, setLoadingComments] = React.useState<boolean>(false);
  const [sending, setSending] = React.useState<boolean>(false);
  const { listComments } = useActionContext();
  const { token } = useAuthContext();

  const { user } = useAuthContext();

  const handleSend = async () => {
    setSending(true);
    try {
      if (!text.trim()) return;

      await createComents(text, post_id, token);
      const data = await listComments(post_id, token);
      setComments(data);

      setText("");
    } finally {
      setSending(false);
    }
  };

  return (
    <Drawer
      open={open}
      onOpenChange={async (isOpen) => {
        setOpen(isOpen);
        if (isOpen) {
          setLoadingComments(true);
          const data = await listComments(post_id, token);
          setComments(data);
          setLoadingComments(false);
        }
      }}
    >
      <DrawerTrigger asChild>
        <div className="cursor-pointer">
          <FaRegCommentDots className="size-5" />
        </div>
      </DrawerTrigger>

      <DrawerContent className="p-0">
        {/* Header */}
        <DrawerHeader className="border-b">
          <DrawerTitle className="text-lg font-semibold">
            Comentários
          </DrawerTitle>
        </DrawerHeader>

        {/* Lista scrollável */}
        <div className="h-[60vh] overflow-y-auto px-4 py-3 space-y-4">
          {loadingComments ? (
            <div className="flex h-full gap-2.5 justify-center items-center">
              <Spinner className="size-8 text-blue-500" />
              <span>Carregando</span>
            </div>
          ) : (
            <>
              {comment?.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Nenhum comentário ainda.
                </p>
              )}

              {comment?.map((c, i) => (
                <div key={i} className="p-3 rounded-lg bg-secondary">
                  <span className="flex justify-between">
                    <p className="text-sm font-semibold">
                      {c.User.name} - {convertDate(c.created_at)}
                    </p>
                    {c.User.id === user?.id && <CommentTools ID={c.ID} />}
                  </span>
                  <p className="text-sm">{c.content}</p>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Caixa de comentários fixa embaixo */}
        <div className="border-t p-3 flex items-center gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escreva um comentário..."
            className="flex-1 bg-muted p-2 rounded-md outline-none"
          />

          <Button
            className="cursor-pointer bg-blue-600 hover:bg-blue-700"
            onClick={handleSend}
            disabled={sending}
          >
            {
              sending ? (
                <GrSend />
              ) : (
                <FiSend className="size-5" />
              )
            }
            
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
