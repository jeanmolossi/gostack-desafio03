import Mail from '../../lib/Mail';

class NewDeliveryMail {
  get key() {
    return 'NewDeliveryMail';
  }

  async handle({ data }) {
    const { isDeliveryman, isRecipient, product } = data;
    await Mail.sendMail({
      to: `${isDeliveryman.name} <${isDeliveryman.email}>`,
      subject: 'Nova encomenda para entrega',
      text: `Você possui uma nova encomenda que já está disponível para retirada.\n
      Produto: ${product}\n
      Destinatario: ${isRecipient.name}\n${isRecipient.cidade} - ${isRecipient.rua}, numero ${isRecipient.numero} - ${isRecipient.cep}`,
    });
  }
}

export default new NewDeliveryMail();
