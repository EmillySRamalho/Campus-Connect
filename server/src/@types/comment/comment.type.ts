import { Types } from "mongoose";

export type TComment = {
    _id?: string;
    author: Types.ObjectId;
    post: Types.ObjectId;
    content: string;
    responses?: Types.ObjectId[];
    likes?: Types.ObjectId[];
    liked?: boolean;
    createdAt?: Date;
}
