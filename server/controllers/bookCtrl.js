const BookingModel = require('../models/Booking');
const PlaceModel = require('../models/Place');

// Helper functions for consistent API responses
const sendResponse = (res, success, message, data = null, statusCode = 200) => {
  const response = { success, message };
  if (data) response.data = data;
  return res.status(statusCode).json(response);
};

const sendError = (res, message, statusCode = 500) => {
  return res.status(statusCode).json({ 
    success: false, 
    message 
  });
};


const newBooking = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return sendError(res, 'Authentication required', 401);
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
        
        // Check if place exists
        const placeData = await PlaceModel.findById(placeId);
        if (!placeData) {
            return sendError(res, 'Place not found', 404);
        }
        
        // Validate booking dates
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const now = new Date();
        
        if (checkInDate < now) {
            return sendError(res, 'Check-in date cannot be in the past', 400);
        }
        
        if (checkOutDate <= checkInDate) {
            return sendError(res, 'Check-out date must be after check-in date', 400);
        }
        
        // Check if place is available for the requested dates
        const existingBooking = await BookingModel.findOne({
            place: placeId,
            status: { $ne: 'rejected' },
            $or: [
                {
                    checkIn: { $lte: checkInDate },
                    checkOut: { $gt: checkInDate }
                },
                {
                    checkIn: { $lt: checkOutDate },
                    checkOut: { $gte: checkOutDate }
                },
                {
                    checkIn: { $gte: checkInDate },
                    checkOut: { $lte: checkOutDate }
                }
            ]
        });
        
        if (existingBooking) {
            return sendError(res, 'Place is not available for the selected dates', 409);
        }
        
        // Validate number of guests
        if (numberOfGuests > placeData.maxGuests) {
            return sendError(res, `Maximum ${placeData.maxGuests} guests allowed`, 400);
        }
    
        const booking = await BookingModel.create({
            place: placeId,
            user: userId,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            numberOfGuests,
            name,
            phone,
            price,
            status: 'pending'
        });
        
        return sendResponse(res, true, 'Booking created successfully', { bookingId: booking._id }, 201);
        
    } catch (error) {
        console.error('New booking error:', error);
        return sendError(res, 'Booking creation failed. Please try again.');
    }
};  

const getBookings = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return sendError(res, 'Authentication required', 401);
        }
        
        const bookings = await BookingModel.find({ user: userId })
            .populate('place', 'title address photos price')
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        
        if (bookings.length === 0) {
            return sendResponse(res, true, 'No bookings found', { bookings: [] });
        }
        
        return sendResponse(res, true, 'Bookings retrieved successfully', { bookings });
        
    } catch (error) {
        console.error('Get bookings error:', error);
        return sendError(res, 'Failed to retrieve bookings. Please try again.');
    }
};

const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        
        if (!userId) {
            return sendError(res, 'Authentication required', 401);
        }
        
        const booking = await BookingModel.findById(id)
            .populate('place', 'title address photos price owner')
            .populate('user', 'name email phone');
            
        if (!booking) {
            return sendError(res, 'Booking not found', 404);
        }
        
        // Check if user has permission to view this booking
        const isOwner = booking.user._id.toString() === userId.toString();
        const isPlaceOwner = booking.place.owner.toString() === userId.toString();
        
        if (!isOwner && !isPlaceOwner) {
            return sendError(res, 'Access denied', 403);
        }
        
        return sendResponse(res, true, 'Booking retrieved successfully', { booking });
        
    } catch (error) {
        console.error('Get booking by ID error:', error);
        return sendError(res, 'Failed to retrieve booking. Please try again.');
    }
};

const getBookingByOwner = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return sendError(res, 'Authentication required', 401);
        }
        
        // First get all places owned by the user
        const userPlaces = await PlaceModel.find({ owner: userId }).select('_id');
        const placeIds = userPlaces.map(place => place._id);
        
        if (placeIds.length === 0) {
            return sendResponse(res, true, 'No bookings found for your properties', { bookings: [] });
        }
        
        // Then get all bookings for those places
        const bookings = await BookingModel.find({ place: { $in: placeIds } })
            .populate('place', 'title address photos price')
            .populate('user', 'name email phone')
            .sort({ createdAt: -1 });
        
        return sendResponse(res, true, 'Property bookings retrieved successfully', { bookings });
        
    } catch (error) {
        console.error('Get bookings by owner error:', error);
        return sendError(res, 'Failed to retrieve property bookings. Please try again.');
    }
};

const updateStatus = async (req, res) => {
    try {
        const ownerId = req.userId;
        if (!ownerId) {
            return sendError(res, 'Authentication required', 401);
        }
        
        const { id } = req.params;
        const { status } = req.body;
        
        // Validate status
        if (!['confirmed', 'rejected', 'cancelled'].includes(status)) {
            return sendError(res, 'Invalid status. Must be confirmed, rejected, or cancelled', 400);
        }
        
        const booking = await BookingModel.findById(id).populate('place', 'owner title');
        if (!booking) {
            return sendError(res, 'Booking not found', 404);
        }
        
        // Check if user is the place owner (for confirm/reject) or booking owner (for cancel)
        const isPlaceOwner = booking.place.owner.toString() === ownerId.toString();
        const isBookingOwner = booking.user.toString() === ownerId.toString();
        
        if (status === 'cancelled' && !isBookingOwner) {
            return sendError(res, 'Only the booking owner can cancel a booking', 403);
        }
        
        if ((status === 'confirmed' || status === 'rejected') && !isPlaceOwner) {
            return sendError(res, 'Only the property owner can confirm or reject bookings', 403);
        }
        
        // Check if booking can be updated
        if (booking.status === 'confirmed' && status === 'rejected') {
            return sendError(res, 'Cannot reject a confirmed booking', 400);
        }
        if (booking.status === 'rejected' && status === 'confirmed') {
            return sendError(res, 'Cannot confirm a rejected booking', 400);
        }
        const oldStatus = booking.status;
        booking.status = status;
        booking.statusUpdatedAt = new Date();
        await booking.save();
        const message = `Booking status updated from ${oldStatus} to ${status}`;
        return sendResponse(res, true, message, { 
            booking: {
                _id: booking._id, 
                status: booking.status, 
                statusUpdatedAt: booking.statusUpdatedAt
            }
        });

    } catch (error) {
        console.error('Update booking status error:', error);
        return sendError(res, 'Failed to update booking status. Please try again.');
    }   
};


module.exports = {
    newBooking,
    getBookings,
    getBookingById,
    getBookingByOwner,
    updateStatus,
};