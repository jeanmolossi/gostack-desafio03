import {
  isAfter,
  isBefore,
  setHours,
  setMinutes,
  setSeconds,
  parseISO,
} from 'date-fns';
import Recipient from '../models/Recipient';
import Deliverie from '../models/Deliverie';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class PacketController {
  async index(req, res) {
    const { deliveryman_id } = req.params;
    const deliveryman = await Deliveryman.findByPk(deliveryman_id);
    if (!deliveryman) {
      return res.status(401).json({ error: 'No packets found here' });
    }

    const delivery = await Deliverie.findAll({
      where: {
        deliveryman_id,
        canceled_at: null,
        end_date: null,
      },
      attributes: ['id', 'product', 'start_date'],
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

    return res.json(delivery);
  }

  async update(req, res) {
    const { delivery_step } = req.headers;
    const { deliveryman_id, id } = req.params;

    /**
     * SE O delivery_step PASSADO NO HEADERS É start FAZ A VERIFICACAO PARA ATUALIZAR
     * A ENCOMENDA COMO RETIRADA E INICIADA E ENTREGA
     * */

    if (delivery_step === 'start') {
      const { start_date } = req.body;

      // VERIFICA SE JA FORAM RETIRADAS 5 ENCOMENDAS NA DATA ATUAL
      // BUSCA DE ENCOMENDAS SEM DATA DE FINALIZACAO
      const deliveries_today = await Deliverie.findAll({
        where: {
          deliveryman_id,
          end_date: null,
          canceled_at: null,
        },
      });
      /**
       * VERIFICA QUANTAS POSSUEM O CAMPO VIRTUAL started_today == true
       * E SOMA 1 NO CONTADOR DE ENCOMENDAS RETIRADAS PELO ENTREGADOR
       */
      let started_today_total = 0;
      deliveries_today.forEach(d => {
        if (d.started_today) started_today_total += 1;
      });
      // LIMITA A 5 ENCOMENDAS POR ENTREGADOR
      if (started_today_total >= 5) {
        return res
          .status(401)
          .json({ erro: 'You can withdraw just 5 deliveries' });
      }

      /**
       * VERIFICA SE A RETIRADA DA ENCOMENDA É EM HORARIO COMERCIAL DAS 08h AS 18h
       */

      const startHour = setSeconds(setMinutes(setHours(new Date(), 7), 59), 59);
      const limitHour = setSeconds(setMinutes(setHours(new Date(), 18), 0), 0);
      const validStart =
        isAfter(parseISO(start_date), startHour) &&
        isBefore(parseISO(start_date), limitHour);
      if (!validStart) {
        return res
          .status(401)
          .json({ error: 'Working hour wrong', startHour, start_date });
      }

      // BUSCA E SELECIONA A ENCOMENDA PARA ATUALIZACAO SE PASSADA NAS VERIFICACOES
      const delivery = await Deliverie.findOne({
        where: {
          deliveryman_id,
          id,
          start_date: null,
          canceled_at: null,
          end_date: null,
        },
      });
      // RETORNA ERRO SE A ENCOMENDA JA POSSUIR DATA DE INICIO OU DE TERMINO OU DE CANCELAMENTO
      if (!delivery) {
        return res
          .status(400)
          .json({ error: 'Delivery not found, something wrong' });
      }

      const { product } = await delivery.update(req.body);
      return res.json({ product, start_date });
    }

    // SE O delivery_step == end A ENCOMENDA DEVE ESTAR EM FINALIZACAO
    if (delivery_step === 'end') {
      const { originalname: name, filename: path } = req.file;

      // SELECIONA A ENCOMENDA PARA VERIFICAR SE JA FOI FINALIZADA OU NAO
      const delivery = await Deliverie.findOne({
        where: {
          id,
          end_date: null,
          canceled_at: null,
        },
      });
      // SE NAO ENCONTRAR A ENCOMENDA SIGNIFICA QUE NAO EXISTE OU JA FOI FINALIZADA
      if (!delivery) {
        return res
          .status(400)
          .json({ error: 'Delivery can not end or is not valid delivery' });
      }
      // AO ENCONTRAR A ENCOMENDA VERIFICA SE FOI INICIADA NO DIA ATUAL
      if (delivery && !delivery.started_today) {
        return res
          .status(401)
          .json({ error: 'You can end deliveries opened today' });
      }

      // DETERMINA QUE A DATA DA REQUISICAO É A DATA DE FINALIZACAO
      const end_date = new Date();
      const { start_date } = delivery;
      // VERIFICA SE A DATA DE FINALIZACAO É DEPOIS DA DATA DE INICIO
      const validEndsDate = isAfter(end_date, start_date);
      if (!validEndsDate) {
        return res
          .status(401)
          .json({ error: 'To ends a delivery insert a post date' });
      }
      // AO PASSAR AS VERIFICACOES CRIA A IMAGEM DA ASSINATURA
      const signature = await File.create({ name, path });
      const signature_id = signature.id;
      if (!signature_id) {
        return res
          .status(400)
          .json({ error: 'Please, print a signature from recipient' });
      }
      // CONSTROI OS DADOS PARA ATUALIZAR AO FINALIZAR ENCOMENDA
      const data = {
        id,
        deliveryman_id,
        signature_id,
        end_date,
      };
      await delivery.update(data);
      return res.json(delivery);
    }
    // SE NAO FOI PASSADO O HEADER delivery_step TRANSMITE UM ERRO DE BAD REQUEST
    return res.status(400).json({
      error: 'You must provide a delivery step to update this delivery',
      delivery_step,
    });
  }
}

export default new PacketController();
