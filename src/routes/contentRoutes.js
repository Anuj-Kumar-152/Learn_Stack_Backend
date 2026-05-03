const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.route('/')
    .get(contentController.getAllContents)
    .post(protect, authorizeRoles('ADMIN', 'EMPLOYEE'), contentController.createContent);

// Get content by topic - MUST come before /:id to avoid route conflict
router.get('/topic/:topicId', contentController.getContentsByTopic);

router.route('/:id')
    .get(contentController.getContentById)
    .put(protect, authorizeRoles('ADMIN', 'EMPLOYEE'), contentController.updateContent)
    .delete(protect, authorizeRoles('ADMIN', 'EMPLOYEE'), contentController.deleteContent);

module.exports = router;
