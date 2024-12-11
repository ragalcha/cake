const express = require("express");
const router = express.Router();
const userController = require("../app/http/controllers/admin/userController");

// Admin User CRUD Routes
router.get('/', userController().index); // View all users
router.get('/create', userController().create); // Create user form
router.post('/create', userController().store); // Store user
router.get('/:id/edit', userController().edit); // Edit user form
router.post('/:id/edit', userController().update); // Update user
router.post('/:id/delete', userController().delete); // Delete user

module.exports = router;
