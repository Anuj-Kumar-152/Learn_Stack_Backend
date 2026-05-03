const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.route('/')
    .post(protect, upload.single('avatar'), profileController.createProfile);

router.route('/me')
    .get(protect, profileController.getMyProfile);

router.route('/user/:userId')
    .get(protect, profileController.getProfileByUserId);

router.route('/:id')
    .put(protect, upload.single('avatar'), profileController.updateProfile)
    .delete(protect, profileController.deleteProfile);

module.exports = router;
