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
const downloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');



app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(cookieParser() );
app.use(express.urlencoded({extended: true}));
app.use('/uploads', express.static(__dirname+'/uploads'));

mongoose.connect(process.env.MONGO_URL);



app.use('/auth', authRoute );
app.use('/place', placeRoute );
app.use('/booking',bookingRoute);
app.use('/user', userRoute );



app.post('/imageUploader', async(req, res, next) => {
  try {
    const {link} = req.body;
    if (!link) {
    return res.json({success: false, message: 'No link provided'});
    }
    const newName = 'photo' + Date.now() + '.jpg';
    await downloader.image({
      url: link,	
      dest: __dirname +'/uploads/'+newName,
    });
    res.json({success: true, message: 'Image downloaded successfully', filename: newName});
  } catch (error) {
    res.json({success: false, message: 'Error downloading image'});
  }
});


const photoStorage = multer({dest:'uploads/'});

app.post('/download',photoStorage.array('photos',100), async(req, res) => {
  const uploadedFiles = []
  for (let i = 0; i < req.files.length; i++) {
    const {path,originalname} = req.files[i];
    if (!path) {
      return res.json({success: false, message: 'No file provided'});
    }
    const parts = originalname.split('.');
    const extension = parts[parts.length - 1];
    const newPath = path+'.'+extension;
    fs.renameSync(path,newPath);
    uploadedFiles.push(newPath);
  }
  res.json({success:true, message:"Photos uploaded successfully" ,uploadedFiles});
});




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