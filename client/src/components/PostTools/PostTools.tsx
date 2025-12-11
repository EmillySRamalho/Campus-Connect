"use client";


import { MoreHorizontalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BiPencil, BiTrash } from "react-icons/bi";
import { Dialogs } from "../Dialog/Dialog";
import { deleteComment, deletePost, deleteResponse, loadResponses } from "@/api/posts";
import { useAuthContext } from "@/contexts/AuthContext";
import { useActionContext } from "@/contexts/ActionsContext";
import { toast } from "sonner";
import { ConfirmToast } from "../ConfirmToast/ConfirmToast";
import { useState } from "react";
import { DialogType } from "@/types";

interface ICommentToolsProps {
  id: string;
  content?: string;
  post_id?: string | undefined;
  titlePost?: string; // Para editar
  type?: DialogType;
  commentId?: string
}

const title = {
  value: "Editar",
  icon: <BiPencil />,
};

export default function PostTools({
  id,
  content,
  post_id,
  titlePost,
  type,
  commentId
}: ICommentToolsProps) {
  const { token } = useAuthContext();
  const { listComments, setPosts, setMyPosts } = useActionContext();
  const [loading, setLoading] = useState<boolean>(false);


  // Deletar postagem caso seja isPost
  const handleDeletePost = async () => {
    setLoading(true);
    try {
      await deletePost(id, token);

    // Atualiza feed sem
    setPosts(prev => prev.filter(post => post.id !== id));

    // Atualiza meus posts
    setMyPosts(prev => prev.filter(post => post.id !== id));

    toast.success("Post deletado com sucesso");
    } finally {
      setLoading(false);
    }
  };

  // Deletar comentário
  const handleDeleteComment = async () => {
    await deleteComment(id, token);
    await listComments(post_id, token);
    toast.success("Comentário deletado com sucesso");
  };

  // Deletar resposta
  const handleDeleteResponse = async () => {
    await deleteResponse(id, token);
    await loadResponses(commentId, token);
    toast.success("Resposta deletada com sucesso");
  }
 
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            className="cursor-pointer"
            variant="ghost"
            aria-label="Open menu"
            size="icon-sm"
          >
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="end">
          <DropdownMenuGroup>
            {/* Se for aberto por uma postagem */}
            {type === "editPost" && (
              <>
                {/* Botão de confirmação para deletar */}
                <ConfirmToast
                  text="Excluir"
                  icon={<BiTrash />}
                  description="Deseja excluir a postagem?"
                  message="Excluir postagem"
                  label="Sim"
                  onClick={handleDeletePost}
                  action="Deletando"
                  loading={loading}
                />

                <div className="cursor-pointer">
                  <Dialogs
                    titlePost={titlePost}
                    type="editPost"
                    title="Edição de Postagem"
                    label="Conteúdo"
                    botton={title}
                    content={content}
                    id={id}
                  />
                </div>
              </>
            )}

            {/* Se for aberto por um comentário */}
            {type === "editComment" && (
              <>
                <Button
                  variant={"ghost"}
                  className="cursor-pointer w-full justify-start"
                  onClick={() => handleDeleteComment()}
                >
                  <BiTrash />
                  Excluir
                </Button>
                <div className="cursor-pointer">
                  <Dialogs
                    type="editComment"
                    title="Edição de comentário"
                    label="Comentário"
                    botton={title}
                    content={content}
                    id={id}
                    post_id={post_id}
                  />
                </div>
              </>
            )}

            {/* Se for aberto por uma resposta de comentário */}
            {type === "editResponse" && (
              <>
                <Button
                  variant={"ghost"}
                  className="cursor-pointer w-full justify-start"
                  onClick={() => handleDeleteResponse()}
                >
                  <BiTrash />
                  Excluir
          
                </Button>
                <div className="cursor-pointer">
                  <Dialogs
                    type="editComment"
                    title="Edição de comentário"
                    label="Comentário"
                    botton={title}
                    content={content}
                    id={id}
                    post_id={post_id}
                  />
                </div>
              </>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
