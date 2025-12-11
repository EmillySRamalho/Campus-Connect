import { Types } from "mongoose";

export type TSocialLinks = {
    github?: string,
    linkedin?: string,
    lattes?: string,
}

export type TStudent = {
    _id?: string;
    user: Types.ObjectId;
    course: string;
    avatarUrl: string;
    xp?: number;
    socialLinks: TSocialLinks | undefined
}