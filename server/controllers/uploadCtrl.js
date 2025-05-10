const { bufferToStream } = require('../middleware/multer');
const cloudinary = require('../utils/cloudinary');


const imageUploaderByLink = async (req, res) => {
    try {
        const { link } = req.body;
        if (!link) {
            return res.status(400).json({ success: false, message: 'No link provided' });
        }
        const result = await cloudinary.uploader.upload(link, {
            upload_preset: 'ml_default',
        });
        
        return res.json({
            success: true,
            message: 'Image uploaded successfully',
            url: result.secure_url,
            public_id: result.public_id,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error uploading image' });
    }  
}

const imageUploader = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const uploadedFiles = [];

        for (const file of req.files) {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'uploads' },
            (error, result) => {
            if (error) throw error;
            uploadedFiles.push({
                url: result.secure_url,
                public_id: result.public_id,
            });

            if (uploadedFiles.length === req.files.length) {
                return res.status(200).json({
                success: true,
                message: 'Images uploaded successfully',
                uploadedFiles,
                });
            }
            }
        );
        bufferToStream(file.buffer).pipe(stream);
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error uploading images' });
    }
}


module.exports = {
    imageUploaderByLink,
    imageUploader,
};
