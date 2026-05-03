const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.route('/')
    .get(subjectController.getAllSubjects)
    .post(protect, authorizeRoles('ADMIN', 'EMPLOYEE'), subjectController.createSubject);

router.route('/:id')
    .get(subjectController.getSubjectById)
    .put(protect, authorizeRoles('ADMIN', 'EMPLOYEE'), subjectController.updateSubject)
    .delete(protect, authorizeRoles('ADMIN', 'EMPLOYEE'), subjectController.deleteSubject);

module.exports = router;
