const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// const knex = require('../../db/knex');
const knex = require('./db/knex');

const userRoutes = require('./api/routes/user');
const adminRoutes = require('./api/routes/admin');
const shopRoutes = require('./api/routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'POST, PUT, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.get('/setup', async (req, res, next) => {
    await knex.migrate.latest();
    await knex.seed.run();
    res.send("migrated databse and seeded");
});

//Routes
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

const port = process.env.PORT || 3001;
const server = http.createServer(app);

server.listen(port, () => { 
    console.log('Server running on port :' + port);
    });

module.exports = app;