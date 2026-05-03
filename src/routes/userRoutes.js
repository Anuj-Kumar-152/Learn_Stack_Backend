const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Both ADMIN and EMPLOYEE can view users list
router.get('/', protect, authorizeRoles('ADMIN', 'EMPLOYEE'), userController.getAllUsers);
// Only ADMIN can create users
router.post('/', protect, authorizeRoles('ADMIN'), userController.createAdminOrEmployee);

// Get user details - accessible to ADMIN and EMPLOYEE
router.get('/:id', protect, authorizeRoles('ADMIN', 'EMPLOYEE'), userController.getUserById);
// Update user - accessible to ADMIN and EMPLOYEE (but with restrictions in service)
router.put('/:id', protect, authorizeRoles('ADMIN', 'EMPLOYEE'), userController.updateUser);
// Delete user - ADMIN ONLY
router.delete('/:id', protect, authorizeRoles('ADMIN'), userController.deleteUser);

module.exports = router;