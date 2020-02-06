import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      rua: Yup.string().required(),
      numero: Yup.number().required(),
      complemento: Yup.string(),
      estado: Yup.string().required(),
      cidade: Yup.string().required(),
      cep: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Fill up all fields' });
    }

    const recipient = await Recipient.findOne({
      where: { name: req.body.name },
    });
    if (await recipient) {
      return res.status(400).json({ error: 'Recipient already exists' });
    }

    const recip = await Recipient.create(req.body);

    return res.json(recip);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      name: Yup.string(),
      rua: Yup.string(),
      numero: Yup.number(),
      complemento: Yup.string(),
      estado: Yup.string(),
      cidade: Yup.string(),
      cep: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fail' });
    }

    const recipient = await Recipient.findByPk(req.body.id);
    if (!(await recipient)) {
      return res.status(400).json({ error: 'Recipient not found' });
    }

    const recip = await recipient.update(req.body);

    return res.json(recip);
  }
}
export default new RecipientController();
