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
import { Textarea } from "../ui/textarea";
import { DialogTitle } from "@radix-ui/react-dialog";
import React, { useEffect, useState } from "react";
import { addPost, editComment, editPost } from "@/api/posts";
import { useAuthContext } from "@/contexts/AuthContext";
import { useActionContext } from "@/contexts/ActionsContext";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { DialogType, ITag } from "@/types";
import Image from "next/image";
import { CreateGroup } from "../CreateGroup/CreateGroup";

interface IDialogsProps {
  content?: string | undefined;
  titlePost?: string; //Para edição
  tagsPost?: ITag[] | undefined;
  ID?: number | undefined;
  post_id?: number | undefined;
  botton: { value: string; icon: React.ReactNode | string };
  title: string;
  label: string;
  type?: DialogType;
}

export function Dialogs({
  content,
  ID,
  post_id,
  botton,
  label,
  title,
  type,
  titlePost,
  tagsPost,
}: IDialogsProps) {
  const [value, setValue] = useState<string | undefined>(content);
  const [titlePostagem, setTitlePost] = useState<string>("");
  const [tags, setTags] = useState<string>(
    tagsPost ? tagsPost.map((t) => t.Name).join(", ") : ""
  );
  const [loadingEdit, setLoadingEdit] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const { token } = useAuthContext();
  const { listComments, listPosts } = useActionContext();


  useEffect(() => {
    if (open && tagsPost) {
      setTags(tagsPost.map(t => t.Name).join(", "));
      console.log(ID);
    }
  }, [open, tagsPost]);

  useEffect(() => {
    // Sempre que "postTitle" mudar, atualiza o input
    if (type === "editPost") {
      setTitlePost(titlePost || "");
    } else {
      setTitlePost(""); // se for criar, limpa
    }
  }, [type, titlePost]);


  // Funções de ação

  // Editar comentário
  const handleEdit = async () => {
    setLoadingEdit(true);
    try {
      if (!value?.trim()) return;
      await editComment(ID, value, token);
      await listComments(post_id, token);
      toast.success("Comentário editado com sucesso!");
    } finally {
      setLoadingEdit(false);
    }
  };

  // Fazer postagens
  const handlePost = async () => {
    setLoadingEdit(true);
    if (!titlePostagem.trim() || !value?.trim()) {
      toast.error("Informe todos os campos obrigatórios. (*)");
      setLoadingEdit(false);
      return;
    }
    try {
      // Formatando tags
      const tagsToArr = tags
        .split(",")
        .map((t) => t.trim().toLocaleLowerCase())
        .filter((tag) => tag.length > 0);

      await addPost(titlePostagem, value, token, tagsToArr);
      toast.success("Postagem feita com sucesso!");

      await listPosts(token);

      setTitlePost("");
      setValue("");
      setTags("");
    } finally {
      setLoadingEdit(false);
      setOpen(false);
    }
  };

  // Editar postagem
  const handleEditPost = async () => {
    setLoadingEdit(true);
    try {
      if (!titlePostagem.trim() || !value?.trim()) {
        toast.error("Informe todos os campos obrigatórios. (*)");
        setLoadingEdit(false);
        return;
      }
      // Formatando tags
      const tagsToArr = tags
        .split(",")
        .map((t) => t.trim().toLocaleLowerCase())
        .filter((tag) => tag.length > 0);

      await editPost(ID, titlePostagem, value, token, tagsToArr);
      toast.success("Postagem editada com sucesso!");

      await listPosts(token);

      setTitlePost("");
      setValue("");
      setTags("");
    } finally {
      setLoadingEdit(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="cursor-pointer w-full justify-start items-start"
          >
            <span className="flex items-center gap-2">
              {botton.icon}
              {botton.value}
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] z-150">
          <DialogTitle>{title}</DialogTitle>
          <DialogHeader></DialogHeader>
          <div className="grid gap-4">

            {/* Imagem */}
            {
              type === "createPost" && (
                <div className="flex justify-center">
                  <Image 
                    src={"/newPost.jpg"}
                    alt="Imagem de postagem"
                    width={100}
                    height={100}
                    className="rounded-xl transform hover:scale-110 transition-all"
                  />
                </div>
              )
            }

            {
              (type === "createGroup") && (
                <CreateGroup type="createGroup" />
              )
            }

            {/* Se for aberto para postagem ou edição de postagem insere titulo */}
            {(type === "createPost" || type === "editPost") && (
              <>
              <div className="grid gap-3">
                <Label htmlFor="title">Título*</Label>
                <Input
                  value={titlePostagem}
                  onChange={(e) => setTitlePost(e.target.value)}
                />
              </div>
            
            <div className="grid gap-3">
              <Label htmlFor="content">
                {label}
                {(type === "createPost" || type === "editPost") && "*"}
              </Label>
              <Textarea
                placeholder={type === "editPost" ?  "Novo conteúdo..." : "..."}
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
            </>
          )}
            {/* Se for aberto para postagem insere as tags */}
            {(type === "createPost" || type === "editPost") && (
              <div className="grid gap-3">
                <Label htmlFor="tags">
                  Tags <span className="italic">(separadas por vírgula)</span>
                </Label>
                <Input
                  placeholder="Tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            {
              type === "editPost" && (
                <Button
                  className="cursor-pointer bg-blue-600 hover:bg-blue-700"
                  type="submit"
                  onClick={() => handleEditPost()}
                  disabled={loadingEdit}
                >
                  {loadingEdit ? (
                    <span className="flex justify-center items-center gap-1.5">
                      <Spinner />
                      <span>Editando</span>
                    </span>
                  ) : (
                    <span>Editar</span>
                  )}
                </Button>
              )
            }
            {type === "createPost" && (
              <Button
                className="cursor-pointer bg-blue-600 hover:bg-blue-700"
                type="submit"
                onClick={() => handlePost()}
                disabled={loadingEdit}
              >
                {loadingEdit ? (
                  <span className="flex justify-center items-center gap-1.5">
                    <Spinner />
                    <span>Postando</span>
                  </span>
                ) : (
                  <span>Postar</span>
                )}
              </Button>
            )}

            {type === "editComment" && (
              <Button
                className="cursor-pointer bg-blue-600 hover:bg-blue-700"
                type="submit"
                onClick={() => handleEdit()}
                disabled={loadingEdit}
              >
                {loadingEdit ? (
                  <span className="flex justify-center items-center gap-1.5">
                    <Spinner />
                    <span>Editando</span>
                  </span>
                ) : (
                  <span>Salvar</span>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
