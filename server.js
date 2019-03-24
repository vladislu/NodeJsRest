const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sequelize = require('./api/util/database');

const userRoutes = require('./api/routes/user');
const adminRoutes = require('./api/routes/admin');
const shopRoutes = require('./api/routes/shop');

const Product = require('./api/models/product');
const User = require('./api/models/user');
const Cart = require('./api/models/cart');
const CartItem = require('./api/models/cart-item');
const Order = require('./api/models/order');
const OrderItem = require('./api/models/order-item');

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

User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through: OrderItem});

const port = process.env.PORT || 3001;
const server = http.createServer(app);

sequelize
    //.sync({force: true})
    .sync()
    .then(result => {
        server.listen(port, () => { console.log('Server running on port :' + port) });
    })
    .catch(err => {
        console.log(err);
    });

