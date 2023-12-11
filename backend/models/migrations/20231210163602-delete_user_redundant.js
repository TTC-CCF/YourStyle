'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('user', 'username');
    await queryInterface.removeColumn('user', 'email');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('user', 'username', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
    await queryInterface.addColumn('user', 'email', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
  }
};
