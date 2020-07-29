import { User } from "./User";

export interface Community {
  content: string;
  id: string;
  edited: boolean;
  likes: number;
  User: User;
}
