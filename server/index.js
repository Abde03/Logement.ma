const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/authRoute');
const placeRoute = require('./routes/placeRoute');
const bookingRoute = require('./routes/bookRoute');
const userRoute = require('./routes/userRoute');
const uploadRoute = require('./routes/uploadRoute');

app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  withCredentials: true,
}));
app.use(cookieParser() );
app.use(express.urlencoded({extended: true}));
app.use('/uploads', express.static(__dirname+'/uploads'));


mongoose.connect(process.env.MONGO_URL);


app.use('/auth', authRoute );
app.use('/place', placeRoute );
app.use('/booking',bookingRoute);
app.use('/user', userRoute );
app.use('/upload', uploadRoute);


app.use((err, res) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode
  });
});

app.listen(4000, () => {
  console.log('Server is running ...');
}); 