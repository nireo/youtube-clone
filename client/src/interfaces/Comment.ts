import { User } from "./User";

export interface Comment {
  content: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  edited: boolean;
  likes: number;
  dislikes: number;
  User: User;
}

export interface CreateComment {
  content: string;
}

export enum RateComment {
  Dislike = "dislike",
  Like = "like"
}
