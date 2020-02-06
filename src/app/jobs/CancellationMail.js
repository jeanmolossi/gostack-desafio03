import Mail from '../../lib/Mail';

class CancellarionMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { canceled, description } = data;
    await Mail.sendMail({
      to: `${canceled.deliveryman.name} <${canceled.deliveryman.email}>`,
      subject: 'Encomenda cancelada',
      text: `Houve o cancelamento de uma encomenda.\n
      Motivo: ${description}\n
      Produto: ${canceled.product}\n`,
    });
  }
}

export default new CancellarionMail();
