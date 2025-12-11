"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { LoadingPage } from "@/components/Loading/LoadingPage";
import { PostCard } from "@/components/PostCard/PostCard";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { useActionContext } from "@/contexts/ActionsContext";
import { useAuthContext } from "@/contexts/AuthContext";
import { useEffect } from "react";

export default function Home() {
  const { listPosts, posts, loadingAction } = useActionContext();
  const { token } = useAuthContext();

  useEffect(() => {
    listPosts(token);
    console.log(typeof posts);
  }, []);

  return (
    <div className="flex items-start gap-10 justify-around">
      <div className="hidden md:flex sticky top-25 h-full">
        <Sidebar />
      </div>

      <div className="flex flex-col items-center justify-center gap-15 w-screen">
        {loadingAction ? (
          <LoadingPage />
        ) : (
          Array.isArray(posts) &&
          posts?.map((post, index) => (
            <PostCard
              key={`${post.id}_${index}`}
              title={post.title}
              content={post.content}
              created_at={post.createdAt}
              likes_count={post.likes}
              author={post.author}
              postId={post.id}
              liked={post.liked}
              saved={post.saved}
            />
          ))
        )}
      </div>
    </div>
  );
}
