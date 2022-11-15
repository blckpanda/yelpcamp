const { number, string } = require('Joi');
const Joi = require('Joi');


module.exports.campgroundSchema  = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number(), // isse required krne pr price is required error aa rhi hai check kiya but unable to sort right now
        // image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
}); //this is not mongoose schma this will validate our data before we can attempt to save it with mangoose 

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required(),
        body: Joi.string().required()
    }).required()
})
 
// review: {
    // rating: number,
    // body: string
// }
