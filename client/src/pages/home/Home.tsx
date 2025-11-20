"use client";

import { LoadingPage } from "@/components/Loading/LoadingPage";
import { PostCard } from "@/components/PostCard/PostCard";
import { Sidebar } from "@/components/Sidebar/Sidebar";
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
    <div className="flex items-start gap-10 justify-around">
      <div className="hidden md:flex sticky top-25 h-full">
        <Sidebar />
      </div>


      <div className="flex flex-col items-center justify-center gap-10 w-screen">
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
              tagsPost={post.tags}
              liked_by_me={post.liked_by_me}
            />
          ))
        )}
      </div>
    </div>
  );
};
