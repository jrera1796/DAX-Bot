const { Model, DataTypes, DATE } = require('sequelize');
const sequelize = require('../config/connection');

class Signals extends Model {}

Signals.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    exchange: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    ticker: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
      
    },
    interval: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
      
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true
      
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
      
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
    modelName: 'Signals'
  }
);

module.exports = Signals;
