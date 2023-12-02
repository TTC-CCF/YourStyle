'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('user', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      username: {
          type: Sequelize.STRING,
          allowNull: false,
      },
      email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
      },
      role: {
          type: Sequelize.STRING,
          defaultValue: "user",
          allowNull: false,
      },
    });
    await queryInterface.createTable('post', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
          type: Sequelize.STRING,
      },
      description: {
          type: Sequelize.STRING(1000),
      },
      user_id: {
          type: Sequelize.STRING,
          allowNull: false,
          references: {
              model: 'user',
              key: 'id',
          }
      },
      image_url: {
          type: Sequelize.STRING,
      },
      likes: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
          allowNull: false,
      },
      shares: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
          allowNull: false,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
    await queryInterface.createTable('tag', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      post_id: {
        type: Sequelize.INTEGER,
      },
      name: Sequelize.STRING,
    });
    await queryInterface.createTable('user_post_score', {
      user_id: {
        type: Sequelize.STRING,
        primaryKey: true,
        references: {
            model: 'user',
            key: 'id'
        }
      },
      post_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          references: {
              model: 'post',
              key: 'id'
          }
      },
      score: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
      },
    });
    await queryInterface.createTable('tag', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
          type: Sequelize.STRING
      },
      post_id: {
          type: Sequelize.INTEGER,
          references: {
              model: 'post',
              key: 'id'
          }
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('tag');
    await queryInterface.dropTable('user_post_score');
    await queryInterface.dropTable('post');
    await queryInterface.dropTable('user');
  }
};
