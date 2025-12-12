import { Types } from "mongoose";
import { PostRepository } from "../../posts/post.repository.js";
import { CommentRepository } from "../comment.repository.js";

type TResponseAuthor = {
  _id: string;
  name: string;
  email: string;
  role: string;
}

// Listar comentários de uma postagem
export async function ListCommentsByPostService(postId: string, userId: string){
  
  const post = await PostRepository.findById(postId);

  if(!post){
    throw new Error("Postagem não encontrada.");
  }

  const comments = await CommentRepository.findAll(postId);

  const formatedData = comments.map((comment) => {
    const author = comment.author as unknown as TResponseAuthor;

    const userObjectId = new Types.ObjectId(userId);
    const liked = comment.likes?.some((id) => id.equals(userObjectId));

    return {
      id: comment._id,
      author: author ? {
        id: author._id,
        name: author?.name,
        email: author?.email,
        role: author.role
      } : null,
      content: comment.content,
      likes: comment.likes?.length,
      createdAt: comment.createdAt,
      liked: liked
    }
  });

  return {
    comments: formatedData
  }

}