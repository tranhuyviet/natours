const express = require('express');

const router = express.Router({ mergeParams: true });

const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

// POST /tours/tourId/reviews : post review in The tour (tourId)
// GET /tours/tourId/reviews : get all revies in The tour (tourId)
router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(
        authController.protect,
        authController.restrictTo('user'),
        reviewController.createReview
    );

module.exports = router;
