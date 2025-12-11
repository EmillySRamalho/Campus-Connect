import { authGuard } from "../../middlewares/AuthGuard.js";
import { BecomeStudentController } from "./student.controller.js";
import { Router } from "express";
const studentRouter = Router();

studentRouter.post("/student", authGuard, BecomeStudentController);


export default studentRouter;