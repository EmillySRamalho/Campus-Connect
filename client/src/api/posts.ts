import axiosInstace from "./axiosInstance";

// Criar postagem
export const addPost = async (title: string, content: string | undefined, token: string, tags?: string[]) => {
  const res = await axiosInstace.post("/api/posts", 
    { title, content, tags },
    {
      headers: {
        Authorization: `Bearer ${token}`
      } 
    }
  );

  return res.data;
}

// Deletar postagens
export const deletePost = async (post_id: number | undefined, token: string) => {
  const res = await axiosInstace.delete(`/api/post/${post_id}`, 
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return res.data;
}

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
  post_id: number | undefined,
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
export const loadComments = async (post_id: number | undefined, token: string) => {
  const res = await axiosInstace.get(`/api/post/${post_id}/comments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

//Criar comentáio
export const createComents = async (
  content: string,
  post_id: number,
  token: string
) => {
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

// Editar comentário
export const editComment = async (
  commentId: number | undefined,
  content: string,
  token: string
) => {
  const res = await axiosInstace.put(
    `/api/comment/${commentId}`,
    { content },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

