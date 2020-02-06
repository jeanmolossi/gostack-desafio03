// IMPORTACOES DE MODULOS NECESSÁRIOS
import { Router } from 'express';
import multer from 'multer';

// IMPORTACOES DE CONFIGS
import multerConfig from './config/multer';

// IMPORTACOES DE CONTROLLERS
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import DeliverieController from './app/controllers/DeliverieController';
import PacketController from './app/controllers/PacketController';
import DeliveryProblemsController from './app/controllers/DeliveryProblemsController';

// IMPORTACAO DE MIDDLEWARES
import authMiddleware from './app/middleware/auth';

// INSTANCIA DE ROTAS
const routes = new Router();
const upload = multer(multerConfig);

// ROTAS
routes.post('/sessions', SessionController.store); // ROTA DE CADASTRO DE SESSAO
routes.get('/deliveryman/:deliveryman_id/deliveries', PacketController.index); // ROTA DE VISUALIZACAO DE ENCOMENDAS

routes.put(
  '/deliveryman/:deliveryman_id/updatePacket/:id',
  PacketController.update
); // ROTA DE ATUALIZACAO DE ENCOMENDAS - RETIRADA PARA ENTREGA

routes.put(
  '/deliveryman/:deliveryman_id/endDelivery/:id',
  upload.single('file'),
  PacketController.update
); // ROTA DE ATUALIZACAO DE ENCOMENDAS - FINALIZAR ENTREGA

routes.post(
  '/delivery/:delivery_id/problems',
  DeliveryProblemsController.store
); // ROTA DE LISTAGEM DE PROBLEMAS DE ENTREGA

routes.use(authMiddleware); // MIDDLEWARE DE AUTENTICACAO

routes.get('/deliverymen', DeliverymanController.index); // ROTA DE LISTAGEM DE ENTREGADORES
routes.get('/deliveries', DeliverieController.index); // ROTA DE LISTAGEM DE ENTREGAS
routes.get('/delivery/:delivery_id/problems', DeliveryProblemsController.index); // ROTA DE LISTAGEM DE PROBLEMAS DE ENTREGA
routes.delete(
  '/problem/:id/cancel-delivery',
  DeliveryProblemsController.delete
); // ROTA DE LISTAGEM DE PROBLEMAS DE ENTREGA

routes.post('/users', UserController.store); // ROTA DE CADASTRO DE USUARIO
routes.post('/recipients', RecipientController.store); // ROTA DE CADASTRO DE DESTINATARIO
routes.post('/files', upload.single('file'), FileController.store); // ROTA DE UPLOAD DE AVATAR
routes.post('/deliverymen', DeliverymanController.store); // ROTA DE CADASTRO DE ENTREGADORES
routes.post('/deliveries', DeliverieController.store); // ROTA DE CADASTRO DE ENTREGAS

routes.put('/users', UserController.update); // ROTA DE ATUALIZACAO DE USUARIO
routes.put('/recipients', RecipientController.update); // ROTA DE ATUALIZACAO DE DESTINATARIO
routes.put('/deliverymen', DeliverymanController.update); // ROTA DE CADASTRO DE ENTREGADORES
routes.put('/deliveries/:id', DeliverieController.update); // ROTA DE ATUALIZACAO DE ENTREGAS

routes.delete('/deliverymen/:id', DeliverymanController.delete); // ROTA DE REMOCAO DE ENTREGADORES
routes.delete('/deliveries/:id', DeliverieController.delete); // ROTA DE REMOCAO DE ENTREGAS

export default routes;
