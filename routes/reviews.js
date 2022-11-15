const express = require('express');
const router = express.Router({ mergeParams: true }); // need to watch 490 at 4:30
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground'); //exported to middleware file
const Review = require('../models/review')
const reviews = require('../controllers/reviews')






// making for the reviews
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewID', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;