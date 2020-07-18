export interface Comment {
  content: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  edited: boolean;
}

export interface CreateComment {
  content: string;
}

export enum RateComment {
  Dislike = "dislike",
  Like = "like"
}
