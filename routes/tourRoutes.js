const express = require('express');

const router = express.Router();
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');

// router.param('id', tourController.checkId);
router
    .route('/top-5-cheap')
    .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
    .route('/')
    .get(authController.protect, tourController.getAllTours)
    .post(tourController.createTour);

router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.deleteTour
    );

// Nested Routes
// POST /tours/tourId/reviews : post review in The tour (tourId)
// GET /tours/tourId/reviews : get all revies in The tour (tourId)
// GET /tour/tourId/reviews/reviewId: get a review in a tour

router
    .route('/:tourId/reviews')
    .post(
        authController.protect,
        authController.restrictTo('user'),
        reviewController.createReview
    );

module.exports = router;
