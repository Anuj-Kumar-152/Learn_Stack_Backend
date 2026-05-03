const express = require('express');
const router = express.Router();
const courseVideoController = require('../controllers/courseVideoController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const upload = require('../middleware/upload');

router.route('/')
    .get(courseVideoController.getAllCourseVideos)
    .post(protect, authorizeRoles('ADMIN', 'EMPLOYEE'), upload.single('video'), courseVideoController.createCourseVideo);

router.route('/:id')
    .get(courseVideoController.getCourseVideoById)
    .put(protect, authorizeRoles('ADMIN', 'EMPLOYEE'), upload.single('video'), courseVideoController.updateCourseVideo)
    .delete(protect, authorizeRoles('ADMIN', 'EMPLOYEE'), courseVideoController.deleteCourseVideo);

module.exports = router;
