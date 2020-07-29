import { Sequelize, DataTypes } from "sequelize";

const CommunityLikeModel = (sequelize: Sequelize) => {
  return sequelize.define("CommunityLike", {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    likedPostId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    like: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    edited: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });
};

export default CommunityLikeModel;
