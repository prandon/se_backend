const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController')

router.get('/', authController.home);

router.get('/register', authController.register);

router.post('/register', authController.doRegister);

router.post('/login', authController.doLogin);

router.get('/logout', authController.logout);

module.exports = router;