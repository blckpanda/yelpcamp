const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,// one to many relationship we are trying to establish here
            ref: 'Review'//see the first latter is capatalize is Review not review okay 
            //you need to focus here 
        }
    ] 
});

CampgroundSchema.post('findOneAndDelete', async function (doc) { // findoneanddelete this was we used in to delete the full campground so if we change that this will not trigger the middleware and this won't work
    if (doc) {
        await Review.deleteMany({
            _id: doc.reviews
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);
//for export we have to compile the model name of campground then the schema is campground schema