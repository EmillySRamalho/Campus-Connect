import { Response } from "express";
import { CustomRequest } from "../../middlewares/AuthGuard.js";
import { BecomeStudentService } from "./services/StudentAction.service.js";

export async function BecomeStudentController(req: CustomRequest, res: Response){
    try{

        const userId = req.user._id;

        const { avatarUrl, course, socialLinks } = req.body;

        const result = await BecomeStudentService({ userId, avatarUrl, course, socialLinks });

        res.status(201).json({ msg: result.msg, estudante: result.estudante });

    }
    catch(err: any){

        res.status(500).json({
            msg: "Erro interno do servidor",
            error: err.message
        })

    }
}