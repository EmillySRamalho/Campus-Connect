import axiosInstace from "./axiosInstance";

// Listagem de grupos criados pelo professor
export const LoadGroups = async (token: string) => {
    const res = await axiosInstace.get("/api/group/list",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return res.data;
}