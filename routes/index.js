var express = require('express');
var router = express.Router();

var Products= require('../controllers/product');
var checkAuth=require('../middlewares/check-auth');
var file_upload=require('../middlewares/file_upload');

// routes dealing with product collection

router.get('/product',checkAuth,Products.getProduct);
router.post('/product',checkAuth,file_upload.upload.single('productImage'),Products.addProduct);
router.get('/product/:id',Products.getone);
router.patch('/product/:id',Products.updateProduct);
router.delete('/product/:id',Products.deleteProduct);


module.exports = router;

