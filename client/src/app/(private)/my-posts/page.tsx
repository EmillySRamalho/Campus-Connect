"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { LoadingPage } from "@/components/Loading/LoadingPage";
import { NotFound } from "@/components/NotFound/NotFound";
import { PostCard } from "@/components/PostCard/PostCard";
import { useActionContext } from "@/contexts/ActionsContext";
import { useAuthContext } from "@/contexts/AuthContext";
import { useEffect } from "react";

export default function MyPosts() {
    const { token } = useAuthContext();
    const { listMyPosts, myPosts, loadingAction } = useActionContext();
  
    useEffect(() => {
      listMyPosts(token);
  
    }, [])
  
    if (loadingAction) return <LoadingPage />;
  
    if (myPosts?.length == 0 || myPosts === null) {
      return (
        <NotFound text="Você não tem postagens..." />
      );
    }

  return (
      <div className="flex flex-col justify-between w-full items-center">
        <h1 className="text-2xl my-10">Minhas Postagens</h1>
        <div className="grid w-full md:grid-cols-2 grid-cols-1 gap-15 justify-center justify-items-center">
          {myPosts?.length == 0 || myPosts === null ? (
          <NotFound text="Nenhuma postagem salva..." />
        ) : (
          myPosts?.map((post) => (
            <PostCard
              key={post.id}
              title={post.title}
              content={post.content}
              created_at={post.createdAt}
              liked={post.liked}
              likes_count={post.likes}
              author={post.author}
              postId={post.id}
              saved={post.saved}
            />
          ))
        )}
        </div>
      </div>
    );
}
