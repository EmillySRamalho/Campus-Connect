import { TStudent } from "../../@types/student/student.type.js"
import studentModel from "./student.model.js"

export const StudentRepository = {

    create(data: TStudent){
        return studentModel.create(data);
    }

}