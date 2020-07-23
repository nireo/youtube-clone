import { Sequelize, DataTypes } from "sequelize";

const PlaylistModel = (sequelize: Sequelize) => {
  return sequelize.define("Playlist", {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      defaultValue: "No description provided"
    },
    videos: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    // youtube places one of the playlist's video's thumbnails as the thumbnail of playlist so this is that
    videoThumbnail: {
      type: DataTypes.STRING,
      defaultValue: ""
    }
  });
};

export default PlaylistModel;
