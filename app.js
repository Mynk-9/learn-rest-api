const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');

console.log('init connection to mongo db');
mongoose
    .connect('mongodb://localhost:27017/player', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(
        (e) => {
            console.log('success connection to mongo db');
        }, (e) => {
            console.log('error connection to mongo db');
        }
    );

// logging 
app.use(morgan('dev'));

// body parsing
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// allow CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Request-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods',
            'PUT, POST, PATCH, DELETE, GET'
        );
        return res.status(200).json({});
    }
    next();
});

// routes which should handle requests
app.use('/products', productRoutes);
app.use('/orders', ordersRoutes);
console.log('routes setup done');

// error handle
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        }
    });
});

module.exports = app;