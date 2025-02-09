const pool = require('./../models/pool');
const passport = require('passport');
const bcrypt = require('bcryptjs');

module.exports = {
  index: function (req, res) {
    res.render('index', { user: req.user });
  },

  renderSignUp: function (req, res) {
    res.render('sign-up-form', {});
  },

  signUp: async function (req, res, next) {
    try {
      const hashedPassword = await bcrypt.hash(req.body.pw, 10);
      await pool.query(
        'insert into users (fname, lname, uname, pw, status) values ($1, $2, $3, $4, $5)',
        [req.body.fname, req.body.lname, req.body.uname, hashedPassword, 0]
      );
      res.redirect('/login');
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  renderLogIn: function (req, res) {
    res.render('log-in-form', {});
  },

  logIn: function (req, res, next) {
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
    })(req, res, next);
  },

  logout: function (req, res, next) {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  },

  checkAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }

    res.redirect('/login');
  },

  checkNotAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/');
    }
    next();
  },
};
