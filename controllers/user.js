'use strict';
var mongoose=require('mongoose');

var Users=require('../models/user').Users;
var bcrypt=require('bcrypt');
var jwt=require('jsonwebtoken');

exports.register= function (req,res) {
    Users.find({email: req.body.email},function(err,data){
        if(data.length>=1){
            return res.status(409).json({
                success:false,
                message: 'user already exists'
            });
        }else{
            bcrypt.hash(req.body.password, 10, function (err, hash) {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'sorry! something happened, please try again'
                    });
                } else {
                    var user = new Users({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash

                    });
                    user.save(function (err, result) {
                        if (err) {
                            res.status(500).json({
                                success: false,
                                message: 'sorry! something happened, please try again'
                            });
                        }else{
                            res.status(200).json({
                                success: true,
                                message: 'sucessfully registered'
                            });
                        }
                    });
                }
            });
        }
    });

};

exports.deleteuser= function (req,res) {
    var id=req.params.id;
    Users.remove({_id:id},function (err,result) {
        if(err){
            res.status(500).json({
                sucess:false,
                message: 'invalid user'
            });
        }else{
            res.status(200).json({
                success:true,
                message: 'user deleted'
            });

        }
    });
};


exports.login= function (req,res) {
    Users.find({email: req.body.email},function (err,data) {
       if(data.length<1 || err){
           return res.status(401).json({
               success: false,
               message: 'invalid user'
           });
       }else{
           bcrypt.compare(req.body.password,data[0].password,function (err,result) {
               if(err){
                   return res.status(401).json({
                       success: false,
                       message: 'invalid user'
                   });
               }
               if(result){
                   var token= jwt.sign({
                      email: data[0].email,
                       userId: data[0]._id
                   },
                       'secret',
                       {expiresIn:"1h"}
                       );
                   return res.status(200).json({
                       success: 'successfully logged in',
                       token: token
                   });
               }else {
                   return res.status(401).json({
                       success: false,
                       message: 'invalid user'
                   });
               }
           });
       }
    });
};