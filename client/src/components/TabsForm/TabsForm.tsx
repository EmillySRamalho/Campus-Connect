"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useAuthContext } from "@/contexts/AuthContext";
import { Spinner } from "../ui/spinner";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha tem que ter no mínimo 6 caracteres."),
});

const registerSchema = z
  .object({
    name: z.string().min(3, "Digite seu nome completo."),
    email: z.string().email("E-mail inválido"),
    nameUser: z
      .string()
      .min(3, "O nome de usuário deve ter pelo menos 3 caracteres."),
    password: z.string().min(6, "A senha tem que ter no mínimo 6 caracteres."),
    confirmPassword: z
      .string()
      .min(6, "A senha tem que ter no mínimo 6 caracteres."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não conferem",
    path: ["confirmPassword"],
  });

export function TabsDemo() {
  const { loginFunc, loading, registerFunc } = useAuthContext();

  // Login
  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  // Cadastro
  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  });

  // Enviando dados para o contexto login
  const onLogin = async (data: any) => {
    await loginFunc(data.email, data.password);
  };

  // Enviando dados para o contexto registro
  const onRegister = async (data: any) => {
    await registerFunc(data);
    
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Login</TabsTrigger>
          <TabsTrigger value="password">Registro</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Bem vindo(a)! faça seu login.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
                <div>
                  <Input placeholder="Email" {...loginRegister("email")} />
                  {loginErrors.email && (
                    <p className="text-red-500 text-sm">
                      {loginErrors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    placeholder="Senha"
                    type="password"
                    {...loginRegister("password")}
                  />
                  {loginErrors.password && (
                    <p className="text-red-500 text-sm">
                      {loginErrors.password.message}
                    </p>
                  )}
                  <Link href={"/forgout-pass"}>
                    <Button
                      type="button"
                      className="cursor-pointer text-[15px] text-neutral-500"
                      variant={"link"}
                    >
                      Esqueci minha senha
                    </Button>
                  </Link>
                </div>
                <Button className="cursor-pointer w-full" type="submit">
                  {loading ? (
                    <span className="flex justify-center items-center gap-2">
                      <Spinner /> Carregando...
                    </span>
                  ) : (
                    <span>Login</span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Registro</CardTitle>
              <CardDescription>Crie sua conta.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <form
                onSubmit={handleRegisterSubmit(onRegister)}
                className="space-y-4"
              >
                <div>
                  <Input
                    placeholder="Nome completo"
                    {...registerRegister("name")}
                  />
                  {registerErrors.name && (
                    <p className="text-red-500 text-sm">
                      {registerErrors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    placeholder="Nome de usuário"
                    {...registerRegister("nameUser")}
                  />
                  {registerErrors.nameUser && (
                    <p className="text-red-500 text-sm">
                      {registerErrors.nameUser.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    {...registerRegister("email")}
                  />
                  {registerErrors.email && (
                    <p className="text-red-500 text-sm">
                      {registerErrors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Senha"
                    {...registerRegister("password")}
                  />
                  {registerErrors.password && (
                    <p className="text-red-500 text-sm">
                      {registerErrors.password.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Confirme a senha"
                    {...registerRegister("confirmPassword")}
                  />
                  {registerErrors.confirmPassword && (
                    <p className="text-red-500 text-sm">
                      {registerErrors.confirmPassword.message}
                    </p>
                  )}
                </div>
                <Button className="cursor-pointer w-full" type="submit">
                  {
                    loading ? (
                      <span className="flex justify-center items-center gap-2">
                        <Spinner />
                        Registrando...
                      </span>
                    ) : (
                      <span>Cadastro</span>
                    )
                  }
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
