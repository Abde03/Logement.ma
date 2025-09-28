const { bufferToStream } = require('../middleware/multer');
const cloudinary = require('../utils/cloudinary');

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

// Utility function to validate image URLs
const isValidImageUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

// Utility function to validate file types
const isValidImageType = (mimetype) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  return allowedTypes.includes(mimetype);
};

const imageUploaderByLink = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return sendError(res, 'Authentication required', 401);
        }
        
        const { link } = req.body;
        if (!link) {
            return sendError(res, 'Image URL is required', 400);
        }
        
        if (!isValidImageUrl(link)) {
            return sendError(res, 'Invalid image URL format', 400);
        }
        
        const result = await cloudinary.uploader.upload(link, {
            folder: 'logement-ma/images',
            transformation: [
                { width: 1200, height: 800, crop: 'limit' },
                { quality: 'auto' },
                { fetch_format: 'auto' }
            ],
            resource_type: 'image'
        });
        
        return sendResponse(res, true, 'Image uploaded successfully', {
            url: result.secure_url,
            public_id: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format
        });
        
    } catch (error) {
        console.error('Image upload by link error:', error);
        
        if (error.message && error.message.includes('Invalid image file')) {
            return sendError(res, 'Invalid image file. Please check the URL and try again.', 400);
        }
        
        return sendError(res, 'Failed to upload image. Please try again.');
    }  
};

const imageUploader = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return sendError(res, 'Authentication required', 401);
        }
        
        if (!req.files || req.files.length === 0) {
            return sendError(res, 'No files uploaded', 400);
        }
        
        // Validate file count (max 10 images)
        if (req.files.length > 10) {
            return sendError(res, 'Maximum 10 images allowed per upload', 400);
        }
        
        // Validate each file
        for (const file of req.files) {
            if (!isValidImageType(file.mimetype)) {
                return sendError(res, `Invalid file type: ${file.mimetype}. Only JPEG, PNG, WebP, and GIF are allowed.`, 400);
            }
            
            // Check file size (max 5MB per file)
            if (file.size > 5 * 1024 * 1024) {
                return sendError(res, `File too large: ${file.originalname}. Maximum size is 5MB per file.`, 400);
            }
        }
        
        // Upload all files concurrently using Promise.all
        const uploadPromises = req.files.map(file => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'logement-ma/images',
                        transformation: [
                            { width: 1200, height: 800, crop: 'limit' },
                            { quality: 'auto' },
                            { fetch_format: 'auto' }
                        ],
                        resource_type: 'image'
                    },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve({
                                url: result.secure_url,
                                public_id: result.public_id,
                                width: result.width,
                                height: result.height,
                                format: result.format,
                                originalName: file.originalname
                            });
                        }
                    }
                );
                bufferToStream(file.buffer).pipe(stream);
            });
        });
        
        const uploadedFiles = await Promise.all(uploadPromises);
        
        return sendResponse(res, true, `${uploadedFiles.length} image(s) uploaded successfully`, {
            uploadedFiles,
            count: uploadedFiles.length
        });
        
    } catch (error) {
        console.error('Image upload error:', error);
        return sendError(res, 'Failed to upload images. Please try again.');
    }
};


module.exports = {
    imageUploaderByLink,
    imageUploader,
};
