'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('user', {
      fields: ['latest_clicked_posts'],
      type: 'foreign key',
      name: 'user_ibfk_1',
      references: {
        table: 'post',
        field: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('user', 'user_ibfk_1');
  }
};
