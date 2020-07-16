import sequelize from 'sequelize';

export interface CommentAttributes {
  id: string;
  content: string;
  edited: boolean;
  likes: number;
  dislikes: number;
}

export interface CommentLikeAttributes {
  id: string;
  userId: string;
  commentId: string;
  like: boolean;
}
