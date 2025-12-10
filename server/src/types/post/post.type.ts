import { Types } from "mongoose";

type TResponse = {
  _id?: string;
  author: Types.ObjectId | string;
  content: string;
};

type TComment = {
  _id?: string;
  author: Types.ObjectId | string;
  content: string;
  responses?: TResponse[];
};

export type TAuthor = {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
};

export type TPost = {
  _id?: Types.ObjectId;
  title: string;
  author: TAuthor | Types.ObjectId;
  content: string;
  tags?: string[];
  likes?: Types.ObjectId[];
  comments?: TComment[];
  createdAt: Date;
};
