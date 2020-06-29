const User = require('../models/user');
const passport = require('passport');
const viewPath = 'sessions';

exports.new = (req, res) => {
  res.render(`${viewPath}/new`, {
    pageTitle: 'Login'
  });
};

exports.create = (req, res, next) => {
  // add the authentication logic here
  passport.authenticate("local", {
    successRedirect: "/reservations",
    successFlash: 'Logged in',
    failureRedirect: "/login",
    failureFlash: 'Invalid username or password.'
  })(req, res, next)

};

exports.delete = (req, res) => {
  req.logout();
  req.flash('primary', 'You were logged out.');
  res.redirect('/');
};