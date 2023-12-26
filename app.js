const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('cookie-session');
const flash = require('connect-flash');
const expressMessages = require('express-messages');

// Start express app
const app = express();

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARES

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

// Express Messages middleware
app.use(flash());
app.use((req, res, next) => {
    res.locals.messages = expressMessages(req, res);
    next();
});

// 2) ADMIN ROUTES
app.use(function (req, res, next) {
    res.locals.url = req.originalUrl;
    res.locals.title = 'Ticket System';
    next();
});

app.use('/', require('./routes/authRoutes'));
app.use('/ticket', require('./routes/ticketRoutes'));
app.use('/user', require('./routes/userRoutes'));

// 404 admin
app.all('*', (req, res) => {
    res.status(404).render('404', { message: 'Page not found!' });
});

// 4) ERROR HANDLING
// app.use(globalErrorHandler);

module.exports = app;
