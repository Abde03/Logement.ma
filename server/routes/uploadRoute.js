const express = require('express');
const { imageUploader, imageUploaderByLink } = require('../controllers/uploadCtrl');
const {upload} = require('../middleware/multer');
const { userAuth } = require('../middleware/userAuth');

const router = express.Router();

router.post('/', userAuth, upload.array('photos',10), imageUploader);
router.post('/by-link', userAuth, imageUploaderByLink);

module.exports = router;