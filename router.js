const express = require('express');
const router = express.Router();
const verifyToken = require('./src/middlewares/authMiddleware');

const usersController = require('./src/controllers/usersController');
const statusController = require('./src/controllers/statusController');
const predioController = require('./src/controllers/predioAirbnbController');
const apartamentosAirbnbController = require('./src/controllers/apartamentosAirbnbController');
const reservasAirbnbController = require('./src/controllers/reservasAirbnbController');
const checkinFormController = require('./src/controllers/checkinFormController'); // Import do checkinController

// User routes
router.get('/users', verifyToken, usersController.getAllUsers);
router.get('/users/:id', verifyToken, usersController.getUser);
router.get('/users/role/:role', verifyToken, usersController.getUsersByRole);
router.post('/login', usersController.loginUser);
router.post('/users', usersController.createUser);
router.post('/users/batch', verifyToken, usersController.createUsersBatch);
router.put('/users/:id', verifyToken, usersController.updateUser);
router.delete('/users/:id', verifyToken, usersController.deleteUser);

// Server status
router.get('/status', statusController.getServerStatus);

// PredioAirbnb routes
router.get('/predios', verifyToken, predioController.getAllPredios);
router.get('/predios/:id', verifyToken, predioController.getPredioById);
router.post('/predios', verifyToken, predioController.createPredio);
router.put('/predios/:id', verifyToken, predioController.updatePredio);
router.delete('/predios/:id', verifyToken, predioController.deletePredio);

// ApartamentosAirbnb routes
router.get('/apartamentos-airbnb', verifyToken, apartamentosAirbnbController.getAllApartamentos);
router.get('/apartamentos-airbnb/:id', verifyToken, apartamentosAirbnbController.getApartamentoById);
router.post('/apartamentos-airbnb', verifyToken, apartamentosAirbnbController.createApartamento);
router.get('/apartamentos-airbnb/predios/:predioId', verifyToken, apartamentosAirbnbController.getApartamentosByPredioId);
router.put('/apartamentos-airbnb/:id', verifyToken, apartamentosAirbnbController.updateApartamento);
router.delete('/apartamentos-airbnb/:id', verifyToken, apartamentosAirbnbController.deleteApartamento);

// ReservasAirbnb routes
router.get('/reservas-airbnb', reservasAirbnbController.getAllReservas);
router.get('/reservas-airbnb/:id', reservasAirbnbController.getReservaById);
router.post('/reservas-airbnb', reservasAirbnbController.createReserva);
router.get('/reservas-airbnb/apartamentos/:apartamentoId', reservasAirbnbController.getReservasByApartamentoId);
router.put('/reservas-airbnb/:id', reservasAirbnbController.updateReserva);
router.delete('/reservas-airbnb/:id', reservasAirbnbController.deleteReserva);

// Rotas de Check-in
router.get('/checkins', verifyToken, checkinFormController.getAllCheckins); // Listar todos os check-ins
router.get('/checkins/:id', verifyToken, checkinFormController.getCheckinById); // Obter um check-in por ID
router.get('/checkins/reserva/:reservaId', verifyToken, checkinFormController.getCheckinsByReservaId); // Obter check-ins por reservaId
router.get('/checkins/search/:reservaId/:codReserva', verifyToken, checkinFormController.getCheckinByReservaIdOrCodReserva); // Obter check-in por reservaId ou codReserva
router.post('/checkins', checkinFormController.createCheckin); // Criar um novo check-in
router.put('/checkins/:id', verifyToken, checkinFormController.updateCheckin); // Atualizar um check-in por ID
router.delete('/checkins/:id', verifyToken, checkinFormController.deleteCheckin); // Deletar um check-in por ID

module.exports = router;
