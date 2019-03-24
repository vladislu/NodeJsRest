const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const shopController = require('../controllers/shop');

router.get('/products' , shopController.getProducts);
router.get('/products/:productId' , shopController.getProduct);

router.get('/cart',checkAuth, shopController.getCart);
router.post('/cart',checkAuth, shopController.addToCart);
router.post('/cart-delete-item',checkAuth, shopController.deleteCartProduct);

router.post('/create-order', checkAuth, shopController.createOrder);
router.get('/orders', checkAuth, shopController.getOrders);
router.get('/orders/:orderId', checkAuth, shopController.getOrder);

module.exports = router;