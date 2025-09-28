const UserModel = require("../models/User");
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const transporter = require('../utils/nodemailer');

// Utility functions
const generateOTP = () => {
  return String(Math.floor(100000 + Math.random() * 900000));
};

// Helper function for consistent API responses
const sendResponse = (res, success, message, data = null, statusCode = 200) => {
  const response = { success, message };
  if (data) response.data = data;
  return res.status(statusCode).json(response);
};

// Helper function for consistent error responses
const sendError = (res, message, statusCode = 500) => {
  return res.status(statusCode).json({ 
    success: false, 
    message 
  });
};

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validation is handled by middleware, so we can trust the input
    
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User already exists with this email' });
    }

    // Hash password with higher salt rounds for security
    const hashedPassword = bcryptjs.hashSync(password, 12);
    
    // Save user to database
    const newUser = new UserModel({ 
      name: name.trim(), 
      email: email.toLowerCase(), 
      password: hashedPassword 
    });
    await newUser.save();

    // Generate token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 1 * 24 * 60 * 60 * 1000 
    });

    // Send welcome email (don't fail registration if email fails)
    try {
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: '🎉 Welcome to Logement.ma!',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px;">
              <h2 style="color: #333;">Welcome to Logement.ma! 🎉</h2>
              <p>Hello ${name}, we're excited to have you on board!</p>
              <p>Start exploring amazing accommodations across Morocco!</p>
              <hr style="margin: 20px 0;" />
              <p style="font-size: 14px; color: #999;">Best regards,<br>Logement.ma Team</p>
            </div>
          </div>
        `,
      };
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Welcome email failed:', emailError);
    }

    res.json({ success: true, message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation handled by middleware

    // Check if user exists
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Verify password
    const isPasswordValid = bcryptjs.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 1 * 24 * 60 * 60 * 1000 
    }); 

    res.json({ success: true, message: 'User signed in successfully' });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ success: false, message: 'Sign in failed. Please try again.' });
  }  
};


const signout = async (req, res) => {
  try {
    // Clear cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });
    
    return res.json({ success: true, message: 'User signed out successfully' });
  } catch (error) {
    console.error('Signout error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Sign out failed. Please try again.' 
    });
  }
};

const sendVerifyOtp = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Missing userId - Authentication required' 
      });
    }
    
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    if (user.isAccountVerified) {
      return res.status(400).json({ 
        success: false, 
        message: 'Account is already verified' 
      });
    }
    
    // Generate OTP using the standard utility function
    const otp = generateOTP();
    user.verifyOTP = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
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
    res.json({ success: true, message: 'OTP sent successfully' });
    
  } catch (error) {
    console.error('Send verify OTP error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send verification code. Please try again.' 
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Missing userId - Authentication required' 
      });
    }
    
    const { otp } = req.body;
    if (!otp) {
      return res.status(400).json({ 
        success: false, 
        message: 'OTP is required' 
      });
    }
    
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    if (user.isAccountVerified) {
      return res.status(400).json({ 
        success: false, 
        message: 'Account is already verified' 
      });
    }
    
    if (user.verifyOTP !== otp || user.verifyOTP === '') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid OTP' 
      });
    }
    
    if (user.verifyOtpExpireAt < Date.now()) {
      return res.status(400).json({ 
        success: false, 
        message: 'OTP has expired' 
      });
    }
    
    user.isAccountVerified = true;
    user.verifyOTP = '';
    user.verifyOtpExpireAt = 0;
    await user.save();
    
    res.json({ success: true, message: 'Account verified successfully' });
    
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Verification failed. Please try again.' 
    });
  }
};

const isAuthenticated = async (req, res) => {
  try {
    res.json({ success: true, message: 'User is authenticated' });
  } catch (error) {
    console.error('Authentication check error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Authentication check failed' 
    });
  }
};

const sendResetPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await UserModel.findOne({ email: email.toLowerCase() }); 
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'No account found with this email address' 
      });
    }
    
    // Generate 6-digit OTP
    const otp = generateOTP();
    
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // 15 minutes expiry
    await user.save();
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: '🔐 Reset Your Password',
      text: `Your OTP for resetting your password is ${otp}. It will expire in 15 minutes.`,
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
              This code will expire in 15 minutes.
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
    res.json({ success: true, message: 'OTP sent successfully' });
    
  } catch (error) {
    console.error('Send reset password OTP error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send OTP. Please try again.' 
    });
  }
};

const verifyResetPasswordOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    // Basic validation
    if (!email || !otp) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and OTP are required' 
      });
    }
    
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid reset request' 
      });
    }
    
    // Normalize OTPs for comparison
    const receivedOTP = String(otp).trim();
    const storedOTP = String(user.resetOtp).trim();
    
    // Check if OTP is expired first
    if (user.resetOtpExpireAt < Date.now()) {
      // Clear expired OTP for security
      user.resetOtp = '';
      user.resetOtpExpireAt = 0;
      await user.save();
      
      return res.status(400).json({ 
        success: false, 
        message: 'OTP has expired. Please request a new one.' 
      });
    }
    
    // Check if OTP is valid
    if (storedOTP === '' || receivedOTP !== storedOTP) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid OTP' 
      });
    }
    
    // OTP is valid - generate a temporary token for password reset
    const resetToken = jwt.sign(
      { 
        email: user.email, 
        purpose: 'password-reset',
        otpVerified: true 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '15m' } // Token valid for 15 minutes
    );
    
    res.json({ 
      success: true, 
      message: 'OTP verified successfully. You can now reset your password.',
      resetToken: resetToken
    });
    
  } catch (error) {
    console.error('Verify reset password OTP error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Verification failed. Please try again.' 
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { newPassword, resetToken } = req.body;
    
    // Verify reset token
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
      if (decoded.purpose !== 'password-reset' || !decoded.otpVerified) {
        throw new Error('Invalid token purpose');
      }
    } catch (tokenError) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired reset token. Please verify OTP again.' 
      });
    }
    
    const user = await UserModel.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Reset the password
    user.password = bcryptjs.hashSync(newPassword, 12);
    user.resetOtp = '';
    user.resetOtpExpireAt = 0;
    await user.save();
    
    res.json({ 
      success: true, 
      message: 'Password reset successfully. You can now login with your new password.' 
    });
    
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Password reset failed. Please try again.' 
    });
  }
};

module.exports = {
    signup,
    signin,
    signout,
    sendVerifyOtp,
    verifyOtp,
    isAuthenticated,
    sendResetPasswordOtp,
    verifyResetPasswordOtp,
    resetPassword 
};
