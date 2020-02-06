module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('recipients', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      rua: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      numero: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      complemento: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      estado: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cidade: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cep: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('recipients');
  },
};
