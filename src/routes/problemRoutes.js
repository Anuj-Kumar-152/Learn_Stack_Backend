const express = require('express');
const router = express.Router();
const problemController = require('../controllers/problemController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.route('/')
    .get(problemController.getAllProblems)
    .post(protect, authorizeRoles('ADMIN', 'EMPLOYEE'), problemController.createProblem);

router.route('/:id')
    .get(problemController.getProblemById)
    .put(protect, authorizeRoles('ADMIN', 'EMPLOYEE'), problemController.updateProblem)
    .delete(protect, authorizeRoles('ADMIN', 'EMPLOYEE'), problemController.deleteProblem);

module.exports = router;