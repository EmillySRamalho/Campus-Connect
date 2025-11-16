"use client";

import React, { useContext, createContext, useState, useEffect } from "react";
import { login, register, profile } from "@/api/auth";
import { IUser } from "@/types";
import { toast } from "sonner";

interface IAuthContextProps {
    loginFunc: (email: string, password: string) => Promise<void>
    registerFunc: (data: any) => Promise<any>
    loading: boolean
    token: string
    loadProfile: () => Promise<void>
    user: IUser | null
}

export const AuthContext = createContext<IAuthContextProps | null>(null);

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [token, setToken] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setToken(token);
        }
    },[]);

     useEffect(() => {
        if (token) {
            loadProfile();
        }
    }, [token]);

    // Login
    const loginFunc = async (email: string, password: string) => {
        try{
            setLoading(true);
            const res = await login(email, password)
            
            localStorage.setItem("token", res.token);
            console.log(res.token);
            setToken(res.token);

        }
        catch(err: any){
            console.log(err);
            toast.warning(err.response.data.error)
        }
        finally{
            setLoading(false);
        }
    }

    // Registro
    const registerFunc = async (data: any) => {
        try{
            setLoading(true);
            const res = await register(data);
            toast.success(res.message);
        }
        catch(err: any){
            toast.warning(err.response.data.error)
        }
        finally{
            setLoading(false);
        }
    }

    // Perfil
    const loadProfile = async () => {


        try{
            const res = await profile(token);
            setUser(res);
            console.log(res);
        }
        catch(err){
            console.log(err);
        }
    }

    const contextValues: IAuthContextProps = {
        loginFunc,
        loading,
        registerFunc,
        token,
        loadProfile,
        user
    }

    return(
        <AuthContext.Provider value={contextValues}> 
            {children}
        </AuthContext.Provider>
    ) 
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useListContext deve ser usado dentro de um ListProvider");
  }
  return context;
};

