const express = require('express');
const router = express.Router();
const verifyToken = require('./src/middlewares/authMiddleware');

const usersController = require('./src/controllers/usersController');
const statusController = require('./src/controllers/statusController');
const predioController = require('./src/controllers/predioAirbnbController');
const apartamentosAirbnbController = require('./src/controllers/apartamentosAirbnbController');
const reservasAirbnbController = require('./src/controllers/reservasAirbnbController');


// User routes
router.get('/users', verifyToken, usersController.getAllUsers); // Listar todos os usuários
router.get('/users/:id', verifyToken, usersController.getUser); // Obter um usuário por ID
router.post('/login', usersController.loginUser); // Login de usuário
router.post('/users', usersController.createUser); // Criar um novo usuário
router.post('/users/batch', verifyToken, usersController.createUsersBatch); // Inserção de usuários em lote
router.put('/users/:id', verifyToken, usersController.updateUser); // Atualizar usuário por ID
router.get('/users/building/:building_id', verifyToken, usersController.getUsersByBuilding); // Obter usuários por prédio
router.delete('/users/:id', verifyToken, usersController.deleteUser); // Excluir usuário por ID

// Definir a rota para o status do servidor
router.get('/status', statusController.getServerStatus);

// Rotas para predioAirbnb
router.get('/predios', verifyToken, predioController.getAllPredios); // Listar todos os prédios
router.get('/predios/:id', verifyToken, predioController.getPredioById); // Obter um prédio por ID
router.post('/predios', verifyToken, predioController.createPredio); // Criar um novo prédio
router.put('/predios/:id', verifyToken, predioController.updatePredio); // Atualizar um prédio por ID
router.delete('/predios/:id', verifyToken, predioController.deletePredio); // Deletar um prédio por ID

// Rotas para apartamentosAirbnb
router.get('/apartamentos-airbnb', verifyToken, apartamentosAirbnbController.getAllApartamentos); // Listar todos os apartamentos
router.get('/apartamentos-airbnb/:id', verifyToken, apartamentosAirbnbController.getApartamentoById); // Obter um apartamento por ID
router.post('/apartamentos-airbnb', verifyToken, apartamentosAirbnbController.createApartamento); // Criar um novo apartamento
router.get('/apartamentos-airbnb/predios/:predioId', verifyToken, apartamentosAirbnbController.getApartamentosByPredioId); // Obter apartamentos por ID do prédio
router.put('/apartamentos-airbnb/:id', verifyToken, apartamentosAirbnbController.updateApartamento); // Atualizar um apartamento por ID
router.delete('/apartamentos-airbnb/:id', verifyToken, apartamentosAirbnbController.deleteApartamento); // Deletar um apartamento por ID

// Rotas para reservasAirbnb
router.get('/reservas-airbnb', reservasAirbnbController.getAllReservas); // Listar todas as reservas
router.get('/reservas-airbnb/:id', reservasAirbnbController.getReservaById); // Obter uma reserva por ID
router.post('/reservas-airbnb', reservasAirbnbController.createReserva); // Criar uma nova reserva
router.get('/reservas-airbnb/apartamentos/:apartamentoId', reservasAirbnbController.getReservasByApartamentoId); // Obter reservas por ID do apartamento
router.put('/reservas-airbnb/:id', reservasAirbnbController.updateReserva); // Atualizar uma reserva por ID
router.delete('/reservas-airbnb/:id', reservasAirbnbController.deleteReserva); // Deletar uma reserva por ID

module.exports = router;



