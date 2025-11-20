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
import React, { useState } from "react";
import { addPost, editComment } from "@/api/posts";
import { useAuthContext } from "@/contexts/AuthContext";
import { useActionContext } from "@/contexts/ActionsContext";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import { Input } from "../ui/input";

interface IDialogsProps {
  content?: string | undefined;
  titlePost?: string | undefined; //Para edição
  tagsPost?: string[];
  ID?: number | undefined;
  post_id?: number | undefined;
  botton: { value: string; icon: React.ReactNode | string };
  title: string;
  label: string;
  isPost: boolean;
}

export function Dialogs({
  content,
  ID,
  post_id,
  botton,
  label,
  title,
  isPost,
  titlePost
}: IDialogsProps) {
  const [value, setValue] = useState<string | undefined>(content);
  const [titlePostagem, setTitlePost] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [loadingEdit, setLoadingEdit] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const { token } = useAuthContext();
  const { listComments, listPosts } = useActionContext();

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
    if (!titlePostagem.trim() || !value?.trim()){
      toast.error("Informe todos os campos obrigatórios. (*)");
      setLoadingEdit(false);
      return;
    }
    try {

      // Formatando tags
      const tagsToArr = tags
        .split(",")
        .map(t => t.trim())
        .filter(tag => tag.length > 0);

      await addPost(titlePostagem, value, token, tagsToArr);
      toast.success("Postagem feita com sucesso!");

      await listPosts(token);

      setTitlePost("");
      setValue("");
      setTags("");
    
    } finally {
      setLoadingEdit(false);
      setOpen(false)
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>{title}</DialogTitle>
          <DialogHeader></DialogHeader>
          <div className="grid gap-4">
            {/* Se for aberto para postagem insere titulo */}
            {isPost && (
              <div className="grid gap-3">
                <Label htmlFor="title">Título*</Label>
                <Input
                  placeholder="Título do post"
                  value={titlePost}
                  onChange={(e) => setTitlePost(e.target.value)}
                />
              </div>
            )}
            <div className="grid gap-3">
              <Label htmlFor="content">{label}{isPost && "*"}</Label>
              <Textarea
                placeholder="Novo conteúdo..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
            {/* Se for aberto para postagem insere as tags */}
            {isPost && (
              <div className="grid gap-3">
                <Label htmlFor="tags">Tags <span className="italic">(separadas por vírgula)</span></Label>
                <Input
                  placeholder="Tags"
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            {isPost ? (
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
            ) : (
              <Button
                className="cursor-pointer bg-blue-600 hover:bg-blue-700"
                type="submit"
                onClick={() => handleEdit()}
                disabled={loadingEdit}
              >
                {loadingEdit ? (
                  <span className="flex justify-center items-center gap-1.5">
                    <Spinner />
                    <span>Salvando</span>
                  </span>
                ) : (
                  <span>Salvar alterações</span>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
