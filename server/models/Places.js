const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema({
    title: String,
    description: String,
    adress: String,
    images: [String],
    perks: [String],
    extraInfo: String,
    category: String,
    checkIn: Number,
    checkOut: Number,
    maxGuests: Number,
    price: Number,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    });

const PlaceModel = mongoose.model('Place', PlaceSchema);

module.exports = PlaceModel;
