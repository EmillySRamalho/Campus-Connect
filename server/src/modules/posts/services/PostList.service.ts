import { TAuthor, TPost } from "../../../types/post/post.type.js";
import { TeacherRepository } from "../../teacher/teacher.repository.js";
import { UserRepository } from "../../users/user.repository.js";
import { PostRepository } from "../post.repository.js";

// Listar postagens
export async function ListAllPostService() {
  const posts = await PostRepository.findAll();

  const dataFormated = posts.map((post) => {
    const author = post.author as TAuthor;
    const user = author?.user;

    return {
      id: post._id,
      title: post.title,
      content: post.content,
      author: user
        ? {
            id: author._id,
            name: author.user.name,
            email: author.user.email,
            role: author.user.role,
          }
        : null,
      likes: post?.likes?.length,
      comments: post?.comments?.length,
      createdAt: post.createdAt,
    };
  });

  return { dataFormated };
}

// Listar postagens do author
export async function ListAuthorPostsService(authorId: string) {
  const user = await UserRepository.findById(authorId);
  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  const teacher = await TeacherRepository.findByUser(authorId);
  if (!teacher) {
    throw new Error("Professor não encontrado para este usuário.");
  }

  const posts = await PostRepository.findPostByAuthor(teacher._id);

  const dataFormated = posts.map((post: TPost) => {
    const author = post.author as TAuthor;
    const user = author?.user;

    return {
      id: post._id,
      author: user
        ? {
            id: author._id,
            name: author.user?.name,
            email: author.user?.email,
            role: author.user?.role,
          }
        : null,
      title: post.title,
      content: post.content,
      tags: post.tags,
      likes: post.likes,
    };
  });

  return { dataFormated };
}

// Listar postagens salvas
export async function ListSavePostsService(userId: string) {
  const user = await UserRepository.findById(userId);

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  const saveds = user?.postsSaveds?.map((post: any) => {
    const author = post.author as TAuthor;
    const user = author?.user;

    return {
      id: post._id,
      title: post.title,
      content: post.content,
      author: user
        ? {
            id: author._id,
            name: author.user.name,
            email: author.user.email,
            role: author.user.role,
          }
        : null,
      likes: post?.likes?.length,
      comments: post?.comments?.length,
      createdAt: post.createdAt,
    };
  });

  return {
    posts: saveds,
  };
}

// Listar postagens de um professor
export async function ListPostByTeacherService(teacherId: string) {
  const teacher = await TeacherRepository.findById(teacherId);

  if (!teacher) {
    throw new Error("Professor não encontrado.");
  }

  const posts = await PostRepository.findPostByAuthor(teacherId);

  const dataFormated = posts.map((post: TPost) => {
    const author = post.author as TAuthor;
    const user = author?.user;

    return {
      id: post._id,
      title: post.title,
      content: post.content,
      author: user
        ? {
            id: author._id,
            name: author.user.name,
            email: author.user.email,
            role: author.user.role,
          }
        : null,
      likes: post?.likes?.length,
      comments: post?.comments?.length,
      createdAt: post.createdAt,
    };
  });

  return{
    posts: dataFormated
  }
}
