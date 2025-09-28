const UserModel = require("../models/User");

// Helper functions for consistent API responses
const sendResponse = (res, success, message, data = null, statusCode = 200) => {
  const response = { success, message };
  if (data) response.data = data;
  return res.status(statusCode).json(response);
};

const sendError = (res, message, statusCode = 500) => {
  return res.status(statusCode).json({ 
    success: false, 
    message 
  });
};

const getUserData = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return sendError(res, 'Authentication required', 401);
        }
        
        const user = await UserModel.findById(userId)
            .select('name email isAccountVerified createdAt')
            .lean();
        
        if (!user) {
            return sendError(res, 'User not found', 404);
        }

        return sendResponse(res, true, 'User data retrieved successfully', {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAccountVerified: user.isAccountVerified,
                memberSince: user.createdAt
            }
        });
        
    } catch (error) {
        console.error('Get user data error:', error);
        return sendError(res, 'Failed to retrieve user data. Please try again.');
    }
};

module.exports = {
    getUserData
}