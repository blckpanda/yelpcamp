const Campground = require('../models/campground'); //exported to middleware file
const Review = require('../models/review')


module.exports.createReview  = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review)
    review.author = req.user._id;//only for current user
    campground.reviews.push(review) //we set reviews in campgrounds models
    await review.save();
    await campground.save();
    req.flash('sucess', 'Created new Review!')
   res.redirect(`/campgrounds/${campground._id}`); 
}


module.exports.deleteReview = async (req, res) => {
    const { id, reviewID } = req.params; // destructure that params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewID}});// without the update this will delete the all content availbkle in the card which is everything
    //here we are using pull operator which availble in mongoose 
    await Review.findByIdAndDelete(reviewID);
    res.redirect(`/campgrounds/${id}`);// use string templete litrals
    req.flash('success', 'Successfully Deleted a Review') 
    //some time redirect can be a problems like did't put the / or spelling  
}