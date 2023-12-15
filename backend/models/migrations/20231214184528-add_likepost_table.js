'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('likepost', {
      user_id: {
        type: Sequelize.STRING,
        references: {
          model: 'user',
          key: 'id'
        },
        primaryKey: true,
        onDelete: 'CASCADE'
      },
      post_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'post',
          key: 'id'
        },
        primaryKey: true,
        onDelete: 'CASCADE'

      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('likepost')
  }
};
