const { body, validationResult } = require('express-validator');

const validateUserRegistration = [
    body('username')
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Email must be a valid email address'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const validateUserLogin = [
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Email must be a valid email address'),
    body('password')
        .notEmpty().withMessage('Password is required'),
];

const validateProjectInput = [
    body('title')
        .notEmpty().withMessage('Project title is required'),
    body('description')
        .notEmpty().withMessage('Project description is required'),
    body('techStack')
        .notEmpty().withMessage('Tech stack is required'),
];

const validateResumeInput = [
    body('name')
        .notEmpty().withMessage('Name is required'),
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Email must be a valid email address'),
    body('experience')
        .isArray().withMessage('Experience must be an array'),
];

const validateRoadmapInput = [
    body('careerPath')
        .notEmpty().withMessage('Career path is required'),
];

const validateInput = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    validateUserRegistration,
    validateUserLogin,
    validateProjectInput,
    validateResumeInput,
    validateRoadmapInput,
    validateInput,
};