const express = require('express');
const router = express.Router();

const Router = require('../controllers/mainController');
router.get('/', Router.index);

module.exports = router;
