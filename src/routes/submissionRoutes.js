const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.route('/')
    .get(protect, authorizeRoles('ADMIN', 'EMPLOYEE'), submissionController.getAllSubmissions)
    .post(protect, submissionController.createSubmission);

router.route('/me')
    .get(protect, submissionController.getMySubmissions);

router.route('/user/:userId')
    .get(protect, submissionController.getUserSubmissions);

router.route('/:id')
    .get(protect, submissionController.getSubmissionById)
    .put(protect, submissionController.updateSubmission)
    .delete(protect, submissionController.deleteSubmission);

module.exports = router;