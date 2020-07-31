import { User } from "./User";

export interface Community {
  content: string;
  id: string;
  edited: boolean;
  likes: number;
  createdAt: string;
  updatedAt: string;
  User: User;
}

export interface CommunityComment {
  User: User;
  content: string;
  communityPostId: string;
  createdAt: string;
  updatedAt: string;
  id: string;
}
