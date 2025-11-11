const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const roadmapController = require('../controllers/roadmap.controller');
const portfolioController = require('../controllers/portfolio.controller');
const resumeController = require('../controllers/resume.controller');
const adminController = require('../controllers/admin.controller');

// Auth routes
router.post('/login', authController.login);
router.post('/signup', authController.signup);

// Roadmap routes
router.get('/roadmap/:userId', roadmapController.getRoadmap);
router.post('/roadmap', roadmapController.createRoadmap);
router.put('/roadmap/:id', roadmapController.updateRoadmap);

// Portfolio routes
router.get('/portfolio/:userId', portfolioController.getPortfolio);
router.post('/portfolio', portfolioController.addProject);
router.put('/portfolio/:id', portfolioController.updateProject);
router.delete('/portfolio/:id', portfolioController.deleteProject);

// Resume routes
router.get('/resume/:userId', resumeController.getResume);
router.post('/resume', resumeController.createResume);
router.put('/resume/:id', resumeController.updateResume);

// Admin routes
router.get('/admin/users', adminController.getAllUsers);
router.put('/admin/users/:id', adminController.updateUser);
router.delete('/admin/users/:id', adminController.deleteUser);

module.exports = router;