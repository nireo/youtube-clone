import { Sequelize } from 'sequelize';
import VideoModel from './components/videos/model';
import UserModel from './components/users/model';
import CommentModel from './components/comments/model';

const sequelize = new Sequelize(
  'postgres://postgres:password@localhost/youtube'
);
(async () => await sequelize.sync({ alter: true }))();

export const Video = VideoModel(sequelize);
export const User = UserModel(sequelize);
export const Comment = CommentModel(sequelize);

// associations
Video.belongsTo(User, { foreignKey: 'userId' });
Video.hasMany(Comment, { foreignKey: 'videoId' });
User.hasMany(Comment, { foreignKey: 'userId' });
