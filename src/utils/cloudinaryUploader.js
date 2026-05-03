const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

/**
 * Uploads a file buffer to Cloudinary using streamifier.
 * @param {Buffer} fileBuffer - The file buffer from multer.
 * @param {String} folder - The destination folder in Cloudinary.
 * @param {String} resourceType - The resource type ('image', 'video', 'auto').
 * @returns {Promise<Object>} - The Cloudinary upload result.
 */
const uploadToCloudinary = (fileBuffer, folder = 'learnstack', resourceType = 'auto') => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: folder, resource_type: resourceType },
            (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        );
        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
};

/**
 * Deletes a file from Cloudinary given its public_id.
 * @param {String} publicId - The public_id of the resource in Cloudinary.
 * @param {String} resourceType - The resource type ('image', 'video').
 * @returns {Promise<Object>} - The Cloudinary destruction result.
 */
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
    return await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
};

module.exports = {
    uploadToCloudinary,
    deleteFromCloudinary
};
