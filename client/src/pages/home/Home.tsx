"use client";

import { LoadingPage } from "@/components/Loading/LoadingPage";
import { PostCard } from "@/components/PostCard/PostCard";
import { useActionContext } from "@/contexts/ActionsContext";
import { useAuthContext } from "@/contexts/AuthContext";
import { useEffect } from "react";

export const HomePage = () => {
  const { listPosts, posts, loadingAction } = useActionContext();
  const { token } = useAuthContext();

  useEffect(() => {
    listPosts(token);
    console.log(typeof posts)
  }, []);

  return (
    <div className="flex flex-col items-center gap-10 justify-center">
      {loadingAction ? (
        <LoadingPage />
      ) : (
        posts?.map((post) => (
          <PostCard
            key={post.id}
            title={post.title}
            content={post.content}
            created_at={post.created_at}
            likes_count={post.likes_count}
            author={post.user}
            postId={post.id}
            liked_by_me={post.liked_by_me}
          />
        ))
      )}
    </div>
  );
};
