import { Sequelize, DataTypes } from 'sequelize';

const SubscriptionModel = (sequelize: Sequelize) => {
  return sequelize.define('Subscription', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    subscriberId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subscribedId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};

export default SubscriptionModel;
