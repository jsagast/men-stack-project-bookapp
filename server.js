const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');

const authController = require('./controllers/auth.js');
const booksController = require('./controllers/books.js');
const bookClubController = require('./controllers/bookClub.js');
const usersController=require('./controllers/users.js')
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');


const port = process.env.PORT ? process.env.PORT : '3000';

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use(passUserToView);

app.get('/', (req, res) => {
  if (req.session.user) {// Redirect signed-in users to their books index
    res.redirect('/users/profile');
  } else {// Show the homepage for users who are not signed in
    res.render('index.ejs');
  }
});

app.use('/auth', authController);

app.use(isSignedIn);

app.use('/books', booksController);
app.use('/bookclubs', bookClubController);
app.use('/users', usersController)
 

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
