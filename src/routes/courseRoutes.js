const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.route('/')
    .get(courseController.getAllCourses)
    .post(protect, authorizeRoles('ADMIN', 'EMPLOYEE'), courseController.createCourse);

router.route('/:id')
    .get(courseController.getCourseById)
    .put(protect, authorizeRoles('ADMIN', 'EMPLOYEE'), courseController.updateCourse)
    .delete(protect, authorizeRoles('ADMIN', 'EMPLOYEE'), courseController.deleteCourse);

module.exports = router;
