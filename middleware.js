const { campgroundSchema, reviewSchema } = require('./schemas.js') ;//taking in both from Joi
 const ExpressError = require('./utils/ExpressError');
 const Campground = require('./models/campground'); //putting file into one breake code so do carefull of that
 const Review = require('./models/review');
 //const { reviewSchema } = require('./schemas.js') ;//taking in both from Joi // above inclued




module.exports.isLoggedIn = (req, res, next) => {// making in new file help us to anywhere we want
    // console.log("REQ.USER...", req.user); //checked at git terminal
    if (!req.isAuthenticated()){
        req.flash('error', 'You must be signed In')
        return res.redirect('/login');
    }// here you have to be signed in otherwise you cant make campgrounds okay thats cool
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else {
        next();
    }
}

module.exports.isAuthor = async(req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do')
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req, res, next) => {
    const { id, reviewID } = req.params;
    const review = await Review.findById(reviewID);
    if(!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do')
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else {
        next();
    }
}


