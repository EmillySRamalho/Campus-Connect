import { ParamValue } from "next/dist/server/request/params";
import axiosInstace from "./axiosInstance";

// Listagem de grupos criados pelo professor
export const LoadGroups = async (token: string) => {
  const res = await axiosInstace.get("api/group/teacher/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// Busca de estudantes
export const SearchStudents = async (token: string, q: string) => {
  const res = await axiosInstace.get(`/api/search/user?q=${q}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// Criar grupo
export const CreateNewGroup = async (
  name: string,
  description: string,
  members: string[],
  token: string
) => {
  const res = await axiosInstace.post(
    "/api/group",
    {
      name,
      description,
      members,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

// Detalhes de um grupo
export const LoadGroup = async (
  token: string,
  group_id: number | ParamValue
) => {
  const res = await axiosInstace.get(`/api/group/${group_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// Criando desafio
export const CreateChallenge = async (
  token: string,
  group_id:  number | undefined,
  title: string,
  description: string,
  type: string,
  xp: number
) => {
  const res = await axiosInstace.post(
    `/api/group/${group_id}/challenge`,
    {
      title,
      description,
      type,
      xp,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

// Listar desafios
export const LoadChallenges = async (token: string, group_id: string) => {
  const res = await axiosInstace.get(`/api/group/${group_id}/challenge`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
