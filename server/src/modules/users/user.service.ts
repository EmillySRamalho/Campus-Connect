import { UserRepository } from "./user.repository.js";
import { jwtGenerate } from "../../settings/jwt/jwt.js";
import bcrypt from "bcrypt";
import { TUser } from "../../types/user/user.type.js";

// Registro
export async function RegisterService({
  name,
  nameUser,
  email,
  password,
}: TUser) {
  // Buscando usuário
  const user = await UserRepository.findByEmail(email);

  if (user) {
    throw new Error("Usuário já existe.");
  }

  // Verificando nome de usuário
  const existsNameUser = await UserRepository.findByUserName(nameUser);

  if (existsNameUser) throw new Error("Nome de usuário já está em uso.");

  // Criptografando senha
  const salt = await bcrypt.genSalt();
  const hashPass = await bcrypt.hash(password, salt);

  // Construindo dados
  const data = {
    name,
    nameUser,
    email,
    password: hashPass,
  };

  // Salvando no banco
  await UserRepository.create(data);

  return `Registro realizado com sucesso.`;
}

// Login
export async function LoginService(email: string, password: string) {
  const user = await UserRepository.findByEmail(email);

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  if (!(await bcrypt.compare(password, user.password))) {
    throw new Error("Senha incorreta.");
  }

  const token = await jwtGenerate(user._id.toString());

  return {
    id: user._id,
    token: token,
  };
}

// Perfil
export function ProfileService(user: TUser) {
  const dataFormated = {
    id: user?._id,
    name: user.name,
    name_user: user.nameUser,
    role: user.role,
    email: user.email,
  };

  return dataFormated;
}

type DataUpdates = {
  name: string;
  nameUser: string;
  password: string;
};

// Editar dados
export async function ProfileEditService(id: string, updates: DataUpdates) {
  if (updates.nameUser) {
    const existsNameUser = await UserRepository.findByUserName(
      updates.nameUser
    );
    if (existsNameUser) throw new Error("Nome de usuário já está em uso.");
  }

  if (updates.password) {
    const salt = await bcrypt.genSalt();
    updates.password = await bcrypt.hash(updates.password, salt);
  }

  const updatedUser = await UserRepository.update(id, updates);

  return updatedUser;
}
