const express = require('express');
const { newBooking , getBookingById, getBookings, getBookingByOwner, updateStatus } = require('../controllers/bookCtrl');
const { userAuth } = require('../middleware/userAuth');

const router = express.Router();

router.post('/new', userAuth, newBooking);
router.post('/user', userAuth, getBookings);
router.get('/:id', getBookingById);
router.post('/owner', userAuth, getBookingByOwner);
router.patch('/:id/status', userAuth, updateStatus);





module.exports = router;