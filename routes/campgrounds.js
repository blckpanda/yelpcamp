const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
// const { campgroundSchema } = require('../schemas.js') ;//taking in both from Joi
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const multer = require('multer');// using multer middleware here
const { storage } = require('../cloudinary'); //checking
const upload = multer({ storage });


// const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');





router.get('/', catchAsync(campgrounds.index)); // this is coming from campgrounds controllers

router.get('/new', isLoggedIn, campgrounds.renderNewForm)


// router.post('/',isLoggedIn, validateCampground, catchAsync(campgrounds.createCampgrorund))
// router.post('/', upload.array('image'), (req, res) => {
    // console.log(req.body, req.files);
    // res.send("It worked");
// });
//date 11 nov modify

router.post('/', upload.single('image'), (req, res) => {
    console.log(req.body, req.file);
})


router.get('/:id', catchAsync(campgrounds.showCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm)); 

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));


module.exports = router;