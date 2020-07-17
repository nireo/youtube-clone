import sequelize from 'sequelize';

export interface VideoAttributes {
  id: string;
  title: string;
  description: string | null;
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

export class Video extends sequelize.Model<VideoAttributes>
  implements VideoAttributes {
  public id!: string;
  public title!: string;
  public description!: string | null;
  public fileExtension!: string;
  public likes!: number;
  public dislikes!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
