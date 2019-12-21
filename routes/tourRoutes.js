const express = require('express');

const router = express.Router();

// const { getAllTours, createTour, getTour, updateTour, deleteTour } = require('../controllers/tourController');

const tourController = require('./../controllers/tourController');

router
    .route('/')
    .get(tourController.getAllTours)
    .post(tourController.createTour);

router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = router;
