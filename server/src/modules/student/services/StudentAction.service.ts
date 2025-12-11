import { Types } from "mongoose";
import { TSocialLinks } from "../../../@types/teacher/teacher.type.js";
import { UserRepository } from "../../users/user.repository.js";
import { StudentRepository } from "../student.repository.js";

type TBecomeStudent = {
  userId: string;
  avatarUrl: string;
  course: string;
  socialLinks?: TSocialLinks;
};

export async function BecomeStudentService({ userId, avatarUrl, course, socialLinks }: TBecomeStudent){

    const user = await UserRepository.findById(userId);

    if(!user) throw new Error("Usuário não encontrado.");

    if(user.role === "estudante") throw new Error("O usuário já é um estudante.");

    await UserRepository.update(userId, { role: "estudante" });

    const userObjectId = new Types.ObjectId(user._id);

    const data = {
        user: userObjectId,
        avatarUrl,
        course,
        socialLinks
    }

    const newStudent = await StudentRepository.create(data);
    
      return {
        msg: "Estudante criado com sucesso.",
        estudante: newStudent,
      };

}