import axiosInstace from "./axiosInstance";

// Listagem de grupos criados pelo professor
export const LoadGroups = async (token: string) => {
  const res = await axiosInstace.get("/api/group/list", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// Busca de estudantes
export const SearchStudents = async (token: string, q: string) => {
  const res = await axiosInstace.get(`/api/students/search?q=${q}`, {
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
  members: number[],
  token: string
) => {
  const res = await axiosInstace.post(
    "/api/group/create",
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
