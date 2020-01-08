const express = require('express');

const router = express.Router();

const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');

router.get('/me', authController.protect, viewController.getAccount);

router.use(authController.isLoggedIn);

router.get('/', viewController.getOverview);
router.get('/tour/:slug', viewController.getTour);
router.get('/login', viewController.getLoginForm);

module.exports = router;
