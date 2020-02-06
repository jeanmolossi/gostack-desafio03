import Sequelize, { Model } from 'sequelize';

class Recipient extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        rua: Sequelize.STRING,
        numero: Sequelize.INTEGER,
        complemento: Sequelize.STRING,
        estado: Sequelize.STRING,
        cidade: Sequelize.STRING,
        cep: Sequelize.STRING,
      },
      { sequelize }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'id', as: 'User' });
  }
}

export default Recipient;
