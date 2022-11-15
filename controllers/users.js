
const User = require('../models/user');

module.exports.renderRegister =(req, res) => {
    res.render('users/register');
}

module.exports.register =  async(req, res) => {
    try{
        const { email, username, password } = req.body;//destructre it okay
        const user = User({ email, username });
        const registerUser = await User.register(user, password);
        req.login(registerUser, err => {
        if(err) return next(err);
        req.flash('success', 'Welcome to Yelp Camp');//need to specifiy the key otherwise it won't work
        res.redirect('/campgrounds');
    })
    } catch(e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}

module.exports.renderLogin =(req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => { // passport.authenticate is a middleware that help us to verify the details from user
    req.flash('success', 'Welcome Back!!!')
    const redirectUrl =  req.session.returnTo || '/campgrounds'; 
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {//fixed it by myslf
    req.logout(function(err) {
        if (err) { 
            return next (err);
        }
        req.flash('success', 'GoodBye!!!');
        res.redirect('/campgrounds');
    });
}


