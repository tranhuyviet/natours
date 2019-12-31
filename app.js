const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1. GLOBAL MIDDLEWARE
// Set security HTTP headers
app.use(helmet());

// Development logging
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// limit 100 request on 1 hour with 1 IP
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter); // only limit with /api... request

// Data sanitization against NoSQL query injection, ex: "email": {$gt:""}
app.use(mongoSanitize());

// Data sanitization against XSS, ex "name": <div id='bad-code'></div>
app.use(xss());

// Prevent parameter pollution: handle duplicate query but in whitelist can query
app.use(
    hpp({
        whitelist: [
            'duration',
            'ratingsAverage',
            'ratingsQuantity',
            'maxGroupSize',
            'difficulty',
            'price'
        ]
    })
);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.headers);
    next();
});

// ROUTES
app.use('/api/v1/tours', tourRouter); // add tour router in to middleware (mounting)
app.use('/api/v1/users', userRouter); // add user router in to middleware (mounting)

// handle if url request not correctly or not defined
// .all that mean every request: get, post, update, delete,...
app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status: 'fail',
    //     message: `Can't find ${req.originalUrl} on this server!`
    // });

    // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
    // err.status = 'fail';
    // err.statusCode = 404;
    // next(err);

    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// middleware handling error
app.use(globalErrorHandler);

module.exports = app;
