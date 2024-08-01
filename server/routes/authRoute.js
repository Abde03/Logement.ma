const express = require('express');
const { signup } = require('../controllers/authCtrl');
const { signin } = require('../controllers/authCtrl');
const { signout } = require('../controllers/authCtrl');

const router = express.Router();

router.post('/register', signup);
router.post('/login', signin);
router.get('/signout',signout );

module.exports = router;