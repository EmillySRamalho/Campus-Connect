import { Router } from "express";
import userRouter from "../modules/users/user.routes.js";
import teacherRouter from "../modules/teacher/teacher.routes.js";
import postRouter from "../modules/posts/post.routes.js";
import commentRouter from "../modules/comment/comment.routes.js";
import responseRouter from "../modules/responses/response.routes.js";
import groupRouter from "../modules/group/group.routes.js";
import challengeRouter from "../modules/challenge/challenge.routes.js";
import studentRouter from "../modules/student/student.routes.js";
const router = Router();

router.use(userRouter);
router.use(teacherRouter);
router.use(postRouter);
router.use(commentRouter);
router.use(responseRouter);
router.use(groupRouter);
router.use(challengeRouter);
router.use(studentRouter);

export default router;