const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true 
    }
});
UserSchema.plugin(passportLocalMongoose) // this will add on our schema a username and field for password.

module.exports = mongoose.model('User', UserSchema);
