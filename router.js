const express = require('express');
const router = express.Router();
const loginController = require('./controllers/login.controller')
const userController = require('./controllers/user.controller')
const auth = require('./auth')
const converController = require('./controllers/covers.controller')
const peticionController = require('./controllers/peticion.controller')

//rutas de login
router.post('/login', loginController.login)
router.post('/signup', loginController.signup)

//rutas de usuarios
router.get('/lista/usuarios', auth.verifyToken, userController.listaGente)
router.post('/usuario/addFriend', auth.verifyToken, userController.addFriend)
router.post('/usuario/deleteFriend', auth.verifyToken, userController.deleteFriend)
router.post('/lista/particular', auth.verifyToken, userController.listaUno)
router.post('/user/edit', auth.verifyToken, userController.editarPerfil)
router.post('/user/delete', auth.verifyToken, userController.borrarPerfil)

// rutas de mensajes
router.post('/mensajes/guardar', auth.verifyToken, converController.nuevoMsg)
router.post('/mensajes/listar', auth.verifyToken, converController.listarMsg)
router.post('/conver/delete', auth.verifyToken, converController.borrarConver)

//rutas de peticiones
router.post('/peticion/nueva', auth.verifyToken, peticionController.nuevaPeticion)
router.post('/peticiones/lista', auth.verifyToken, peticionController.listar)
router.post('/peticiones/respuesta', auth.verifyToken, peticionController.respuesta)

module.exports = router;