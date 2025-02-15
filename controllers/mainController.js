const pool = require('./../models/pool');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { message } = require('prompt');

module.exports = {
  index: async function (req, res) {
    if (!req.user || (req.user.status || 0) == 0) {
      const messages = await pool.query(
        'SELECT id, title, text, img FROM messages'
      );
      console.log(messages.rows);
      res.render('index', {
        user: req.user,
        messages,
      });
    } else {
      const messages = await pool.query(
        'SELECT messages.id, title, text, img, timestamp, fname, lname  FROM messages INNER JOIN users ON messages.author_id = users.id;'
      );
      console.log(messages.rows);
      res.render('index', {
        user: req.user,
        messages,
      });
    }
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

  member: async function (req, res, next) {
    if (req.body.code === 'meow') {
      pool.query('UPDATE users SET status = 1 WHERE uname = $1', [
        req.user.uname,
      ]);
      res.redirect('/');
    } else if (req.body.code === 'admin') {
      pool.query('UPDATE users SET status = 2 WHERE uname = $1', [
        req.user.uname,
      ]);
      res.redirect('/');
    } else {
      res.redirect('/');
    }
  },

  message: async function (req, res, next) {
    try {
      await pool.query(
        'insert into messages (title, text, img, timestamp, author_id) values ($1, $2, $3, $4, $5)',
        [
          req.body.title,
          req.body.text,
          req.body.img,
          new Date().toISOString(),
          req.user.id,
        ]
      );
      res.redirect('/');
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
};
