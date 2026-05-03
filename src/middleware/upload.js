const multer = require('multer');

// Configure multer to use memory storage. This is better for serverless environments
// and avoids saving temporary files to disk before uploading to Cloudinary.
const storage = multer.memoryStorage();

// File filter to accept only images and videos
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Unsupported file type! Please upload only images or videos.'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB max file size (useful for larger course videos)
    },
    fileFilter: fileFilter
});

module.exports = upload;
