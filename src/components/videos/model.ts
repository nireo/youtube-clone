import { Sequelize } from 'sequelize';

const VideoModel = (sequelize: Sequelize, DataTypes: any) => {
  return sequelize.define('Video', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};

export default VideoModel;
