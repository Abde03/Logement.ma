const express = require('express');
const { newBooking } = require('../controllers/bookCtrl');
const { getBookings } = require('../controllers/bookCtrl');

const router = express.Router();

router.post('/new', newBooking);
router.get('/all', getBookings);




module.exports = router;