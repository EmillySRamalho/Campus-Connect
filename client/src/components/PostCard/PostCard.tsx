"use client";

import { ITag, IUser } from "@/types";
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

import dynamic from "next/dynamic";

const PostTools = dynamic(
  () => import("../PostTools/PostTools"),
  { ssr: false }
);

interface IPostCardProps {
  title: string;
  content: string;
  created_at: string;
  likes_count: number;
  author: IUser;
  postId: number;
  liked_by_me: boolean;
  tagsPost: ITag[];
}

// Componente que renderiza uma postagem
export const PostCard = ({
  title,
  content,
  created_at,
  author,
  postId,
  likes_count,
  liked_by_me,
  tagsPost,
}: IPostCardProps) => {
  const [like, setLike] = useState(liked_by_me);
  const [likeCounts, setLikeCounts] = useState(likes_count);
  const { likeInPost, unlikePost } = useActionContext();
  const { token, user } = useAuthContext();

  const { listSavedPosts } = useActionContext();

  // Dar like
  const handleLike = async () => {
    if (like) {
      setLike(false);
      setLikeCounts((prev) => prev - 1);
      await unlikePost(user?.id, postId, token);
    } else {
      setLike(true);
      setLikeCounts((prev) => prev + 1);
      await likeInPost(user?.id, postId, token);
    }
  };

  // Salvar postagens
  const handleSavePost = async () => {
    const data = await SavePosts(postId, token);
    await listSavedPosts(token);
    console.log(data);
    toast.success(`${data.message}`);
  }

  // Formatando data
  const date = convertDate(created_at);

  useEffect(() => {
    setLike(liked_by_me);
  }, [liked_by_me]);

  return (
    <div className="bg-white mx-3 w-[90%] md:w-[80%] border rounded-xl shadow-sm p-2 space-y-4">
      <div className="flex justify-between items-center">
        <span className="font-bold text-[15px] flex items-center md:p-4 gap-6 justify-between md:gap-5 md:text-2xl">
          <User2Icon className="size-8" />
          <div>
            {author.name}
            <div className="flex gap-3">
              <span className="font-light text-[16px]">[{author.role}]</span>
              <span className="font-light text-[16px]">{date}</span>
            </div>
          </div>
        </span>
        {user?.id === author?.id && (
          <span>
            <PostTools
              type="editPost" //Tipo de ação que será feita ao abrir as ferramentas (editar post)
              ID={postId}
              content={content}
              titlePost={title}
              tagsPost={tagsPost}
            />
          </span>
        )}
      </div>
      <hr />
      <div className="flex flex-col gap-5">
        <h2 className="font-bold md:text-2xl">{title}</h2>
        <p>{content}</p>
      </div>
      <hr />
      <div className="flex justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => handleLike()}
            className="flex cursor-pointer px-1 py-0 items-center gap-2"
          >
            {like ? (
              <BiSolidLike className="size-6 text-blue-600" />
            ) : (
              <BiLike className="size-6" />
            )}
          </Button>
          <span>{likeCounts}</span>
        </div>
        <Button variant={"ghost"} className="cursor-pointer">
          <Comments post_id={postId} />
        </Button>
        <Button 
          variant={"ghost"} 
          className="cursor-pointer"
          onClick={() => handleSavePost()}
        >
          <FaRegBookmark />
        </Button>
      </div>
      <hr />
      <div>
        {tagsPost &&
          tagsPost.map((t) => (
            <span key={t.ID} className="mr-2 px-2 py-1 bg-gray-200 rounded">
              {t.Name}
            </span>
          ))}
      </div>
    </div>
  );
};
