'use strict';
var mongoose=require('mongoose');
var nodemailer = require("nodemailer");
var Users=require('../models/user').Users;
var bcrypt=require('bcrypt');
var jwt=require('jsonwebtoken');
const crypto = require('crypto');

var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "abc@email.com",
        pass: "password"
    }
});
var rand,mailOptions,host,link;

exports.register= function (req,res) {
    Users.find({email: req.body.email},function(err,data){
        if(data.length>=1 && data[0]['verified']==1){
            return res.status(409).json({
                success:false,
                message: 'user already exists'
            });
        }
        else if (data.length>=1 && data[0]['verified']==0){
            return res.status(409).json({
                success:false,
                message: 'please verify your email address by clicking the link sent on your mail'
            }); 
        }
        else{
            bcrypt.hash(req.body.password, 10, function (err, hash) {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'sorry! something happened, please try again2222'
                    });
                } else {
                    
                    var rand=Math.floor((Math.random() * 100) + 54);
                    rand= rand.toString();
                    var val = crypto.createHash('md5').update(rand).digest('hex');
                    console.log(val);
                    
                    var user = new Users({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash,
                        aadhar: req.body.aadhar,
                        verified : 0,
                        verifytoken : val
                    });
                    user.save(function (err, result) {
                        if (err) {
                            res.status(500).json({
                                success: false,
                                message: 'sorry! something happened, please try again'
                            });
                        }else{
                            rand=Math.floor((Math.random() * 100) + 54);
                            host=req.get('host');
                            link="http://"+req.get('host')+"/verify?id="+val+"&email="+req.body.email;
                            mailOptions={
                                to : req.body.email,
                                subject : "Please confirm your Email account",
                                html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
                            }
                            console.log(mailOptions);
                            smtpTransport.sendMail(mailOptions, function(error, response){
                                if(error){
                                       console.log(error);
                                   //res.end("error unable to send verification email.");
                                        res.status(500).json({
                                        success: false,
                                        message: 'registered but UNABLE to send verification email'
                                    });
                                }
                                else{
                                    res.status(200).json({
                                        success: true,
                                        message: 'sucessfully registered. Verify your email id.'
                                    });
                                }
                           });
                            
                        }
                    });
                }
            });
        }
    });

};

exports.verify= function(req,res){
    console.log(req.protocol+":/"+req.get('host'));
    if((req.protocol+"://"+req.get('host'))==("http://"+host))
    {
        console.log("Domain is matched. Information is from Authentic email");
        Users.find({"email": req.body.email , "verifytoken" : req.body.id},function(err,data){
        if(!err)
        {
            console.log("email is verified and token verified");
            console.log(req.query.email);
            var query = {'email' : req.query.email};
            console.log(query);
            
            var newvalues = { $set : {'verified':1}};
            console.log(newvalues);
            Users.update(query,newvalues,function(err,result){
                if(err){
                    res.status(500).json({
                        success: false,
                        message: 'email not verified .try again'
                    });
                }
                else{
                    res.status(200).json({
                        success: true,
                        message: 'sucessfully verified your email id.'
                    });
                }
            });
            
        }
        else{
            res.status(500).json({
                success: false,
                message: 'email not verified bcz of wrong token'
            });
        }
    });
    }
    else{
        res.status(500).json({
            success: false,
            message: 'req from unknown source'
        });
    }
}


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
       }
       else if (data.length==1 && data[0]['verified']==0){
            return res.status(401).json({
                success: false,
                message: 'verify your email by clicking on link sent on your mail before logging in with this email id.'
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

exports.linkedinloginview=function (req,res) {
    res.render('linkedIn_login.ejs');
};

exports.linkedinlogin=function (req,res) {

};