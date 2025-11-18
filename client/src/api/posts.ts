import axiosInstace from "./axiosInstance";
import { IPost } from "@/types";

// Listar postagens no feed
export const loadPosts = async (token: string) => {
  const res = await axiosInstace.get("/api/feed", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// Dar Like nos posts
export const likePosts = async (
  user_id: number | undefined,
  post_id: number,
  token: string
) => {
  const res = await axiosInstace.post(
    "/api/post/like",
    {
      user_id,
      post_id,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data.data;
};

// Retirar like
export const removeLikePost = async (
  user_id: number | undefined,
  post_id: number,
  token: string
) => {
  const res = await axiosInstace.delete("/api/post/unlike", {
    data: {
      user_id,
      post_id,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Listar comentários de uma publicação
export const loadComments = async (post_id: number, token: string) => {
  const res = await axiosInstace.get(`/api/post/${post_id}/comments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

//Criar comentáio
export const createComents = async (content: string, post_id: number, token: string) => {
  const res = await axiosInstace.post(
    `/api/post/${post_id}/comments`,
    {
      content,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
