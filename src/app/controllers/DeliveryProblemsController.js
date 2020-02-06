import Deliverie from '../models/Deliverie';
import Deliveryman from '../models/Deliveryman';
import DeliveryProblem from '../models/DeliveryProblem';

import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

class DeliveryProblemsController {
  async index(req, res) {
    const { delivery_id } = req.params;
    const problem = await DeliveryProblem.findAll({
      where: { delivery_id },
    });
    if (!problem) {
      return res.status(400).json({ error: 'That delivery has not problems' });
    }
    return res.json(problem);
  }

  async store(req, res) {
    const { description, deliveryman_id } = req.body;
    const { delivery_id } = req.params;

    const deliveryExists = await Deliverie.findOne({
      where: {
        id: delivery_id,
        deliveryman_id,
      },
    });
    if (!deliveryExists) {
      return res
        .status(400)
        .json({ error: 'Delivery informations do not match' });
    }

    const deliveryProblemBody = {
      description,
      delivery_id,
    };

    const problem = await DeliveryProblem.create(deliveryProblemBody);

    return res.json(problem);
  }

  async delete(req, res) {
    const { id } = req.params;
    const { delivery_id, description } = await DeliveryProblem.findByPk(id);
    if (!delivery_id) {
      return res.status(400).json({ error: 'That delivery has no problems' });
    }
    const deliveryCancel = await Deliverie.findOne({
      where: { id: delivery_id, canceled_at: null },
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
      ],
    });
    if (!deliveryCancel) {
      return res
        .status(400)
        .json({ error: 'Impossible to cancel this delivery' });
    }
    const canceled = await deliveryCancel.update({ canceled_at: new Date() });

    Queue.add(CancellationMail.key, { canceled, description });

    return res.json(canceled);
  }
}

export default new DeliveryProblemsController();
