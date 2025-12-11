import { Response } from "express";
import { CustomRequest } from "../../middlewares/AuthGuard.js";
import { CreateGroupService, DeleteGroupService, EditGroupDataService } from "./services/GroupAction.service.js";
import { ListGroupByTeacherService, ListGroupByUserService } from "./services/GroupList.service.js";

// Criar grupo
export async function CreateGroupController(req: CustomRequest, res: Response) {
  try {

    const authorId = req.user._id;

    const { name, description, members } = req.body;

    const result = await CreateGroupService({authorId, name, description, members});

    res.status(201).json({ msg: result.msg, new: result.newGroup });

  } catch (err: any) {

    res.status(500).json({
      msg: "Erro interno do servidor...",
      err: err.message,
    });

  }
}

// Deletar grupo
export async function DeleteGroupController(req: CustomRequest, res: Response){
  try{

    const userId = req.user._id;

    const groupId = req.params.id;

    const result = await DeleteGroupService(groupId, userId);

    res.status(200).json({msg: result.msg});

  }
  catch(err: any){

    res.status(500).json({
      msg: "Erro interno do servidor...",
      err: err.message,
    });
    
  }
}

// Listar grupos de um professor
export async function ListGroupByTeacherController(req: CustomRequest, res: Response){
  try{

    const userId = req.user._id;

    const result = await ListGroupByTeacherService(userId);

    res.status(200).json(result.dataFormated);

  }
  catch(err: any){

    res.status(500).json({
      msg: "Erro interno do servidor...",
      err: err.message,
    });

  }
}

// Editar dados do grupo
export async function EditGroupDataController(req: CustomRequest, res: Response){
  try{
    
    const userId = req.user._id;

    const updates = req.body;

    const groupId = req.params.id;

    const result = await EditGroupDataService(userId, groupId, updates);

    res.status(201).json(result.newData);

  }
  catch(err: any){

    res.status(500).json({
      msg: "Erro interno do servidor...",
      err: err.message,
    });

  }
}

// Listar grupos de um usuário
export async function ListGroupByUserController(req: CustomRequest, res: Response){
  try{

    const userId = req.user._id;

    const result = await ListGroupByUserService(userId);

    res.status(200).json(result.group);

  }
  catch(err: any){

    res.status(500).json({
      msg: "Erro interno do servidor...",
      err: err.message,
    });

  }
}
