import { Sequelize, DataTypes } from "sequelize";

const UserModel = (sequelize: Sequelize) => {
  return sequelize.define("User", {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    subscribers: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },

    // path to the avatar file in the avatars directory
    avatar: {
      type: DataTypes.STRING
    }
  });
};

export default UserModel;
