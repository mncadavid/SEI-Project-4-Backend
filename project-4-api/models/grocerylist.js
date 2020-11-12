'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroceryList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      GroceryList.belongsTo(models.Users, {foreignKey: "id"});
      GroceryList.belongsToMany(models.Food, {
        through: "GroceryListsFood",
        foreignKey: "listId",
        otherKey: "foodId"
      });
    }
  };
  GroceryList.init({
    name: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    notes: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'GroceryList',
  });
  return GroceryList;
};