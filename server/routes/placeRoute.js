const express = require('express');
const {createPlace} = require('../controllers/placeCtrl');
const {getUserPlaces} = require('../controllers/placeCtrl');
const {getPlace} = require('../controllers/placeCtrl');
const {updatePlace} = require('../controllers/placeCtrl');
const {getAllPlaces} = require('../controllers/placeCtrl');

const router = express.Router();

router.get('/' ,getAllPlaces)
router.post('/new' ,createPlace );
router.get('/user', getUserPlaces);
router.get('/:id', getPlace);
router.put('/update', updatePlace);


module.exports = router;