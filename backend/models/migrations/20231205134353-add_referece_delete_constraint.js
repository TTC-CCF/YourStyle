'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('post', 'post_ibfk_1');
    await queryInterface.changeColumn('post', 'user_id', {
      type: Sequelize.STRING(255),
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.removeConstraint('tag', 'tag_ibfk_1');
    await queryInterface.changeColumn('tag', 'post_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'post',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.removeConstraint('user_post_score', 'user_post_score_ibfk_1');
    await queryInterface.removeConstraint('user_post_score', 'user_post_score_ibfk_2');
    await queryInterface.changeColumn('user_post_score', 'post_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'post',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.changeColumn('user_post_score', 'user_id', {
      type: Sequelize.STRING(255),
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('post', 'post_ibfk_1');
    await queryInterface.changeColumn('post', 'user_id', {
      type: Sequelize.STRING(255),
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      },
    });

    await queryInterface.removeConstraint('tag', 'tag_ibfk_1');
    await queryInterface.changeColumn('tag', 'post_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'post',
        key: 'id',
      },
    });

    
    await queryInterface.removeConstraint('user_post_score', 'user_post_score_ibfk_1');
    await queryInterface.removeConstraint('user_post_score', 'user_post_score_ibfk_2');

    await queryInterface.changeColumn('user_post_score', 'post_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'post',
        key: 'id',
      },
    });
    

    await queryInterface.changeColumn('user_post_score', 'user_id', {
      type: Sequelize.STRING(255),
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      },
    });
    
  }
};
