import { Types } from "mongoose";
import { TGroup } from "../../../types/group/group.type.js";
import { TeacherRepository } from "../../teacher/teacher.repository.js";
import { GroupRepository } from "../group.repository.js";

type TData = {
    authorId: string;
    name: string;
    description: string;
}

// Criar um grupo
export async function CreateGroupService({authorId, name, description}: TData){

    const author = await TeacherRepository.findByUser(authorId);

    if(!author){
        throw new Error("Professor não encontrado.");
    }

    if(!name){
        throw new Error("Nome inválido.");
    }

    const authorObjectId = new Types.ObjectId(author._id);

    const data: TGroup = {
        author: authorObjectId,
        name,
        description,
    }

    const newGroup = await GroupRepository.create(data);

    return {
        msg: "Grupo criado com sucesso.",
        newGroup: newGroup
    }
}

