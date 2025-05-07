const express = require('express');
const { getUserData } = require('../controllers/userCtrl');
const { userAuth } = require('../middleware/userAuth');

const router = express.Router();

router.get('/data', userAuth, getUserData);

module.exports = router;