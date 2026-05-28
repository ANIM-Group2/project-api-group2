const express = require('express');
const router  = express.Router();
const AuthController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.post('/login',  AuthController.login);
router.get('/verify',  AuthController.verify);
router.get('/me',      authenticate, AuthController.me);

module.exports = router;