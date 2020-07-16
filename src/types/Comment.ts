import sequelize from "sequelize";

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

export class Comment extends sequelize.Model<CommentAttributes>
  implements CommentAttributes {
  public id!: string;
  public content!: string;
  public edited!: boolean;
  public likes!: number;
  public dislikes!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
