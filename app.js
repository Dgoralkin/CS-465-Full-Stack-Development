var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Setup routes for page navigation
var indexRouter = require('./app_server/routes/index');         // Update the path for the homepage
var usersRouter = require('./app_server/routes/users');         // Update the path for the users page
var travelRouter = require('./app_server/routes/travel');       // Update the path for the travel page
var handelbars = require('hbs');                                // Enable handlebars to render in multipal pages

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));  // Update the path for the new app_server dir

// register the call to enable partials handlebars:
handelbars.registerPartials(path.join(__dirname, 'app_server', 'views', 'partials'));

app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Activate the page
app.use('/', indexRouter);            // Go to homepage.
app.use('/users', usersRouter);       // Go to users.
app.use('/travel', travelRouter);     // Go to travel page.

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
