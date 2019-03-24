const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const checkAuthAdmin = require('../middleware/check-admin');

const adminController = require('../controllers/admin');

router.post('/add-product' ,checkAuth, checkAuthAdmin, adminController.addProduct);
router.delete('/delete-product/:prodId', checkAuth ,checkAuthAdmin , adminController.deleteProduct);
router.put('/update-product/:prodId', checkAuth ,checkAuthAdmin , adminController.updateProduct);

router.get('/top-5-products/:month', checkAuth  , adminController.topProducts);
router.get('/top-5-customers/:month', checkAuth  , adminController.topCustomers);
router.get('/top-5-customers-by-total/:month', checkAuth  , adminController.topCustomersTotal);
router.get('/avg-sales/:month', checkAuth  , adminController.avgSales);


module.exports = router;