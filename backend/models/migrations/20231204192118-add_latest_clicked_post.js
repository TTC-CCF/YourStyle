'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('user', 'latest_clicked_posts', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('user', 'latest_clicked_posts');
  }
};
