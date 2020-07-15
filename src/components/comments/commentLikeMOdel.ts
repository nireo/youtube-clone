import { Sequelize, DataTypes } from 'sequelize';

const CommentLikeModel = (sequelize: Sequelize) => {
  return sequelize.define('CommentLike', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    commentId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};

export default CommentLikeModel;
