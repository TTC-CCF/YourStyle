'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('user', 'username', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.removeConstraint("user", "username");
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('user', 'username', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addConstraint("user", {
      fields: ["username"],
      type: "unique",
      name: "username",
    });
  }
};
