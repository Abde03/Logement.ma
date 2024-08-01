const PlaceModel = require('../models/Places');

const createPlace = async (req, res, next) => {

    const { 
        title, adress, description, perks ,
        extraInfo, checkIn, checkOut, maxGuests, price, addedPhotos ,CurrentUser
    } = req.body;
        const newPlace = await PlaceModel.create({
            owner : CurrentUser._id,
            title, adress, description, perks, extraInfo, checkIn, checkOut, maxGuests, price, images:addedPhotos
        });
        res.status(201).json(newPlace);
};

const getUserPlaces = async (req, res, next) => {
    try {
        const userID = req.query.userID;

        if (!userID) {
            return res.status(400).json({ error: 'CurrentUser or CurrentUser._id is missing' });
        }

        const places = await PlaceModel.find({ owner: userID });

        res.json(places);
        
    } catch (error) {
        console.error('Error fetching places:', error);
        res.status(500).json({ error: 'An error occurred while fetching places' });
    }
};

const getPlace = async (req, res, next) => {
    const {id} = req.params;
    res.json(await PlaceModel.findById(id));
}

const updatePlace = async (req, res, next) => {
    const userID = req.body.CurrentUser._id;
    console.log(req.body);
    
    const {
        id, 
        title, adress, description, perks ,
        extraInfo, checkIn, checkOut, maxGuests, price, addedPhotos ,CurrentUser
    } = req.body;
    const placeDoc = await PlaceModel.findById(id);
    console.log(placeDoc.owner);
    console.log(userID);
    if (userID !== placeDoc.owner.toString()) {
        return res.status(403).json({ error: 'Unauthorized' });
    }else{
        placeDoc.set({
            title, adress, description, perks, extraInfo, checkIn, checkOut, maxGuests, price, images:addedPhotos
        });
        await placeDoc.save();
        res.json(placeDoc);
    }
}

const getAllPlaces = async (req, res, next) => {
    res.json(await PlaceModel.find());
}


module.exports = {  
    createPlace,
    getUserPlaces,
    getPlace,
    updatePlace,
    getAllPlaces
};