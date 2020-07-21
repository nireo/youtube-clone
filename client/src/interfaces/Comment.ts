export interface Comment {
  content: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  edited: boolean;
  likes: number;
  dislikes: number;
}

export interface CreateComment {
  content: string;
}

export enum RateComment {
  Dislike = "dislike",
  Like = "like"
}
