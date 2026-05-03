const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.route('/')
    .get(topicController.getAllTopics)
    .post(protect, authorizeRoles('ADMIN', 'EMPLOYEE'), topicController.createTopic);

router.get('/subject/:subjectId', topicController.getTopicsBySubject);

router.route('/:id')
    .get(topicController.getTopicById)
    .put(protect, authorizeRoles('ADMIN', 'EMPLOYEE'), topicController.updateTopic)
    .delete(protect, authorizeRoles('ADMIN', 'EMPLOYEE'), topicController.deleteTopic);

module.exports = router;
