"use client";

import { IUser } from "@/types";
import { useEffect, useState } from "react";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { Button } from "../ui/button";
import { useActionContext } from "@/contexts/ActionsContext";
import { useAuthContext } from "@/contexts/AuthContext";
import { Comments } from "../Comments/Comments";
import { convertDate } from "@/services/formateDate";
import { FaRegBookmark } from "react-icons/fa";
import { User2Icon } from "lucide-react";
import { SavePosts } from "@/api/posts";
import { toast } from "sonner";
import { FaBookmark } from "react-icons/fa";


import dynamic from "next/dynamic";

const Markdown = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default.Markdown),
  {
    ssr: false,
  }
);

const PostTools = dynamic(() => import("../PostTools/PostTools"), {
  ssr: false,
});

interface IPostCardProps {
  title: string;
  content: string;
  created_at: string;
  likes_count: number;
  author: IUser;
  postId: string;
  liked: boolean;
  saved: boolean;
}

// Componente que renderiza uma postagem
export const PostCard = ({
  title,
  content,
  created_at,
  author,
  postId,
  likes_count,
  liked,
  saved
}: IPostCardProps) => {
  const [like, setLike] = useState(liked);
  const [save, setSave] = useState(saved);
  const [likeCounts, setLikeCounts] = useState(likes_count);
  const { likeInPost, unlikePost } = useActionContext();
  const { token, user } = useAuthContext();

  const { listSavedPosts } = useActionContext();

  // Dar like
  const handleLike = async () => {
    if (like) {

      setLike(false);

      setLikeCounts((prev) => prev - 1);

      await likeInPost(postId, token);

    } else {
      setLike(true);

      setLikeCounts((prev) => prev + 1);

      await likeInPost(postId, token);
    }
  };

  // Salvar postagens
  const handleSavePost = async () => {

    if(save) {

      setSave(false);

      await SavePosts(postId, token)

      await listSavedPosts(token);

    } 
    else {
      setSave(true)
      const data = await SavePosts(postId, token);

      await listSavedPosts(token);

      console.log(data);

      toast.success(`${data.msg}`);
    }

    
  };

  // Formatando data
  const date = convertDate(created_at);

  useEffect(() => {
    setLike(liked);
    setSave(saved)
  }, [liked, saved]);

  return (
    <div className="bg-white dark:bg-gray-800 mx-3 w-[90%] md:w-[80%] border rounded-xl shadow-sm p-2 space-y-4">
      <div className="flex justify-between items-center">
        <span className="font-bold text-[15px] flex items-center md:p-4 gap-6 justify-between md:gap-5 md:text-2xl">
          <User2Icon className="size-8" />
          <div>
            {author?.name || "anonimo"}
            <div className="flex gap-3">
              <span className="font-light text-[16px]">[{author?.role}]</span>
              <span className="font-light text-[16px]">{date}</span>
            </div>
          </div>
        </span>
        {author?.userId && user?.id === author?.userId && (
          <span>
            <PostTools
              type="editPost" //Tipo de ação que será feita ao abrir as ferramentas (editar post)
              id={postId}
              content={content}
              titlePost={title}
            />
          </span>
        )}
      </div>
      <hr />
      <div className="flex flex-col gap-5">
        <h2 className="font-bold md:text-2xl">{title}</h2>
        <div>
          <Markdown
            source={content}
            style={{ whiteSpace: "pre-wrap", backgroundColor: "transparent" }}
          />
        </div>
      </div>
      <hr />
      <div className="flex justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => handleLike()}
            className="flex cursor-pointer transition active:scale-90 px-1 py-0 items-center gap-2"
          >
            {like ? (
              <BiSolidLike className="size-6 text-blue-600 transition-all duration-200 transform scale-110 animate-like" />
            ) : (
              <BiLike className="size-6 transition-all duration-200 transform hover:scale-110" />
            )}
          </Button>
        </div>
        <Button variant={"ghost"} className="cursor-pointer">
          <Comments post_id={postId} />
        </Button>
        <Button
          variant={"ghost"}
          className="cursor-pointer transition active:scale-90"
          onClick={() => handleSavePost()}
        >
          {
            save ? (
              <FaBookmark className="size-5 text-blue-600 transition-all duration-200 transform scale-110 animate-save" />

            ) : (
              <FaRegBookmark className="size-5 transition-all duration-200 transform hover:scale-110" />
            )
          }
          
        </Button>
      </div>
      <hr />
      <div></div>
    </div>
  );
};
