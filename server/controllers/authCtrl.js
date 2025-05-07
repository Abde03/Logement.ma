const UserModel = require("../models/User");
const bcryptjs = require('bcryptjs');
const errorHandling = require('../utils/error');
const jwt = require('jsonwebtoken');
const transporter = require('../utils/nodemailer');

const signup = async (req, res) => {
  // Get user input
  const { name, email, password } = req.body;
  // Check if all fields are provided
  if (!name || !email || !password) return res.json({success:false, message: 'All fields are required'});

  try {
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) return res.json({success: false, message: 'User already exists'});
    // Hash password
    const hashedPassword = bcryptjs.hashSync(password, 10);
    // Save user to database
    const newUser = new UserModel({ name, email, password: hashedPassword });
    await newUser.save();
    // Generate token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token,{
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 1 * 24 * 60 * 60 * 1000 
    });
    // Send email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: '🎉 Welcome to Our Platform!',
      text: `Welcome to our platform! You have successfully signed up with the email: ${email}.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
            <h2 style="color: #333;">Welcome to Our Platform! 🎉</h2>
            <p style="font-size: 16px; color: #555;">
              Hello and welcome! We're excited to have you on board.
            </p>
            <p style="font-size: 16px; color: #555;">
              You have successfully signed up using the email: <strong>${email}</strong>.
            </p>
            <p style="font-size: 16px; color: #555;">
              Feel free to explore, and let us know if you need any help.
            </p>
            <hr style="margin: 20px 0;" />
            <p style="font-size: 14px; color: #999;">
              Logement.ma-Team
            </p>
          </div>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
    res.json({success: true, message: 'User created successfully' });
  }catch (error) {
    res.json({success: false, message: error.message});
  }
};

const signin = async (req, res, next) => {
  // Get user input  
  const { email, password } = req.body;
  // Check if all fields are provided
  if (!email || !password) return res.json({success: false, message: 'All fields are required'});

  try {
    // Check if user exists
    const user = await UserModel.findOne({email});
    if (!user) return res.json({success: false, message: 'User not found'});
    const isPasswordValid = bcryptjs.compareSync(password, user.password);
    if (!isPasswordValid) return res.json({success: false, message: 'Invalid password'});
    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token,{
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 1 * 24 * 60 * 60 * 1000 
    }); 
    return res.json({success: true, message: 'User signed in successfully'});
  }catch(error){
    res.json({success: false, message: error.message});
  }  
};


const signout = async (req, res) => {
  try {
    // Clear cookie
    res.clearCookie('token',{
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    })
    return res.json({success:true, message: 'User signed out successfully' });
  }catch(error){
    res.json({success:false, message:error.message});
  }
};

const sendVerifyOtp = async (req, res, next) => {
  try{
    // Get user input
    const userId = req.userId;
    if(!userId) return next({success: false, message: 'Missing userId'});
    // Check if user is Verified
    const user = await UserModel.findById(userId);
    if(user.isAccountVerified) return next({success: false, message: 'Account already verified'});
    // Check if user exists
    if(!user) return next({success: false, message: 'Invalid userId'});
    // Generate OTP
    const otp = String(100000 + Math.random()* 900000).toString().slice(0,6);
    user.verifyOTP = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: '🔐 Verify Your Account',
      text: `Your verification code is ${otp}. It will expire in 24 hours.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h2 style="color: #333;">Verify Your Account 🔐</h2>
            <p style="font-size: 16px; color: #555;">
              Hello,
            </p>
            <p style="font-size: 16px; color: #555;">
              To complete your registration, please use the verification code below:
            </p>
            <div style="margin: 20px 0; font-size: 24px; font-weight: bold; color: #1a73e8; text-align: center;">
              ${otp}
            </div>
            <p style="font-size: 14px; color: #999; text-align: center;">
              This code will expire in 24 hours.
            </p>
            <hr style="margin: 30px 0;" />
            <p style="font-size: 14px; color: #999;">
              If you didn't request this code, please ignore this email.
            </p>
          </div>
        </div>
      `,
    };
    
    await transporter.sendMail(mailOptions);
    res.json({success: true, message: 'OTP sent successfully'});
  }catch(error){
    res.json({success: false, message: error.message});
  }
}

const verifyOtp = async (req, res, next) => {
  
  const userId = req.userId;
  if(!userId) return next({success: false, message: 'Missing userId'});
  const {otp} = req.body;
  if(!otp) return next({success: false, message: 'Missing OTP'});
  
  try{
    const user = await UserModel.findById(userId);
    if(!user) return next({success: false, message: 'Invalid userId'});
    if(user.isAccountVerified) return next({success: false, message: 'Account already verified'});
    if(user.verifyOTP !== otp || user.verifyOTP === '') return next({success: false, message: 'Invalid OTP'});
    if(user.verifyOtpExpireAt < Date.now()) return next({success: false, message: 'OTP expired'});
    user.isAccountVerified = true;
    user.verifyOTP = '';
    user.verifyOtpExpireAt = 0;
    await user.save();
    res.json({success: true, message: 'Account verified successfully'});
  }
  catch(error){
    res.json({success: false, message: error.message});
  }
}

const isAuthenticated = async (req, res, next) => {
  try{
    res.json({success: true, message: 'User is authenticated'});
  }catch (error) {
    res.json({success: false, message: 'User is not authenticated'});
  }
};

const sendResetPasswordOtp = async (req, res, next) => {
  
  const {email} = req.body;
  if(!email) return({success:false, message:'Missing Email'});
  
  try{
    
    const user = await UserModel.findOne({email}); 
    if(!user) return ({success: false, message: 'Invalid email'});
    const otp = String(100000 + Math.random()* 900000).toString().slice(0,6);
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: '🔐 Reset Your Password',
      text: `Your OTP for resetting your password is ${otp}. It will expire in 24 hours.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h2 style="color: #333;">Reset Your Password</h2>
            <p style="font-size: 16px; color: #555;">
              Hello,
            </p>
            <p style="font-size: 16px; color: #555;">
              We received a request to reset your password. Please use the code below to proceed:
            </p>
            <div style="margin: 20px 0; font-size: 24px; font-weight: bold; color: #e63946; text-align: center;">
              ${otp}
            </div>
            <p style="font-size: 14px; color: #999; text-align: center;">
              This code will expire in 24 hours.
            </p>
            <hr style="margin: 30px 0;" />
            <p style="font-size: 14px; color: #999;">
              If you didn’t request a password reset, you can ignore this email. Your account is still secure.
            </p>
          </div>
        </div>
      `,
    };
    
    await transporter.sendMail(mailOptions);
    res.json({success: true, message: 'OTP sent successfully'});
    
  }
  catch(error){
    res.json({success: false, message: error.message});
  }
}

const resetPassword = async (req, res, next) => {
  
  const {email, otp, newPassword} = req.body;
  if(!email || !otp || !newPassword) return next(errorHandling(404, 'Missing Data'));
  
  try{
    const user = await UserModel.findOne({email});
    if(!user) return next(errorHandling(404, 'Invalid email'));
    if(user.resetPasswordOTP !== otp || user.resetPasswordOTP === '') return next(errorHandling(404, 'Invalid OTP'));
    if(user.resetPasswordOTPExpireAt < Date.now()) return next(errorHandling(404, 'OTP expired'));
    user.password = bcryptjs.hashSync(newPassword, 10);
    user.resetPasswordOTP = '';
    user.resetPasswordOTPExpireAt = 0;
    await user.save();
    res.json({success: true, message: 'Password reset successfully'});
  }
  catch(error){
    res.json({success: false, message: error.message});
  }
}



module.exports = {
    signup,
    signin,
    signout,
    sendVerifyOtp,
    verifyOtp,
    isAuthenticated,
    sendResetPasswordOtp,
    resetPassword 
};
