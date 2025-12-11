import { Types } from "mongoose";

export type TUser = {
  _id?: string;
  name: string;
  email: string;
  password: string;
  postsSaveds?: Types.ObjectId[];
  nameUser: string;
  biography?: string;
  role?: "admin" | "professor" | "estudante" | "user";
};
