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
    post_text: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    calledAt: {
      type: DataTypes.STRING,
      allowNull: false
      
    },
    
  },
  {
    
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'Signals'
  }
);

module.exports = Signals;
