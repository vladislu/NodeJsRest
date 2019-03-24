const Product = require('../models/product');
const User = require('../models/user');

exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.status(200).json(products);
        })
        .catch(err => res.status(500).json({ error: err }));
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    // Product.findAll({where: { id: prodId }})
    Product.findByPk(prodId)
        .then(product => {
            if (product) res.status(200).json(product);
            else res.status(404).json({ message: 'Product not found' });
        })
        .catch(err => res.status(500).json({ error: err }));
};

exports.getCart = (req, res, next) => {
    User.findByPk(req.userData.userId)
        .then(user => {
            return user.getCart();
        })
        .then(cart => {
            return cart.getProducts();
        })
        .then(products => {
            res.status(200).json(products);
        })
        .catch(err => { res.status(500).json({ error: err }) });
};

exports.addToCart = (req, res, next) => {
    const prodId = req.body.productId;
    let newQuantity = 1;
    let fetchedCart;
    let fetchedUser;

    User.findByPk(req.userData.userId)
        .then(user => {
            fetchedUser = user;
            return user.getCart();
        })
        .then(cart => {
            if (cart) return Promise.resolve(cart);
            return fetchedUser.createCart();
        })
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: prodId } });
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }

            if (product) {
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product;
            }
            return Product.findByPk(prodId);
        })
        .then(product => {
            return fetchedCart.addProduct(product, {
                through: { quantity: newQuantity }
            });
        })
        .then(result => {
            res.status(200).json({ message: 'Product added to cart.' });
        })
        .catch(err => { res.status(500).json({ error: 'Can not add item to cart. ' }) });
};

exports.deleteCartProduct = (req, res, next) => {
    const prodId = req.body.productId;
    User.findByPk(req.userData.userId)
        .then(user => {
            return user.getCart();
        })
        .then(cart => {
            return cart.getProducts({ where: { id: prodId } });
        })
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then(result => {
            res.status(200).json({ message: 'Product removed from cart.' });
        })
        .catch(err => { res.status(500).json({ error: err }) });
};

exports.createOrder = (req, res, next) => {
    let fetchedCart;
    let fetchedUser;
    let fetchedProducts;
    User.findByPk(req.userData.userId)
        .then(user => {
            fetchedUser = user;
            return user.getCart();
        })
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            let total = 0;
            fetchedProducts = products.map(product => {
                product.orderItem = { quantity: product.cartItem.quantity };
                total = total + (product.price * product.cartItem.quantity);
                total = +total.toFixed(2);
                return product;
            });
            return fetchedUser.createOrder({
                total: total
            });
        })
        .then(order => {
            return order.addProducts(fetchedProducts);
        })
        .then(result => {
            return fetchedCart.setProducts(null);
        })
        .then(result => {
            res.status(200).json({ message: 'order created.' });
        })
        .catch(err => { res.status(500).json({ error: err }) });
};

exports.getOrders = (req, res, next) => {
    User.findByPk(req.userData.userId)
        .then(user => {
            return user.getOrders({ include: [{ model: Product }] })
        })
        .then(orders => {
            res.status(200).json(orders);
        })
        .catch(err => { res.status(500).json({ error: err }) });
};

exports.getOrder = (req, res, next) => {
    const orderId = req.params.orderId;
    User.findByPk(req.userData.userId)
        .then(user => {
            return user.getOrders({ include: [{ model: Product }], where: { id: orderId } });
        })
        .then(orders => {
            res.status(200).json(orders);
        })
        .catch(err => { res.status(500).json({ error: err.message }) });
};
