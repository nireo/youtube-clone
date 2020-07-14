import { Sequelize, DataTypes } from 'sequelize';

const VideoModel = (sequelize: Sequelize) => {
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
    description: {
      type: DataTypes.STRING,
    },
    fileExtension: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};

export default VideoModel;
