// import * as Yup from 'yup';

import Deliveryman from '../models/Deliveryman';

class DeliverymanController {
  async index(req, res) {
    const deliverymens = await Deliveryman.findAll();
    return res.json(deliverymens);
  }

  async store(req, res) {
    const { email } = req.body;
    const deliverymanExists = await Deliveryman.findOne({
      where: {
        email,
      },
    });

    if (deliverymanExists) {
      return res.status(401).json({ error: 'Deliveryman already exists' });
    }

    const deliveryman = await Deliveryman.create(req.body);
    return res.json(deliveryman);
  }

  async update(req, res) {
    const { id } = req.body;

    if (!id)
      return res
        .status(400)
        .json({ error: 'An deliveryman id must be provided' });

    const deliverymanExists = await Deliveryman.findOne({
      where: { id },
    });
    if (!deliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman is not exist' });
    }

    const { name, avatar_id, email } = await deliverymanExists.update(req.body);
    return res.json({
      id,
      name,
      avatar_id,
      email,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    if (!id)
      return res
        .status(400)
        .json({ error: 'An deliveryman id must be provided' });

    const deliveryman = await Deliveryman.findOne({
      where: { id },
    });

    if (!deliveryman)
      res
        .status(400)
        .json({ error: 'A valid deliveryman id must be provided' });

    await deliveryman.destroy();

    return res.json({ deleted: true, deliveryman });
  }
}

export default new DeliverymanController();
