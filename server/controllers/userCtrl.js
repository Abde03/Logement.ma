const UserModel = require("../models/User");

const getUserData = async(req, res) => {
    try{
        const userId = req.userId;
        const user = await UserModel.findById(userId);
        
        if (!user) {
            return res.json({ success: false, message: 'User Not found' });
        }

        res.json({ success: true, userData: {
            name : user.name,
            id : user._id,
            isAccountVerified : user.isAccountVerified,
        }  });
    }catch(error){
        res.json({ success: false, message: 'Error fetching user data' });
    }  
    
}


module.exports = {
    getUserData
};