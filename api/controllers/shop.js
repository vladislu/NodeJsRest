const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order');

const User = require('../models/user');

exports.getProducts = async (req, res, next) => {
    const products = await Product.GetProducts();
    res.status(200).json(products);
}

exports.getProduct = async (req, res, next) => {
    const prodId = req.params.productId;
    try {
        const product = await Product.GetProductById(prodId);
        res.status(200).json(product);
    } catch (error) {
        res.status(404).json({ message: 'Product not found' });
    }
};

exports.getCart = async (req, res, next) => {
    try {
        const cart = await Cart.GetCartByUserId(req.userData.userId);
        const products = await cart.GetItems();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Cart empty.' });
    }

};

exports.addToCart = async (req, res, next) => {
    const prodId = req.body.productId;
    let cart = await Cart.GetCartByUserId(req.userData.userId);
    if (!cart) {
        const createCart = new Cart(null, req.userData.userId);
        await createCart.Create();
        cart = await Cart.GetCartByUserId(req.userData.userId);
    }
    let cartItem = await cart.GetItem(prodId);
    if (cartItem.length > 0) {
        cart.AddItem(prodId, cartItem[0].quantity + 1)
    } else {
        cart.AddNewItem(prodId);
    }
    res.status(200).json({ message: 'Product added to cart.' });
};

exports.deleteCartProduct = async (req, res, next) => {
    const prodId = req.body.productId;
    const cart = await Cart.GetCartByUserId(req.userData.userId);
    const deleted = await cart.DeleteItem(prodId);
    res.status(200).json({ message: 'Product removed from cart.' });
};

exports.createOrder = async (req, res, next) => {
    const stripe = require("stripe")("sk_test_1rKLLEFA8QjnSw6LWiwQcBph00WIixxg3k");
    stripe.setApiVersion('2019-03-14');

    const number = req.body.number;
    const exp_month = req.body.exp_month;
    const exp_year = req.body.exp_year;
    const cvc = req.body.cvc;
    let tok;

    await stripe.tokens.create({
        card: {
            number: number,
            exp_month: exp_month,
            exp_year: exp_year,
            cvc: cvc
        }
    }, (err, token) => {
        if (err) {
            return res.status(err.statusCode).json({ message: err.message });
        } else {
            tok = token.id;
        }
    });

    const cart = await Cart.GetCartByUserId(req.userData.userId);
    let cartitems;
    try {
        cartitems = await cart.GetItems();
    } catch (error) {
        return res.status(500).json({ message: 'Cart empty.' });
    }

    let total = 0;
    await cartitems.map(item => {
        total = total + (item.price * item.quantity);
        total = +total.toFixed(2);
    });
    total = total * 100;

    await stripe.charges.create({
        amount: total,
        currency: 'usd',
        description: 'charge for test',
        source: tok,
        receipt_email: req.userData.email
    }, async (err, charge) => {
        if (err) {
            return res.status(err.statusCode).json({ message: err.message });
        } else {
            const order = new Order(null, null, req.userData.userId)
            const create = await order.Create(cartitems);
            const clean = await cart.Delete();
            res.status(200).json({ message: 'Order created.', receipt_url: charge.receipt_url });
        }
    });
};

exports.getOrders = async (req, res, next) => {
    const orders = await Order.GetOrdersByUserId(req.userData.userId)
    console.log(orders);
    res.status(200).json(orders);
};

exports.getOrder = async (req, res, next) => {
    const orderId = req.params.orderId;
    const userId = req.userData.userId
    const order = await Order.GetOrderByIdAndUserId(userId, orderId);
    res.status(200).json(order);
};
