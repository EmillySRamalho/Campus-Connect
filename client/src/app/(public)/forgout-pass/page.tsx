"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import * as z from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const sendLinkSchema = z.object({
    email: z.string().email("Insira um E-mail válido.")
})

export default function ForgoutPass() {

    const {
        register: sendLinkRegister,
        handleSubmit: sendLinkSubmit,
        formState: { errors: sendLinkErrors }
    } = useForm<z.infer<typeof sendLinkSchema>>({
        resolver: zodResolver(sendLinkSchema)
    })

    const sendSubmit = (data: any) => {
        console.log(data)
    }

    return (
        <div className="h-screen flex flex-col justify-center items-center">
            <form onSubmit={sendLinkSubmit(sendSubmit)} className="space-y-3">
                <h3>Insira seu E-mail, enviaremos um link de redefinição:</h3>
                <div>
                    <Input
                        placeholder="Seu E-mail"
                        type="email"
                        {...sendLinkRegister("email")}
                    />
                    {sendLinkErrors.email && (
                    <p className="text-red-500 text-sm">
                      {sendLinkErrors.email.message}
                    </p>
                  )}
                </div>

                <Button className="cursor-pointer" type="submit">Enviar</Button>
            </form>
        </div>
    )
}