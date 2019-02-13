const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const verifyToken = require('../verifyToken');

router.get('/', authController.home);

router.get('/register', verifyToken, authController.register);

router.post('/register', authController.doRegister);

router.post('/login', authController.doLogin);

router.get('/logout', authController.logout);

module.exports = router;