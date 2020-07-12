import { Sequelize, DataTypes } from 'sequelize';
import VideoModel from './components/videos/model';

const sequelize = new Sequelize(
  'postgres://postgres:password@localhost/youtube'
);
(async () => await sequelize.sync({ alter: true }))();

export const Video = VideoModel(sequelize, DataTypes);
