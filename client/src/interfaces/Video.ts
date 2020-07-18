export interface UpdateVideo {
  title: string;
  description?: string;
}

export enum RateActions {
  Dislike = "dislike",
  Like = "like"
}
