import { Sequelize } from 'sequelize';
import VideoModel from './components/videos/model';
import UserModel from './components/users/model';
import CommentModel from './components/comments/model';

let database = 'youtube';
if (process.env.NODE_ENV === 'test') {
  database = 'youtubetest';
}

export const sequelize = new Sequelize(database, 'postgres', 'password', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});
(async () => await sequelize.sync({ alter: true }))();

export const Video = VideoModel(sequelize);
export const User = UserModel(sequelize);
export const Comment = CommentModel(sequelize);

// associations
Video.belongsTo(User, { foreignKey: 'userId' });
Video.hasMany(Comment, { foreignKey: 'videoId' });
User.hasMany(Comment, { foreignKey: 'userId' });
