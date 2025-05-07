const BookingModel = require('../models/Booking');
const PlaceModel = require('../models/Place');


const newBooking = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.json({ success:false, message: 'CurrentUser id is missing' });
        }
        const {
            placeId,
            checkIn,
            checkOut,
            numberOfGuests,
            name,
            phone,
            price,
        } = req.body;
        
        if (!placeId || !checkIn || !checkOut || !numberOfGuests || !name || !phone || !price) {
            return res.json({ success: false, message: 'All fields are required' });
        }
        const placeData = await PlaceModel.findById(placeId);
        if (!placeData) {
            return res.json({ success: false, message: 'Place not found' });
        }
        
        if(checkIn < placeData.checkIn || checkOut > placeData.checkOut) {
            return res.json({ success: false, message: 'Booking dates are not available' });
        }
    
        const booking = await BookingModel.create({
            place : placeId,
            user : userId,
            checkIn,
            checkOut,
            numberOfGuests,
            name,
            phone,
            price,
        })
        if (!booking) {
            return res.json({ success: false, message: 'Booking creation failed' });
        }
        res.json({ success: true, message: 'Booking created successfully' });
    }catch (error) {
        res.json({ success: false, message: error.message });
    }

};  

const getBookings = async (req, res) => {
    try {
        const userID = req.userId;
        if (!userID) {
            return res.json({success: false, message: 'CurrentUser id is missing' });
        }
        
        const bookings = await BookingModel.find({ user: userID }).populate('place').populate('user');
        
        if (!bookings) {
            return res.json({ success: false, message: 'No bookings found' });
        }
        if (bookings.length === 0) {
            return res.json({ success: false, message: 'No bookings found' });
        }
        res.json({ success: true, bookings });
    }catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'An error occurred while fetching bookings' });
    }
};

const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.json({ success: false, message: 'Booking id is missing' });
        }
        const booking = await BookingModel.findById(id).populate('place');
        if (!booking) {
            return res.json({ success: false, message: 'Booking not found' });
        }
        res.json({ success: true, booking });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

const getBookingByOwner = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.json({ success: false, message: 'CurrentUser id is missing' });
        }
        const bookings = await BookingModel.find().populate('place');
        const filteredBookings = bookings.filter(booking => booking.place.owner.toString() === userId.toString());
        if (!filteredBookings) {
            return res.json({ success: false, message: 'No bookings found' });
        }
        res.json({ success: true, bookings: filteredBookings });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

const updateStatus = async (req, res) => {
    const ownerId = req.userId;
    if (!ownerId) {
        return res.json({ success: false, message: 'CurrentUser id is missing' });
    }
    const { id } = req.params;
    if (!id) {
        return res.json({ success: false, message: 'Booking id is missing' });
    }
    const status = req.body.status;
    if (!['confirmed', 'rejected'].includes(status)) {
        return res.json({ success: false, message: 'Invalid status' });
    }
    try {
        const booking = await BookingModel.findById(id).populate('place');
        if (!booking) {
            return res.json({ success: false, message: 'Booking not found' });
        }
        booking.status = status;
        await booking.save();
        res.json({ success: true, message: `Booking now is ${status} .`, booking });
    }catch (error) {
        res.json({ success: false, message: error.message });
    }
}




module.exports = {
    newBooking,
    getBookings,
    getBookingById,
    getBookingByOwner,
    updateStatus,
};