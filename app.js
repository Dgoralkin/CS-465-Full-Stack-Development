const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// Setup routes for page navigation
const indexRouter = require('./app_server/routes/index');         // Update the path for the homepage
const travelRouter = require('./app_server/routes/travel');       // Update the path for the travel page
const roomRouter = require('./app_server/routes/rooms');           // Update the path for the room page
const mealsRouter = require('./app_server/routes/meals');         // Update the path for the meals page
const newsRouter = require('./app_server/routes/news');           // Update the path for the news page
const aboutRouter = require('./app_server/routes/about');         // Update the path for the about page
const contactRouter  = require('./app_server/routes/contact');    // Update the path for the contact us page
const handelbars = require('hbs');                                // Enable handlebars to render in multipal pages

// Enable helper for handelbars
handelbars.registerHelper('eq', function(a, b) {
  return a === b;
});

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));    // Update the path for the new app_server dir

// register the call to enable partials handlebars:
handelbars.registerPartials(path.join(__dirname, 'app_server', 'views', 'partials'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Activate the homepage page and all other pages
app.use('/', indexRouter);            // Go to homepage (index).
app.use('/', travelRouter);           // Go to the travel page.
app.use('/', roomRouter);             // Go to the room page.
app.use('/', mealsRouter);            // Go to the room page.
app.use('/', newsRouter);             // Go to the news page.
app.use('/', aboutRouter);            // Go to the about page.
app.use('/', contactRouter);          // Go to all contact us pages.

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
