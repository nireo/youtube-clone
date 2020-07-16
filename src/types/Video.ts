export interface VideoAttributes {
  id: string;
  title: string;
  description?: string;
  fileExtension: string;
  likes: number;
  dislikes: number;
}

export interface VideoLikeAttributes {
  id: string;
  userId: string;
  videoId: string;
  like: boolean;
}
