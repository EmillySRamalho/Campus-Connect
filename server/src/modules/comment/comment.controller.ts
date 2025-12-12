import { Response } from "express";
import { CustomRequest } from "../../middlewares/AuthGuard.js";
import { CreateCommentService, DeleteCommentService, EditCommentService, LikeCommentService } from "./services/CommentAction.service.js";
import { ListCommentsByPostService } from "./services/CommentList.service.js";

// Criar comentários
export async function CreateCommentController(req: CustomRequest, res: Response){
    try{
        const author = req.user._id;

        const postId = req.params.id;

        const { content } = req.body;

        const result = await CreateCommentService(author, content, postId);

        res.status(201).json({msg: result.msg, comment: result.comment});
    }
    catch(err: any){
        res.status(500).json({error: err.message});
    }
}

// Deletar comentário
export async function DeleteCommentController(req: CustomRequest, res: Response) {
    try{
        const commentId = req.params.id;

        const authorId = req.user._id;

        const result = await DeleteCommentService(commentId, authorId);

        res.status(200).json({msg: result.msg});
    }
    catch(err: any){
        res.status(500).json({error: err.message});
    }
}

// Editar comentário
export async function EditCommentController(req: CustomRequest, res: Response){
    try{
        const authorId = req.user._id;

        const commentId = req.params.id;

        const updates = req.body;

        const result = await EditCommentService(authorId, commentId, updates);

        res.status(200).json({msg: result.msg, comment: result.comment});
    }
    catch(err: any){
        res.status(500).json({error: err.message});
    }
}

// Dar like em comentário
export async function LikeCommentController(req: CustomRequest, res: Response){
    try{
        const commentId = req.params.id;

        const userId = req.user._id;

        const result = await LikeCommentService(userId, commentId);

        res.status(200).json({msg: result.msg, liked: result.liked});
    }
    catch(err: any){
        res.status(500).json({error: err.message});
    }
}

// Listar comentários de uma postagem
export async function ListCommentsByPostController(req: CustomRequest, res: Response){
    try{
        const postId = req.params.id;

        const userId = req.user._id;

        const result = await ListCommentsByPostService(postId, userId);

        res.status(200).json({ msg: result.comments });
    }
    catch(err: any){
        res.status(500).json({error: err.message});
    }
}