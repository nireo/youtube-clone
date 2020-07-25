import { Sequelize, DataTypes } from "sequelize";

const NotificationModel = (sequelize: Sequelize) => {
  return sequelize.define("Notification", {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });
};

export default NotificationModel;
