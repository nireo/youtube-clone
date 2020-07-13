import { Sequelize, DataTypes } from 'sequelize';

const UserModel = (sequelize: Sequelize) => {
  return sequelize.define('User', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },

    // path to the avatar file in the avatars directory
    avatar: {
      type: DataTypes.STRING,
    },
  });
};

export default UserModel;
