var express = require('express');
const debug = require('debug')('app');
var path = require('path');
var createError = require('http-errors');
const session = require('express-session');
var logger = require('morgan');
require('dotenv').config();
var routes = require('./routes/index');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
var nconf = require('nconf');
require('dotenv').config();
const MongoDBKey = process.env.MONGODB_KEY;
const User = require('./models/user');

nconf.argv().env().file({ file: 'path/to/config.json' });

var app = express();

const dev_db_url = `mongodb+srv://admin:${MongoDBKey}@cluster0.lnrds0m.mongodb.net/members_only?retryWrites=true&w=majority`;
const mongoDB = dev_db_url;

mongoose.set('strictQuery', false);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      const match = await bcrypt.compare(password, user.password);

      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }
      if (!match) {
        return done(null, false, { message: 'Incorrect password' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

app.use(passport.session());

main().catch((err) => debug(err));
async function main() {
  await mongoose.connect(mongoDB);
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/public')));
app.use('/', routes);
app.use(passport.initialize());
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use(express.urlencoded({ extended: false }));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  console.log(err);

  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000, () => console.log('app listening on port 3000!'));
