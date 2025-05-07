const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    images: [
        {   
            type: String,
            required: true,
        },
    ],
    perks: [
        { type: String },
    ],
    extraInfo: {
        type: String,
    },
    type: {
        type: String,
        enum: ['apartment', 'studio', 'room', 'house', 'other'],
        default: 'apartment',
    },
    checkIn: {
        type: Date,
        required: true,
    },
    checkOut: {
        type: Date,
        required: true,
    },
    maxGuests: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt : {type:Date, default:Date.now},
});

const PlaceModel = mongoose.model('Place', PlaceSchema);

module.exports = PlaceModel;
