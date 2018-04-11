'use strict';
var mongoose=require('mongoose');
var Products=require('../models/product').Products;



exports.getProduct= function (req,res) {
    Products.find({},function (err,result) {
        if(err){
            res.status(500).json({
                success:false,
                message: 'sorry! No result avaiable'
            });
        }
        else
        {   res.status(200).json({
            success: true,
            data :result
        });}
    });
};


exports.addProduct= function (req,res) {
    console.log(req.file);
    var username=req.userData.email;
    var datetime = new Date();
    var product= new Products({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.desc,
        base_price: req.body.base_price,
        productImage: req.file.path,
        owner: username,
        upload_date: datetime
    });
    product.save(function (err,result) {
        if(err){
            res.status(500).json({
                success:false,
                message: 'sorry! something happened, please try again'
            });
        }
        else
        {res.status(200).json({
            success: true,
            message: 'product added'
        });}
    });
};


exports.getone= function (req,res) {
    var id=req.params.id;
    Products.findById(id,function (err,result) {
        if(err){
            res.status(500).json({
                success:false,
                message: 'No data corresponding to the id was found'
            });
        }
        else
        {res.status(200).json({
            success: true,
            data: result
        });}
    });
};


exports.updateProduct= function (req,res) {
    var id=req.params.id;
    Products.update({_id:id},{$set: req.body},function (err,result) {
        if(err){
            res.status(500).json({
                success:false,
                message: 'Sorry! Product can not be updated'
            });
        }
        else
        {res.status(200).json({
            success: true,
            message: "Product updated"
        });}
    });
};


exports.deleteProduct= function (req,res) {
    var id=req.params.id;
    Products.remove({_id:id},function (err,result) {
        if(err){
            res.status(500).json({
                success:false,
                message: 'Sorry! Invalid order selected'
            });
        }
        else
        {res.status(200).json({
            success: true,
            message: 'Product deleted'
        });}
    })
};
