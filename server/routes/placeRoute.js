const express = require('express');
const {
    createPlace, 
    getUserPlaces, 
    getPlaceById, 
    updatePlace, 
    getAllPlaces, 
    deletePlace 
} = require('../controllers/placeCtrl');
const {userAuth} = require('../middleware/userAuth');

const router = express.Router();

router.get('/' ,getAllPlaces);
router.get('/:id', getPlaceById);
router.post('/new', userAuth, createPlace );
router.post('/user', userAuth, getUserPlaces);
router.put('/update/:id', userAuth, updatePlace);
router.delete('/delete/:id', userAuth, deletePlace);



module.exports = router;