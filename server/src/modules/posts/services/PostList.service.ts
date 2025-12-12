import { Types } from "mongoose";
import { TAuthor, TPost } from "../../../@types/post/post.type.js";
import { TeacherRepository } from "../../teacher/teacher.repository.js";
import { UserRepository } from "../../users/user.repository.js";
import postModel from "../post.model.js";
import { PostRepository } from "../post.repository.js";

// Listar postagens
export async function ListAllPostService(userId: string) {
  const posts = await PostRepository.findAll();
  const user = await UserRepository.findById(userId);

  const savedIds = user?.postsSaveds || [];

  const dataFormated = posts.map((post) => {
    const author = post.author as TAuthor;
    const user = author?.user;

    const userObjectId = new Types.ObjectId(userId);
    const liked = post.likes?.some((id) => id.equals(userObjectId));

    const saved = savedIds.some((savedId) => savedId.equals(post._id));

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
            userId: author.user._id,
          }
        : null,
      likes: post?.likes?.length,
      comments: post?.comments?.length,
      createdAt: post.createdAt,
      liked: liked,
      saved: saved,
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

  const savedIds = user?.postsSaveds || [];

  const teacher = await TeacherRepository.findByUser(authorId);
  if (!teacher) {
    throw new Error("Professor não encontrado para este usuário.");
  }

  const posts = await PostRepository.findPostByAuthor(teacher._id);

  const dataFormated = posts.map((post: TPost) => {
    const author = post.author as TAuthor;
    const user = author?.user;

    const userObjectId = new Types.ObjectId(authorId);
    const liked = post.likes?.some((id) => id.equals(userObjectId));

    const saved = savedIds.some((savedId) => savedId.equals(post._id));

    return {
      id: post._id,
      author: user
        ? {
            id: author._id,
            name: author.user?.name,
            email: author.user?.email,
            role: author.user?.role,
            userId: author.user._id,
          }
        : null,
      title: post.title,
      content: post.content,
      tags: post.tags,
      likes: post.likes?.length,
      liked: liked,
      saved: saved,
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

  const savedIds = user.postsSaveds || [];

  const posts = await postModel.find({ _id: { $in: savedIds } }).populate({
    path: "author",
    populate: {
      path: "user",
      select: "name email role",
    },
  });

  const formatted = posts.map((post: any) => {
    const author = post.author;
    const user = author?.user;

    const userObjectId = new Types.ObjectId(userId);
    const liked = post.likes?.some((id: any) => id.equals(userObjectId));

    const saved = savedIds.some((savedId) => savedId.equals(post._id));

    return {
      id: post._id,
      title: post.title,
      content: post.content,
      author: user
        ? {
            id: author._id,
            name: user.name,
            email: user.email,
            role: user.role,
          }
        : null,
      likes: post.likes?.length || 0,
      comments: post.comments?.length || 0,
      createdAt: post.createdAt,
      liked: liked,
      saved: saved,
    };
  });

  return {
    posts: formatted,
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

  return {
    posts: dataFormated,
  };
}
