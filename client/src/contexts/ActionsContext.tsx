"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  SetStateAction,
} from "react";

import {
  loadPosts,
  likePosts,
  loadComments,
  removeLikePost,
  LoadMyPosts,
  GetSavedPosts,
} from "@/api/posts";
import { IChallenge, IComment, IPost } from "@/types";
import { LoadChallenges } from "@/api/groups";
import { toast } from "sonner";
import { connectSocket } from "@/services/socket";
import { useAuthContext } from "./AuthContext";

interface IActionsContext {
  listPosts: (token: string) => Promise<any>;
  loadingAction: boolean;
  posts: IPost[] | [];
  likeInPost: (post_id: string, token: string) => Promise<void>;
  listComments: (
    post_id: string | undefined,
    token: string
  ) => Promise<IComment[] | null>;
  unlikePost: (
    user_id: string | undefined,
    post_id: string,
    token: string
  ) => Promise<void>;
  comment: IComment[] | null;
  listMyPosts: (token: string) => Promise<any>;
  myPosts: IPost[] | [];
  postSaved: IPost[] | null;
  listSavedPosts: (token: string) => Promise<void>;
  listChallenges: (token: string, group_id: string) => Promise<any>;
  challenge: IChallenge[] | null;
  setPosts: React.Dispatch<SetStateAction<IPost[] | []>>;
  setMyPosts: React.Dispatch<SetStateAction<IPost[] | []>>;
  notification: any[] | []
}

export const ActionContext = createContext<IActionsContext | undefined>(
  undefined
);

export const ActionProvider = ({ children }: { children: React.ReactNode }) => {
  const [loadingAction, setLoadingAction] = useState<boolean>(false);
  const [notification, setNotification] = useState<any[]>([]);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [myPosts, setMyPosts] = useState<IPost[]>([]);
  const [postSaved, setPostSaved] = useState<IPost[] | null>(null);
  const [comment, setComments] = useState<IComment[] | null>(null);
  const [challenge, setChallenge] = useState<IChallenge[] | null>(null);

  const { user } = useAuthContext();

  useEffect(() => {
    const socket = connectSocket(user?.id!);

    socket.on("notification", (data) => {
      setNotification((prev) => [data, ...prev]);
      console.log("Nova notificação:", data);
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  // Listar postagens do feed
  const listPosts = async (token: string) => {
    setLoadingAction(true);
    try {
      const res = await loadPosts(token);
      console.log(res);
      setPosts(res);
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoadingAction(false);
    }
  };

  // Listar postagens do usuário
  const listMyPosts = async (token: string) => {
    setLoadingAction(true);
    try {
      const data = await LoadMyPosts(token);
      console.log(data);
      setMyPosts(data);
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoadingAction(false);
    }
  };

  // Listar postagens salvas
  const listSavedPosts = async (token: string) => {
    try {
      const data = await GetSavedPosts(token);
      console.log(data.post);
      setPostSaved(data.post);
    } catch (err: any) {
      console.log(err);
    }
  };

  // Like nos posts
  const likeInPost = async (post_id: string, token: string) => {
    try {
      await likePosts(post_id, token);
      // atualiza o estado global
      setPosts(
        (prev) =>
          prev?.map((post) =>
            post.id === post_id
              ? {
                  ...post,
                  liked_by_me: true,
                  likes_count: post.likes + 1,
                }
              : post
          ) || null
      );
    } catch (err: any) {
      console.log(err);
    }
  };

  // Retirar like
  const unlikePost = async (
    user_id: string | undefined,
    post_id: string,
    token: string
  ) => {
    try {
      await removeLikePost(user_id, post_id, token);
      setPosts(
        (prev) =>
          prev?.map((post) =>
            post.id === post_id
              ? {
                  ...post,
                  liked_by_me: false,
                  likes_count: post.likes - 1,
                }
              : post
          ) || null
      );
    } catch (err: any) {
      console.log(err);
    }
  };

  // Listagem de comentários de um post
  const listComments = async (post_id: string | undefined, token: string) => {
    try {
      const res = await loadComments(post_id, token);

      console.log(res);

      setComments(res.msg);

      return res.msg;
    } catch (err: any) {
      console.log(err);
    }
  };

  // Listagem de desafios dos grupos
  const listChallenges = async (token: string, group_id: string) => {
    try {
      const res = await LoadChallenges(token, group_id);
      console.log(res);
      setChallenge(res);
    } catch (err: any) {
      console.log(err);
    }
  };

  const contextValues = {
    listPosts,
    listMyPosts,
    myPosts,
    loadingAction,
    posts,
    likeInPost,
    listComments,
    unlikePost,
    comment,
    listSavedPosts,
    postSaved,
    listChallenges,
    challenge,
    setPosts,
    setMyPosts,
    notification
  };

  return (
    <ActionContext.Provider value={contextValues}>
      {children}
    </ActionContext.Provider>
  );
};

export const useActionContext = () => {
  const context = useContext(ActionContext);
  if (context === undefined) {
    throw new Error("use o actionContext dentro de um ActionProvider");
  }
  return context;
};
