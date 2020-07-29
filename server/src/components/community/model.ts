import { Sequelize, DataTypes } from "sequelize";

const CommunityModel = (sequelize: Sequelize) => {
  return sequelize.define("Community", {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false
    },

    // don't include dislikes, since youtube doesn't show dislikes on community postings only likes,
    // but when someone dislikes a community post the likes go down by 1. And lastly if the like amount is x < 0, then
    // only display a zero.
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  });
};

export default CommunityModel;
