if (process.env.NODE_ENV !== "production") {//enviorment variable that take out the .env from production 
    require('dotenv').config();
}

// console.log(process.env.API_KEY)
// console.log(process.env.SECRET)


const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');// require the engine to view okay
const session = require('express-session');
const flash = require('connect-flash');
// const Joi = require('joi');
// const { campgroundSchema, reviewSchema } = require('./schemas.js') ;//taking in both from Joi // moved to the files 
// const catchAsync = require('./utils/catchAsync') moved to the files 
const ExpressError = require('./utils/ExpressError');
const methodOverride =require('method-override');
// const Campground = require('./models/campground');// moved to the reviews.js
// const Review = require('./models/review')// moved to the reviews.js
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');



mongoose.connect('mongodb://localhost:27017/book-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
})

const app = express();

app.engine('ejs', ejsMate)// see the engine thing we are using
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true}))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = { // everything about session
    secret: 'thissholdbebettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expire: Date.now() + 1000 * 60 *60 *24 *7,
        maxAge:  1000 * 60 *60 *24 *7
    }
}


app.use(session(sessionConfig)) //here it is working session
app.use(flash());

app.use(passport.initialize()); // starting the passport
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); // we can say store it and 
passport.deserializeUser(User.deserializeUser());// unstore it

app.use((req, res, next) => { // this will come before any route handlears
    console.log(req.session) // only to see what is going on 
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');//these local are everywhere we can use them anywhere in file
    res.locals.error = req.flash('error');
    next(); // including this is vary important 
})

// app.get('/fakeUser', async(req, res) => { // used as to test the method that are working
    // const user = new User({ email: 'sau@gmail.com', username: 'sau'});
    // const newUser = await User.register(user, 'justpass')// we will call register method
    // res.send(newUser);
// })
app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)
// ** moved to another file but we are saving them okay 



// 
const validateCampground = (req, res, next) => {
    
    const { error } = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else {
        next();
    }
}




// 
// app.get('/campgrounds', catchAsync(async (req, res) => {
    // const campgrounds = await Campground.find({});
    // res.render('campgrounds/index', { campgrounds })
// }));
// 
// app.get('/campgrounds/new', (req, res) => {
    // res.render('campgrounds/new');
// })
// 
// 
// app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => { // this second parameter will validate the form okay
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    // 
    // const campground = new Campground(req.body.campground);
    // await campground.save();
    // res.redirect(`/campgrounds/${campground._id}`)
// 
// }))
// 
// 
// app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    // const campground = await Campground.findById(req.params.id).populate('reviews');//this req.params.id is give the particular id
    // 
    // res.render('campgrounds/show', { campground });// here we see this
// }));
// 
// app.get('/campgrounds/:id/edit', catchAsync(async(req, res) =>{
    // const campground = await Campground.findById(req.params.id)
    // res.render('campgrounds/edit', { campground });
// })); //we are editing so we could pre populate the form with the information, so here we async function
// 
// app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    // const { id } = req.params;
    // const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});// taking what is body.campground so here we used sprede operator
    // res.redirect(`/campgrounds/${campground._id}`)// this will redirect to show page that we updated
// }))
// app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    // const { id } = req.params;
    // await Campground.findByIdAndDelete(id);
    // res.redirect('/campgrounds');
// }));

// making for the reviews ** moving this into reviews file
// app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
    // const campground = await Campground.findById(req.params.id);
    // const review = new Review(req.body.review)
    // campground.reviews.push(review) //we set reviews in campgrounds models
    // await review.save();
    // await campground.save();
//    res.redirect(`/campgrounds/${campground._id}`); 
// }));

// app.delete('/campgrounds/:id/reviews/:reviewID', catchAsync(async (req, res) => {
    // const { id, reviewID } = req.params; // destructure that params
    // await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewID}});// without the update this will delete the all content availbkle in the card which is everything
    //here we are using pull operator which availble in mongoose 
    // await Review.findByIdAndDelete(reviewID);
    // res.redirect(`/campgrounds/${id}`);// use string templete litrals 
    // some time redirect can be a problems like did't put the / or spelling  
// }))
// 
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = ('oh NO, something went wrong !!!!!!!');
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('serving on port 3000')
})