import { Sequelize, DataTypes } from 'sequelize';

const VideoLikeModel = (sequelize: Sequelize) => {
  return sequelize.define('VideoLike', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    videoId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    like: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  });
};

export default VideoLikeModel;
