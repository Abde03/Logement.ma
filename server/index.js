const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/authRoute');
const placeRoute = require('./routes/placeRoute');
const bookingRoute = require('./routes/bookRoute');
const downloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');



app.use(express.json());
app.use(cors());
app.use(cookieParser() );
app.use(express.urlencoded({extended: true}));
app.use('/uploads', express.static(__dirname+'/uploads'));

mongoose.connect(process.env.MONGO_URL);

//RCg9CPD5haMGeyYZ
//mongodb+srv://abde:RCg9CPD5haMGeyYZ@cluster0.jmvkybh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });



app.use('/auth', authRoute );
app.use('/place', placeRoute );
app.use('/booking',bookingRoute);


app.post('/imageUploader', async(req, res, next) => {
  const {link} = req.body;
  const newName = 'photo' + Date.now() + '.jpg';
  await downloader.image({
    url: link,	
    dest: __dirname +'/uploads/'+newName,
  });
  res.json(newName);
});


const photoStorage = multer({dest:'uploads/'});

app.post('/download',photoStorage.array('photos',100), async(req, res, next) => {
  const uploadedFiles = []
  for (let i = 0; i < req.files.length; i++) {
    const {path,originalname} = req.files[i];
    const parts = originalname.split('.');
    const extension = parts[parts.length - 1];
    const newPath = path+'.'+extension;
    console.log(newPath);
    console.log(path);
    console.log(originalname);
    fs.renameSync(path,newPath);
    uploadedFiles.push(newPath);
  }
  res.json(uploadedFiles);
});


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode
  });
});


app.listen(4000, () => {
  console.log('Server is running on http://localhost:4000');

}); 