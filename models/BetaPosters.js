const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class BetaPosters extends Model { }

BetaPosters.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    chatId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    chatMessage: {
      type: DataTypes.JSON,
      allowNull: true
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    subscribers: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    notified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'BetaPosters'
  }
);

module.exports = BetaPosters;