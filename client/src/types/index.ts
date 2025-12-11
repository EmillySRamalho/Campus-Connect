export interface IUser {
  id?: string;
  name: string;
  name_user: string;
  email: string;
  userId: string;
  role: string;
  bio: string;
}

export type DialogType =
  | "createPost"
  | "editPost"
  | "editResponse"
  | "createComment"
  | "editComment"
  | "createGroup";

export interface IPost {
  id: string;
  title: string;
  content: string;
  author: IUser;
  likes: number;
  createdAt: string;
  liked: boolean;
  saved: boolean;
}


export interface IComment {
  id: string;
  author: IUser;
  Likes: number | null;
  content: string;
  createdAt: string;
}

export interface IResponsesComment {
  id: string;
  author: IUser;
  comment: string;
  content: string;
  createdAt: string;
}

export interface IStudent {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Grupos
type Teacher = {
  departament: string;
  formation: string;
  user: IUser;
};

type Members = {
  id: number;
  student_id: number;
  student: {
    id: number;
    name: string;
    email: string;
    bio: string;
    role: string;
  };
};

export interface IGroup {
  id: string;
  nome: string;
  Description: string;
  teacher_id: number;
  teacher: Teacher;
  user: IUser;
  members: Members[];
}

export interface IChallenge {
  id: number;
  title: string;
  description: string;
  teacher: Teacher;
  type: string;
  xp: number;
  group_id: number;
  teacher_id: number;
}