"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import { useAuthContext } from "@/contexts/AuthContext";
import { useActionContext } from "@/contexts/ActionsContext";
import { MarkdownEditor } from "../MdEditor/MdEditor";
import Image from "next/image";
import { useEffect, useState } from "react";
import { addPost, editPost, editComment } from "@/api/posts";
import { DialogType } from "@/types";
import { CreateGroup } from "../CreateGroup/CreateGroup";
import { DialogTitle } from "@radix-ui/react-dialog";

interface IDialogsProps {
  content?: string;
  id?: string;
  post_id?: string;
  botton: { value: string; icon: React.ReactNode };
  title: string;
  label: string;
  type?: DialogType;
  titlePost?: string;
  tagsPost?: string[];
}

export function Dialogs({
  content,
  id,
  post_id,
  botton,
  label,
  title,
  type,
  titlePost,
  tagsPost,
}: IDialogsProps) {
  const [value, setValue] = useState<string | undefined>(content || "");
  const [titlePostagem, setTitlePost] = useState<string>(titlePost || "");
  const [tags, setTags] = useState<string>(
    tagsPost ? tagsPost.map((t: any) => t.Name).join(", ") : ""
  );
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const { token } = useAuthContext();
  const { setPosts, setMyPosts, listPosts } = useActionContext();

  useEffect(() => {
    if (open && tagsPost) {
      setTags(tagsPost.map((t: any) => t.Name).join(", "));
    }
  }, [open, tagsPost]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const handleEditComment = async () => {
    if (!value?.trim()) return;

    setLoading(true);
    try {
      await editComment(id, value, token);
      toast.success("Comentário editado!");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const handleCreatePost = async () => {
    if (!titlePostagem.trim() || !value?.trim()) {
      toast.error("Preencha os campos obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      const tagsArray = tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      const { msg: createdPost } = await addPost(
        titlePostagem,
        value,
        token,
        tagsArray
      );

      // Atualiza feed localmente
      setPosts((prev) => [createdPost, ...prev]);
      setMyPosts((prev) => [createdPost, ...prev]);

      toast.success("Post criado!");

      setTitlePost("");
      setValue("");
      setTags("");
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPost = async () => {
    if (!titlePostagem.trim() || !value?.trim()) {
      toast.error("Preencha os campos obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      const tagsArray = tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      const { msg: updatedPost } = await editPost(
        id,
        titlePostagem,
        value,
        token,
        tagsArray
      );

      await listPosts(token);

      toast.success("Post editado!");
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          // restaura automaticamente o scroll da página
          document.body.style.overflow = "auto";
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          <span className="flex items-center gap-2">
            {botton.icon}
            {botton.value}
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] h-full overflow-y-auto">
        <DialogHeader>
          <h2 className="text-lg font-bold">{title}</h2>
        </DialogHeader>

        <DialogTitle>Postagem</DialogTitle>

        {/* Conteúdo */}
        <div className="grid gap-4">
          {type === "createPost" && (
            <div className="flex justify-center">
              <Image
                src="/newPost.jpg"
                width={100}
                height={100}
                alt="Nova postagem"
                className="rounded-xl"
              />
            </div>
          )}

          {type === "createGroup" && <CreateGroup type="createGroup" />}

          {(type === "createPost" || type === "editPost") && (
            <div className="grid gap-3">
              <Label>Título*</Label>
              <Input
                value={titlePostagem}
                onChange={(e) => setTitlePost(e.target.value)}
              />
            </div>
          )}

          {(type === "createPost" ||
            type === "editPost" ||
            type === "editComment") && (
            <div className="grid gap-3">
              <Label>{label}*</Label>
              <MarkdownEditor value={value} setValue={setValue} />
            </div>
          )}

          {(type === "createPost" || type === "editPost") && (
            <div className="grid gap-3">
              <Label>Tags (separadas por vírgula)</Label>
              <Input value={tags} onChange={(e) => setTags(e.target.value)} />
            </div>
          )}
        </div>

        {/* Botões */}
        <DialogFooter>
          {type === "createPost" && (
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              disabled={loading}
              onClick={handleCreatePost}
            >
              {loading ? <Spinner /> : "Postar"}
            </Button>
          )}

          {type === "editPost" && (
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              disabled={loading}
              onClick={handleEditPost}
            >
              {loading ? <Spinner /> : "Editar"}
            </Button>
          )}

          {type === "editComment" && (
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              disabled={loading}
              onClick={handleEditComment}
            >
              {loading ? <Spinner /> : "Salvar"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
