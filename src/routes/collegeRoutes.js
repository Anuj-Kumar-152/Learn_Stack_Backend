const express = require('express');
const router = express.Router();
const collegeController = require('../controllers/collegeController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.route('/')
    .get(collegeController.getAllColleges)
    .post(protect, authorizeRoles('ADMIN', 'EMPLOYEE'), collegeController.createCollege);

router.route('/:id')
    .get(collegeController.getCollegeById)
    .put(protect, authorizeRoles('ADMIN', 'EMPLOYEE'), collegeController.updateCollege)
    .delete(protect, authorizeRoles('ADMIN', 'EMPLOYEE'), collegeController.deleteCollege);

module.exports = router;
