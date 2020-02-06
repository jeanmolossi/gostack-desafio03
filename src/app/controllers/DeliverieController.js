import { parseISO, isBefore } from 'date-fns';

import Deliverie from '../models/Deliverie';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';

import NewDeliveryMail from '../jobs/NewDeliveryMail';
import Queue from '../../lib/Queue';

class DeliverieController {
  async index(req, res) {
    const deliveries = await Deliverie.findAll({
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'name',
            'cidade',
            'estado',
            'rua',
            'numero',
            'complemento',
            'cep',
          ],
        },
      ],
    });
    return res.json(deliveries);
  }

  async store(req, res) {
    // VERIFICACOES DE EXISTENCIA
    const { recipient_id, deliveryman_id } = req.body;
    const isRecipient = await Recipient.findByPk(recipient_id);
    if (!isRecipient)
      return res.status(401).json({ error: 'Insert a valid recipient id' });

    const isDeliveryman = await Deliveryman.findByPk(deliveryman_id);
    if (!isDeliveryman)
      return res.status(401).json({ error: 'Insert a valid deliveryman id' });

    const newDelivery = await Deliverie.create(req.body);
    const { product } = req.body;

    Queue.add(NewDeliveryMail.key, { isRecipient, isDeliveryman, product });

    return res.json(newDelivery);
  }

  async update(req, res) {
    const { id } = req.params;
    const { end_date } = req.body;

    const endDate = parseISO(end_date);
    if (isBefore(endDate, new Date())) {
      return res
        .status(401)
        .json({ error: 'Past dates are not permitted', endDate });
    }

    const delivery = await Deliverie.findByPk(id);

    await delivery.update(req.body);

    return res.json(delivery);
  }

  async delete(req, res) {
    const { id } = req.params;
    const delivery = await Deliverie.findByPk(id);

    delivery.destroy();
    return res.json(delivery);
  }
}

export default new DeliverieController();
