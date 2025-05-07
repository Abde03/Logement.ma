const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    place : {type:mongoose.Schema.Types.ObjectId , required:true , ref:'Place'},
    user : {type:mongoose.Schema.Types.ObjectId , required:true, ref:'User'},
    checkIn : {type:Date, required:true},
    checkOut : {type:Date, required:true},
    numberOfGuests : {type:Number, required : true},
    name : {type:String, required:true},
    phone : {type:String, required:true},
    price : {type:Number, required:true},
    status : {type:String, required:true , default:'pending', enum:['pending', 'confirmed', 'rejected']},
    createdAt : {type:Date, default:Date.now},
});

const BookingModel = mongoose.model('Booking', bookingSchema);
module.exports = BookingModel;