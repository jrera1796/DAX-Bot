const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
//const bcrypt = require('bcrypt');

class Users extends Model { }

Users.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    lastname: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    chat_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    is_subscribed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    paid_subscriber: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'subscriber',
    },
    joined_on: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    last_interaction: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  },
  {
    // Commented out hooks and bcrypt until needed
    // hooks: {
    //   async beforeCreate(newUserData) {
    //     newUserData.password = await bcrypt.hash(newUserData.password, 10);
    //     return newUserData;
    //   },
    //   async beforeUpdate(updatedUserData) {
    //     updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
    //     return updatedUserData;
    //   },
    // },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'Users',
  }
);

module.exports = Users;