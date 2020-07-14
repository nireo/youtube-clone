import { Sequelize, DataTypes } from 'sequelize';

const CommentModel = (sequelize: Sequelize) => {
  return sequelize.define('Comment', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    edited: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
};

export default CommentModel;
