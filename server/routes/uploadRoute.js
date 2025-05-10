const express = require('express');
const { imageUploader, imageUploaderByLink } = require('../controllers/uploadCtrl');
const {upload} = require('../middleware/multer');


const router = express.Router();

router.post('/', upload.array('photos',10), imageUploader);
router.post('/by-link', imageUploaderByLink);


module.exports = router;