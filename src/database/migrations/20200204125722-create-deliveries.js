module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('deliveries', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      recipient_id: {
        type: Sequelize.INTEGER,
        references: { model: 'recipients', key: 'id' },
        allowNull: true,
      },
      deliveryman_id: {
        type: Sequelize.INTEGER,
        references: { model: 'deliverymans', key: 'id' },
        allowNull: true,
      },
      signature_id: {
        type: Sequelize.INTEGER,
        references: { model: 'files', key: 'id' },
        allowNull: true,
      },
      product: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      canceled_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      end_date: {
        type: Sequelize.DATE,
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
    return queryInterface.dropTable('deliveries');
  },
};
