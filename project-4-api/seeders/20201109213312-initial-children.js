'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Children', [
      {
        name: 'Luke',
        age: 0.5
      },
      {
        name: "Milo",
        age: 4
      },
      {
        name: 'Sam',
        age: 2
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Children', null, {});
  }
};
