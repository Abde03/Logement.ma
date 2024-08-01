const BookingModel = require('../models/Booking');


const newBooking = async (req, res, next) => {
    const {
        place,
        checkIn,
        checkOut,
        numberOfGuests,
        name,
        phone,
        price,
        user
    } = req.body;
    
    BookingModel.create({
        place,
        checkIn,
        checkOut,
        numberOfGuests,
        name,
        phone,
        price,
        user
    })
    .then((booking) => {
        res.json(booking);
    }).catch(next);
};  

const getBookings = async (req, res, next) => {
    try {
        const userID = req.query.userID;
        if (!userID) {
            return res.status(400).json({ error: 'CurrentUser or CurrentUser._id is missing' });
        }
        const bookings = await BookingModel.find({ user: userID }).populate('place');

        res.json(bookings);
    }catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'An error occurred while fetching bookings' });
    }
};


module.exports = {
    newBooking,
    getBookings
};