const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema({
  name: { type:String, required:true},
  email: {type:String, required:true, unique:true},
  password: {type:String, required:true},
  verifyOTP: {type:String, default:''},
  verifyOtpExpireAt: {type:Number, default:0},
  isAccountVerified: {type:Boolean, default:false},
  resetOtp: {type:String, default:''},
  resetOtpExpireAt: {type:Number, default:0},
  isAdmin: {type:Boolean, default:false},
  createdAt : {type:Date, default:Date.now},
});

const UserModel = mongoose.models.user || mongoose.model('User', UserSchema);

module.exports = UserModel;