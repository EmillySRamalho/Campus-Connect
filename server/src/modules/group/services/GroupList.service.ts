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
