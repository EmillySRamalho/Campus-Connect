import { authGuard } from "../../middlewares/AuthGuard.js";
import { AuthRole } from "../../middlewares/AuthRole.js";
import {
  CreatePostController,
  DeletePostController,
  EditPostController,
  LikePostController,
  ListAuthorPostsController,
  ListSavePostsController,
  SavePostController,
} from "./post.controller.js";
import { ListAllPostController } from "./post.controller.js";
import { Router } from "express";
const postRouter = Router();

postRouter.post(
  "/post",
  authGuard,
  AuthRole("professor"),
  CreatePostController
);
postRouter.get("/post", authGuard, ListAllPostController);
postRouter.delete("/post/:id", authGuard, DeletePostController);
postRouter.get("/post/author", authGuard, ListAuthorPostsController);
postRouter.post("/post/:id", authGuard, SavePostController);
postRouter.get("/post/saveds", authGuard, ListSavePostsController);
postRouter.patch("/post/:id", authGuard, EditPostController);
postRouter.post("/post/like/:id", authGuard, LikePostController);

export default postRouter;
