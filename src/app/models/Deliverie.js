import { isAfter, startOfDay } from 'date-fns';
import Sequelize, { Model } from 'sequelize';

class Deliverie extends Model {
  static init(sequelize) {
    super.init(
      {
        product: Sequelize.STRING,
        canceled_at: Sequelize.DATE,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        started_today: {
          type: Sequelize.VIRTUAL,
          get() {
            if (this.start_date !== null)
              return isAfter(this.start_date, startOfDay(new Date()));
            return false;
          },
        },
        canceled: {
          type: Sequelize.VIRTUAL,
          get() {
            return !!this.canceled_at;
          },
        },
      },
      { sequelize }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, {
      foreignKey: 'signature_id',
      as: 'signature',
    });
    this.belongsTo(models.Recipient, {
      foreignKey: 'recipient_id',
      as: 'recipient',
    });
    this.belongsTo(models.Deliveryman, {
      foreignKey: 'deliveryman_id',
      as: 'deliveryman',
    });
  }
}

export default Deliverie;
