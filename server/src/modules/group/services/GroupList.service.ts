import { Types } from "mongoose";
import { TAuthor } from "../../../@types/post/post.type.js";
import { TeacherRepository } from "../../teacher/teacher.repository.js";
import { UserRepository } from "../../users/user.repository.js";
import { GroupRepository } from "../group.repository.js";

// Listar grupos de um professor
export async function ListGroupByTeacherService(userId: string) {
  const user = await UserRepository.findById(userId);

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  const teacher = await TeacherRepository.findByUser(userId);

  if (!teacher) {
    throw new Error("Professor não encontrado.");
  }

  const groups = await GroupRepository.findByAuthor(teacher._id);

  const dataFormated = groups.map((group) => {
    const author = group.author as unknown as TAuthor;
    const user = author.user;

    return {
      id: group._id,
      name: group.name,
      description: group.description,
      author: user
        ? {
            id: author._id,
            name: author.user.name,
            email: author.user.email,
            role: author.user.role,
            userId: author.user._id,
          }
        : null,
      members: group.members,
      createdAt: group.createdAt,
    };
  });

  return {
    dataFormated,
  };
}

// Listar grupo de um participante
export async function ListGroupByUserService(userId: string) {

  const teacher = await TeacherRepository.findByUser(userId);

  const group = await GroupRepository.findByUser(teacher?._id);

  if (!group) {
    throw new Error("Grupo não encontrado.");
  }

  return {
    group,
  };
}

// Listar detalhes do grupo
export async function ListGroupDetailService(groupId: string, userId: string){

  const author = await TeacherRepository.findByUser(userId);

  const user = await UserRepository.findById(userId);

  if(!author || !user){
    throw new Error("Usuário não encontrado.");
  }

  const group = await GroupRepository.findById(groupId);

  if(!group){
    throw new Error("Grupo não encontrado.");
  }

  const isUserInGroup = group.members?.some(userId => userId._id.equals(user._id));

  if(!isUserInGroup){
    throw new Error("Usuário não participa do grupo.");
  }

  const authorRes = group.author as unknown as TAuthor;
  const userRes = authorRes.user;


  const dataFormated = {
    id: group._id,
    name: group.name,
    description: group.description,
    author: userRes ? {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    } : null,
    members: group.members?.map((m: any) => ({
      id: m._id,
      name: m.name,
      email: m.email,
      role: m.role
    }))
  }

  return {
    dataFormated
  }

}
