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

    description: {
      type: DataTypes.STRING,
      defaultValue: "No description provided"
    },

    // path to the avatar file in the avatars directory
    avatar: {
      type: DataTypes.STRING
    },

    // both are a list of strings which store video ids
    watchLater: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    history: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    }
  });
};

export default UserModel;
