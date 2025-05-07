const jwt = require('jsonwebtoken');


const userAuth = async (req, res, next) => {
    
    const {token} = req.cookies;  
    if (!token) return res.status(404).json({ message: 'Unauthorized No token' });
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.id) {
            req.userId = decoded.id;
        }else{
            return res.json({success: false, message: 'Unauthorized Login Again' });
        }
        next();
    }catch (error) {
        console.error('JWT verification error:', error.message);
        res.json({ success: false, message: error.message });
    }
};

module.exports = { userAuth };