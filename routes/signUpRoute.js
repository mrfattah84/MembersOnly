const express = require('express');
const router = express.Router();

const controller = require('../controllers/mainController');
router.get('/', controller.checkNotAuthenticated, controller.renderSignUp);
router.post('/', controller.checkNotAuthenticated, controller.signUp);

module.exports = router;
