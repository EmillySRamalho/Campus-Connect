import { useAuthContext } from "@/contexts/AuthContext";
import axiosInstace from "./axiosInstance";

// Login
export const login = async (email: string, password: string) => {
    const res = await axiosInstace.post("/login", { email, password })
    return res.data
}

// Registro
export const register = async (data: any) => {
    const res = await axiosInstace.post("/register", data)
    return res.data
}

// Perfil
export const profile = async (token: string) => {
    const res = await axiosInstace.get("/api/profile", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
}

