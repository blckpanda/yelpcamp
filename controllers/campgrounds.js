const Campground = require('../models/campground');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampgrorund = async (req, res, next) => { // this second parameter will validate the form okay
    //if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    //isloggedin will protected the route from postman and ajax
   
    const campground = new Campground(req.body.campground);
    // campground.images =  req.files.map(f => ({ url: f.path, filename: f.filename })); //coming from upload images
    campground.author = req.user._id; // this will save the campground with author
    await campground.save();
    req.flash('success', 'Sucessfully made a new campground')
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground =async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');//this req.params.id is give the particular id //breaking in two part
    //console.log(campground); // this is using inthe show templete okay
    if(!campground) {
        req.flash('error', 'cannot find that campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground });// here we see this
}

module.exports.renderEditForm = async(req, res) =>{
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if(!campground){
        req.flash('error', 'Cannot find that campground')
        return res.redirect('/campgrounds')
    }
    //we moved the below line into middle ware
    // if(!campground.author.equals(req.user._id)){// to see you own the campground to delete and edit
        // req.flash('error', 'You do not have permission');
        // return res.redirect(`/campgrounds/${id}`);
    // }
    // const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground });
    //we are editing so we could pre populate the form with the information, so here we async function
}

module.exports.updateCampground  = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});// taking what is body.campground so here we used sprede operator
    req.flash('success', 'successfully updated campground!')
    res.redirect(`/campgrounds/${campground._id}`)// this will redirect to show page that we updated
}

module.exports.deleteCampground = async (req, res) => {
    
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted Campground')
    res.redirect('/campgrounds');
}
