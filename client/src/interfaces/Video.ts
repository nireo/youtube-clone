import { User } from "./User";

export interface UpdateVideo {
  title: string;
  description?: string;
}

export enum RateActions {
  Dislike = "dislike",
  Like = "like"
}

export interface Video {
  id: string;
  title: string;
  description: string;
  fileExtension: string;
  likes: number;
  dislikes: number;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  views: number;
  privacyLevel: number;
  User?: User;
}
