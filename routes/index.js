var express = require('express');
var router = express.Router();

var Products= require('../controllers/product');
var checkAuth=require('../middlewares/check-auth');

// routes dealing with product collection

router.get('/product',checkAuth,Products.getProduct);
router.post('/product',checkAuth,Products.addProduct);
router.get('/product/:id',Products.getone);
router.patch('/product/:id',Products.updateProduct);
router.delete('/product/:id',Products.deleteProduct);


module.exports = router;

