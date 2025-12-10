import { Response } from "express";
import { CustomRequest } from "../../middlewares/AuthGuard.js";
import { CreatePostService, DeletePostService, EditPostService, LikePostService, SavePostService } from "./services/PostAction.service.js";
import { ListAllPostService, ListAuthorPostsService, ListPostByTeacherService, ListSavePostsService } from "./services/PostList.service.js";


// Criar postagem
export async function CreatePostController(req: CustomRequest, res: Response) {
    try{

        const author = req.user._id;

        const { title, content, tags } = req.body;

        const result = await CreatePostService({ title, content, tags, author });

        res.status(201).json({msg: result.post, post: result.msg});

    }
    catch(err: any){
        res.status(500).json({error: "Erro interno do servidor.", err: err.message});
    }
}

// Listar postagem
export async function ListAllPostController(req: CustomRequest, res: Response) {
    try{

        const userId = req.user._id;

        const result = ListAllPostService(userId);

        res.status(200).json((await result).dataFormated);

    }
    catch(err: any){
        res.status(500).json({error: "Erro interno do servidor.", err});
    }
}

// Deletar postagem
export async function DeletePostController(req: CustomRequest, res: Response) {
    try{

        const userId = req.params.id

        const result = await DeletePostService(userId);

        res.status(200).json(result);

    }
    catch(err: any){
        res.status(500).json("Erro interno do servidor.");
    }
}

// Listagem de postagens do usuário
export async function ListAuthorPostsController(req: CustomRequest, res: Response) {
    try{

        const authorId = req.user._id;

        const result = await ListAuthorPostsService(authorId);

        res.status(200).json(result.dataFormated);

    }
    catch(err: any){
        res.status(500).json({error: "Erro interno do servidor.", err: err.message});
    }
}

// Salvar postagem
export async function SavePostController(req: CustomRequest, res: Response) {
    try{
        const userId = req.user._id;
        const postId = req.params.id;

        const result = await SavePostService(postId, userId);

        res.status(201).json({msg: result.msg, post: result.post, saved: result.saved});
    }
    catch(err: any){
        res.status(500).json({error: "Erro interno do servidor.", err: err.message});
    }
}

// Listar postagens salvas
export async function ListSavePostsController(req: CustomRequest, res: Response){
    try{
        const userId = req.user._id;

        const result = await ListSavePostsService(userId);

        res.status(201).json({post: result.posts});
    }
    catch(err: any){
        res.status(500).json({error: "Erro interno do servidor.", err: err.message});
    }
}

// Listar postagens de um professor
export async function ListPostByTeacherController(req: CustomRequest, res: Response){
    try{
        const teacherId = req.params.id;

        const result = await ListPostByTeacherService(teacherId);

        res.status(201).json({post: result.posts});
    }
    catch(err: any){
        res.status(500).json({error: "Erro interno do servidor.", err: err.message});
    }
}

// Editar postagem
export async function EditPostController(req: CustomRequest, res: Response){
    try{

        const authorId = req.user._id;

        const postId = req.params.id;

        const updates = req.body;

        const result = await EditPostService(authorId, postId, updates);

        res.status(201).json({msg: result.msg, post: result.post});
    }
    catch(err: any){
        res.status(500).json({error: "Erro interno do servidor.", err: err.message});
    }
}

// Curtir postagem
export async function LikePostController(req: CustomRequest, res: Response){
    try{

        const userId = req.user._id;

        const postId = req.params.id;

        const result = await LikePostService(postId, userId);

        res.status(201).json({msg: result.msg, liked: result.liked});

    }
    catch(err: any){
        res.status(500).json({error: "Erro interno do servidor.", err: err.message});
    }
}