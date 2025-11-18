export interface IUser {
  id: number;
  name: string;
  name_user: string;
  email: string;
  role: string;
}

interface Like {
  ID: number;
  UserId: number;
  PostId: number;
}

export interface IPost {
  id: number;
  title: string;
  content: string;
  created_at: string;
  user: IUser;
  likes_count: number;
  Likes: Like[];
  liked_by_me: boolean;
}

export interface IComment {
  ID: number;
  User: IUser;
  Likes: number | null;
  content: string;
  created_at: string;
}
