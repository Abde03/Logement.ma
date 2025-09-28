const PlaceModel = require('../models/Place');
const mongoose = require('mongoose');
const UserModel = require('../models/User');
const BookingModel = require('../models/Booking');

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

const createPlace = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return sendError(res, 'Authentication required', 401);
        }
        
        const { 
            title, address, description, perks,
            extraInfo, checkIn, checkOut, maxGuests, price, images, type
        } = req.body;

        // Validate images array
        if (!images || !Array.isArray(images) || images.length === 0) {
            return sendError(res, 'At least one image is required', 400);
        }
        
        // Validate date logic (if dates are provided)
        if (checkIn && checkOut) {
            const checkInDate = new Date(checkIn);
            const checkOutDate = new Date(checkOut);
            
            if (checkInDate >= checkOutDate) {
                return sendError(res, 'Check-out date must be after check-in date', 400);
            }
        }
        
        // Validate max guests
        if (maxGuests && maxGuests <= 0) {
            return sendError(res, 'Maximum guests must be greater than 0', 400);
        }
        
        // Validate price
        if (price && price <= 0) {
            return sendError(res, 'Price must be greater than 0', 400);
        }
        
        const newPlace = await PlaceModel.create({
            title, 
            address, 
            description, 
            perks: perks || [], 
            extraInfo, 
            checkIn, 
            checkOut, 
            maxGuests, 
            price, 
            type, 
            images, 
            owner: userId,
        });
        
        return sendResponse(res, true, 'Place created successfully', { place: newPlace }, 201);

    } catch (error) {
        console.error('Create place error:', error);
        return sendError(res, 'Failed to create place. Please try again.');
    }
};

const getUserPlaces = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return sendError(res, 'Authentication required', 401);
        }
        
        const places = await PlaceModel.find({ owner: userId })
            .select('title address price images type createdAt')
            .sort({ createdAt: -1 });
        
        if (places.length === 0) {
            return sendResponse(res, true, 'No places found', { places: [] });
        }
        
        return sendResponse(res, true, 'User places retrieved successfully', { places });

    } catch (error) {
        console.error('Get user places error:', error);
        return sendError(res, 'Failed to retrieve places. Please try again.');
    }
};

const getPlaceById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendError(res, 'Invalid place ID', 400);
        }
        
        const place = await PlaceModel.findById(id)
            .populate('owner', 'name email')
            .lean();
            
        if (!place) {
            return sendError(res, 'Place not found', 404);
        }
        
        return sendResponse(res, true, 'Place retrieved successfully', { place });

    } catch (error) {
        console.error('Get place by ID error:', error);
        return sendError(res, 'Failed to retrieve place. Please try again.');
    }
}

const updatePlace = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const placeData = req.body;
        
        if (!userId) {
            return sendError(res, 'Authentication required', 401);
        }
        
        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendError(res, 'Invalid place ID', 400);
        }
        
        const existingPlace = await PlaceModel.findById(id);
        if (!existingPlace) {
            return sendError(res, 'Place not found', 404);
        }
        
        // Check if user owns this place
        if (existingPlace.owner.toString() !== userId.toString()) {
            return sendError(res, 'Access denied. You can only update your own places.', 403);
        }
        
        // Validate update data
        if (placeData.images && (!Array.isArray(placeData.images) || placeData.images.length === 0)) {
            return sendError(res, 'At least one image is required', 400);
        }
        
        if (placeData.checkIn && placeData.checkOut) {
            const checkInDate = new Date(placeData.checkIn);
            const checkOutDate = new Date(placeData.checkOut);
            
            if (checkInDate >= checkOutDate) {
                return sendError(res, 'Check-out date must be after check-in date', 400);
            }
        }
        
        if (placeData.maxGuests && placeData.maxGuests <= 0) {
            return sendError(res, 'Maximum guests must be greater than 0', 400);
        }
        
        if (placeData.price && placeData.price <= 0) {
            return sendError(res, 'Price must be greater than 0', 400);
        }
        
        // Remove owner from update data to prevent ownership change
        const { owner, ...updateData } = placeData;
        
        const updatedPlace = await PlaceModel.findByIdAndUpdate(
            id, 
            { ...updateData, updatedAt: new Date() }, 
            { new: true, runValidators: true }
        );
        
        return sendResponse(res, true, 'Place updated successfully', { place: updatedPlace });

    } catch (error) {
        console.error('Update place error:', error);
        return sendError(res, 'Failed to update place. Please try again.');
    }
}

const getAllPlaces = async (req, res) => {
    try {
        const {
            search,
            type,
            minPrice,
            maxPrice,
            maxGuests,
            page = 1,
            limit = 12,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;
        
        // Build filter object
        const filter = {};
        
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { address: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        
        if (type) {
            filter.type = type;
        }
        
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
        }
        
        if (maxGuests) {
            filter.maxGuests = { $gte: parseInt(maxGuests) };
        }
        
        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const sortObj = {};
        sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;
        
        // Execute queries
        const [places, totalCount] = await Promise.all([
            PlaceModel.find(filter)
                .select('title address price images type maxGuests createdAt')
                .populate('owner', 'name')
                .sort(sortObj)
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
            PlaceModel.countDocuments(filter)
        ]);
        
        const totalPages = Math.ceil(totalCount / parseInt(limit));
        
        return sendResponse(res, true, 'Places retrieved successfully', {
            places,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalCount,
                hasNext: parseInt(page) < totalPages,
                hasPrev: parseInt(page) > 1
            }
        });
        
    } catch (error) {
        console.error('Get all places error:', error);
        return sendError(res, 'Failed to retrieve places. Please try again.');
    }
};

const deletePlace = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return sendError(res, 'Authentication required', 401);
        }
        
        const { id } = req.params;
        
        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendError(res, 'Invalid place ID', 400);
        }
        
        const place = await PlaceModel.findById(id);
        if (!place) {
            return sendError(res, 'Place not found', 404);
        }
        
        // Check if user owns this place
        if (place.owner.toString() !== userId.toString()) {
            return sendError(res, 'Access denied. You can only delete your own places.', 403);
        }
        
        // Check for active bookings
        const activeBookings = await BookingModel.find({
            place: id,
            status: { $in: ['pending', 'confirmed'] },
            checkOut: { $gte: new Date() }
        });
        
        if (activeBookings.length > 0) {
            return sendError(res, 
                `Cannot delete place. There are ${activeBookings.length} active booking(s). Please cancel or complete them first.`, 
                409
            );
        }
        
        // Delete place and associated bookings
        await Promise.all([
            PlaceModel.findByIdAndDelete(id),
            BookingModel.deleteMany({ place: id })
        ]);
        
        return sendResponse(res, true, 'Place deleted successfully');
        
    } catch (error) {
        console.error('Delete place error:', error);
        return sendError(res, 'Failed to delete place. Please try again.');
    }
}


module.exports = {  
    createPlace,
    getUserPlaces,
    getPlaceById,
    updatePlace,
    getAllPlaces,
    deletePlace,
};