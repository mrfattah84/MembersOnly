const path = require('node:path');
const express = require('express');
const pool = require('./models/pool');
const session = require('express-session');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(session({ secret: 'cats', resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

passport.use(
  new LocalStrategy(
    { usernameField: 'uname', passwordField: 'pw' },
    async (username, password, done) => {
      try {
        const { rows } = await pool.query(
          'SELECT * FROM users WHERE uname = $1',
          [username]
        );
        const user = rows[0];

        if (!user) {
          return done(null, false, { message: 'Incorrect username' });
        }
        const match = await bcrypt.compare(password, user.pw);
        if (!match) {
          return done(null, false, { message: 'Incorrect password' });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [
      id,
    ]);
    const user = rows[0];

    done(null, user);
  } catch (err) {
    done(err);
  }
});

const indexRouter = require('./routes/indexRoute');
app.use('/', indexRouter);

const signupRouter = require('./routes/signUpRoute');
app.use('/signup', signupRouter);

const logInRouter = require('./routes/logInRoute');
app.use('/login', logInRouter);

const controller = require('./controllers/mainController');
app.use('/logout', controller.logout);
app.post('/member', controller.member)

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
