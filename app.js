var express = require('express');
var path = require('path');
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

var app = express();

const dev_db_url = `mongodb+srv://admin:${MongoDBKey}@cluster0.lnrds0m.mongodb.net/inventory_application?retryWrites=true&w=majority`;
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

main().catch((err) => debug(err));
async function main() {
  await mongoose.connect(mongoDB);
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));
app.use('/', routes);

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
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
