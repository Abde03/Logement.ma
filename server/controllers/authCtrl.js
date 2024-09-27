const UserModel = require("../models/User");
const bcryptjs = require('bcryptjs');
const errorHandling = require('../utils/error');
const jwt = require('jsonwebtoken');

const signup = async (req, res, next) => {
    const { name, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new UserModel({ name, email, password: hashedPassword });
    try {
      await newUser.save();
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      next(error);
    }
};

const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const user = await UserModel.findOne({email});
      if (!user) return next(errorHandling(404, 'User not found'));
      const isPasswordValid = bcryptjs.compareSync(password, user.password);
      if (!isPasswordValid) return next(errorHandling(401, 'Invalid password'));
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.cookie('access_token', token, { httpOnly: true, sameSite: 'strict' }).status(200).json(user);
    
      
    }catch (error) {
        next(error);
    }  
};


const signout = async (req, res) => {
    res.clearCookie('access_token').status(200).json({ message: 'User signed out successfully' });
};


module.exports = {
    signup,
    signin,
    signout
};
