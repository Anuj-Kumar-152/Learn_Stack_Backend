const express = require('express');
const router = express.Router();
const skillsController = require('../controllers/skillsController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, skillsController.createSkill);

router.route('/me')
    .get(protect, skillsController.getMySkills);

router.route('/user/:userId')
    .get(protect, skillsController.getUserSkills);

router.route('/:id')
    .put(protect, skillsController.updateSkill)
    .delete(protect, skillsController.deleteSkill);

module.exports = router;
