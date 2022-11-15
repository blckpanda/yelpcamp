const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers')
const Campground = require('../models/campground')

//making this different, we will excute this file seperatly and we can seed our data directly to db

mongoose.connect('mongodb://localhost:27017/book-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
})

const sample = array => array[Math.floor(Math.random() * array.length)]; // random num multiple with length and then we access out of the array


const seedDB = async () => {// deleting all data on DB and creating fake data for just checking
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author:'6357adb099347cc95e73a12d',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image:'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis corporis explicabo, assumenda nobis quia facere',
            price
        })
        await camp.save();
    }
    
}
seedDB().then(() => {
    mongoose.connection.close();// here we close the connection with Db so we can intract with express
})