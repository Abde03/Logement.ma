const PlaceModel = require('../models/Place');
const mongoose = require('mongoose');
const UserModel = require('../models/User');
const BookingModel = require('../models/Booking');

const createPlace = async (req, res) => {
    try {
        const userId = req.userId;
        if(!userId) {
            return res.json({success:false, message: 'id is missing' });
        }
        const { 
            title, address, description, perks ,
            extraInfo, checkIn, checkOut, maxGuests, price, images, type
        } = req.body;

        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        
        if (checkInDate >= checkOutDate) {
            return res.json({success:false, message: 'Check-in date must be before check-out date' });
        }
        if (maxGuests <= 0) {
            return res.json({success:false, message: 'Max guests must be greater than 0' });
        }
        
        if (!title || !address || !description || !checkIn || !checkOut || !maxGuests || !price || !images || !type) {
            return res.json({success:false, message: 'All fields with * are required' });
        }
        if (addedPhotos.length === 0) {
            return res.json({success:false, message: 'At least one photo is required' });
        }
        const newPlace = await PlaceModel.create({
            title, address, description, perks, extraInfo, checkIn, checkOut, maxGuests, price, type, images, owner:userId,
        });
        res.json({success:true, message:'Place created successfully', place:newPlace});

    } catch (error) {
        res.json({success:false, message: error.message });
    }
};

const getUserPlaces = async (req, res) => {

    try {     
        const userId = req.userId;
        if(!userId) {
            return res.json({success:false, message: 'id is missing' });
        }
        const places = await PlaceModel.find({ owner: userId});
        if (!places) {
            return res.json({success:false, message: 'No places found' });
        }
        res.json({success:true, message:'fetching user places...', places});

    } catch (error) {
        res.json({success:false, message: error.message });
    }
};

const getPlaceById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.json({success:false, message: 'Place id is missing' });
        }
        const place = await PlaceModel.findById(id);
        if (!place) {
            return res.json({success:false, message: 'Place not found' });
        }
        res.json({success:true, message:'fetching place...', place});

    } catch (error) {
        res.json({success:false, message: error.message });
    }
}

const updatePlace = async (req, res) => {
    try {
    const userId = req.userId;
    const {id} = req.params;
    const placeData = req.body;
    if(!placeData) {
        return res.json({success:false, message: 'Place data is missing' });
    } 
    if(!userId) {
        return res.json({success:false, message: 'id is missing' });
    }
    if (!id) {
        return res.json({success:false, message: 'Place id is missing' });
    }
    const placeDoc = await PlaceModel.findById(id);
    
    if (!placeDoc) {
        return res.json({success:false, message: 'Place not found' });
    }
    const updatedPlace = await PlaceModel.findByIdAndUpdate(id, {
        ...placeData,
        owner: userId,
    }, { new: true });
    if (!updatedPlace) {
        return res.json({success:false, message: 'Failed to update place' });
    }
    res.json({success:true, message:'Place updated successfully', place:updatedPlace});

    } catch (error) {
        res.json({success:false, message: error.message });
    }
}

const getAllPlaces = async (req, res) => {
    try {
        const places = await PlaceModel.find();
        if (!places) {
            return res.json({success:false, message: 'No places found' });
        }
        res.json({success:true, message:'fetching all places...', places});
    } catch (error) {
        res.json({success:false, message: error.message });
    }
}

const deletePlace = async (req, res) => {
    try {
        const userId = req.userId;
        if(!userId) {
            return res.json({success:false, message: 'you need to sign in!' });
        }
        const { id } = req.params;
        if (!id) {
            return res.json({success:false, message: 'Place id is missing' });
        }
        const place = await PlaceModel.findById(id);
        if (!place) {
            return res.json({success:false, message: 'Place not found' });
        }
        await PlaceModel.findByIdAndDelete(id);
        await BookingModel.deleteMany({ place: id });
        res.json({success:true, message:'Place deleted successfully'});
    } catch (error) {
        res.json({success:false, message: error.message });
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