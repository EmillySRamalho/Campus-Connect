import { Types } from "mongoose";
import { TGroup } from "../../../@types/group/group.type.js";
import { TeacherRepository } from "../../teacher/teacher.repository.js";
import { GroupRepository } from "../group.repository.js";
import { UserRepository } from "../../users/user.repository.js";

type TData = {
  authorId: string;
  name: string;
  description: string;
  members: Types.ObjectId[];
};

// Criar um grupo
export async function CreateGroupService({
  authorId,
  name,
  description,
  members,
}: TData) {
  const author = await TeacherRepository.findByUser(authorId);

  if (!author) {
    throw new Error("Professor não encontrado.");
  }

  if (!name) {
    throw new Error("Nome inválido.");
  }

  const authorObjectId = new Types.ObjectId(author._id);

  const membersObjectId = members.map((id) => new Types.ObjectId(id));

  const authorUserObjectId = new Types.ObjectId(authorId);

  const data = {
    author: authorObjectId,
    name,
    description,
    members: [...membersObjectId, authorUserObjectId],
  };

  const newGroup = await GroupRepository.create(data);

  return {
    msg: "Grupo criado com sucesso.",
    newGroup: newGroup,
  };
}

// Deletar grupos
export async function DeleteGroupService(groupId: string, userId: string) {
  const group = await GroupRepository.findById(groupId);

  if (!group) {
    throw new Error("Grupo não encontrado.");
  }

  const user = await UserRepository.findById(userId);

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  const teacher = await TeacherRepository.findByUser(userId);

  if (!teacher) {
    throw new Error("Permissões insuficientes.");
  }

  await GroupRepository.delete(groupId);

  return {
    msg: "Grupo deletado com sucesso.",
    groupId: groupId,
  };
}

type TGroupResponse = {
  _id: string;
  name: string;
  description: string;
  author: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
};

type TDataUpdates = {
  name: string;
  description: string;
};

// Editar dados do grupo
export async function EditGroupDataService(
  userId: string,
  groupId: string,
  updates: TDataUpdates
) {
  const group = await GroupRepository.findById(groupId);

  if (!group) {
    throw new Error("Grupo não encontrado.");
  }

  const user = await UserRepository.findById(userId);

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  const teacher = await TeacherRepository.findByUser(userId);

  if (!teacher) {
    throw new Error("Professor não encontrado.");
  }

  if (group.author.toString() !== teacher._id.toString()) {
    throw new Error("Permissões insuficientes.");
  }

  const newData = await GroupRepository.update(groupId, updates);

  return {
    newData,
  };
}
