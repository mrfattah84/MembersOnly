const express = require('express');
const router = express.Router();

const controller = require('../controllers/mainController');
router.get('/', controller.checkNotAuthenticated, controller.renderLogIn);
router.post('/', controller.checkNotAuthenticated, controller.logIn);

module.exports = router;
