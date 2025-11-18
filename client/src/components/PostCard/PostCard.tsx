"use clinet";

import { IUser } from "@/types";
import { useEffect, useState } from "react";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { Button } from "../ui/button";
import { useActionContext } from "@/contexts/ActionsContext";
import { useAuthContext } from "@/contexts/AuthContext";
import { Comments } from "../Comments/Comments";
import { likePosts } from "@/api/posts";
import { convertDate } from "@/services/formateDate";

interface IPostCardProps {
  title: string;
  content: string;
  created_at: string;
  likes_count: number;
  author: IUser;
  postId: number;
  liked_by_me: boolean;
}

export const PostCard = ({
  title,
  content,
  created_at,
  author,
  postId,
  likes_count,
  liked_by_me,
}: IPostCardProps) => {
  const [like, setLike] = useState(liked_by_me);
  const [likeCounts, setLikeCounts] = useState(likes_count);
  const { likeInPost, unlikePost } = useActionContext();
  const { token, user } = useAuthContext();

  // Dar like
  const handleLike = async () => {
    if(like){
      setLike(false);
      setLikeCounts((prev) => prev - 1);
      await unlikePost(user?.id, postId, token);
    }
    else {
      setLike(true);
      setLikeCounts((prev) => prev + 1);
      await likeInPost(user?.id, postId, token);
    }
  }

  // Formatando data
  const date = convertDate(created_at);

  useEffect(() => {
    setLike(liked_by_me);
  }, [liked_by_me])

  return (
    <div className="bg-white mx-3 w-[90%] md:w-[50%] border rounded-xl shadow-sm p-4 space-y-4">
      <div className="flex justify-between items-center">
        <span className="font-bold">
          {author.name} - {author.role} - {like ? "true" : "false"} - { liked_by_me ? "true" : "false" }
        </span>
        <span>{date}</span>
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
            <span>{like ? "Curtido" : "Curtir"}</span>
          </Button>
          <span>{likeCounts}</span>
        </div>
        <Button variant={"ghost"} className="cursor-pointer">
          <Comments post_id={postId} />
        </Button>
      </div>
    </div>
  );
};
