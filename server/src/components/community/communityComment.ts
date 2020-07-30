import { Sequelize, DataTypes } from "sequelize";

const CommunityCommentModel = (sequelize: Sequelize) => {
  return sequelize.define("CommunityComment", {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    communityPostId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
};

export default CommunityCommentModel;
