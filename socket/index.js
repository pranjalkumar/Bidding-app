

'use strict';
var mongoose=require('mongoose');
var Products=require('../models/product').Products;

var allproducts= new Array();

function initialize(){
    return new Promise(function(resolve,reject){
        Products.find({},function (err,result) {
            if(err){
                    reject(err);
            }
            else
            {   

                resolve(result);
            
            }
        });
    });      
}

var total_products;
var product_no=0;
var newbid, newbidder , product_description, product_image , product_name;
var initializepromise = initialize();
initializepromise.then(function(result){
    allproducts = result;
    console.log("allprod"+allproducts);
    total_products=allproducts.length;
    newbid = allproducts[product_no].base_price ;
    newbidder = '' ;
    product_image= allproducts[product_no].productImage; 
    product_description= allproducts[product_no].description;
    product_name = allproducts[product_no].name;
})


var users_count=0;
const defaultRoom = 'biddingroom';


var curr_time;
var last_bid_time=new Date().getTime();
var timelimit = 10;
var ioEvents = function(io) {

    io.on('connection', function (socket) {
        users_count=users_count+1;
        console.log(users_count);
        
    if(product_no<total_products)
    {
        socket.emit('first_conn',{
            bidamt : newbid,
            bidder: newbidder,
            prod_name : product_name,
            prod_desc : product_description,
            prod_image : product_image
        });
    }
    else{
        socket.emit('end of auction',{
            message : 'all products have finished.'
        });
    }
    



    socket.on('disconnect',function (socket) {
                users_count--;
                console.log(socket.id);
                console.log(users_count);
            });
    

    socket.on('newuser',function(data){
            data.roomname = defaultRoom;
            data.newbid = newbid;
            data.newbidder= newbidder;
            socket.join(defaultRoom);
            io.in(defaultRoom).emit('user joined',data);
            console.log("new user");
    });

    
        
    socket.on('bid placed',function(data){
            timelimit=10;
            curr_time=new Date().getTime();
            console.log("curr_time"+curr_time);
            console.log("last_bid_time"+last_bid_time);
            var diff = curr_time - last_bid_time;
            console.log("diff"+diff);
            if(diff<=10000){
                last_bid_time=curr_time;
                console.log(data);
                newbid=data.bidamt*2;
                newbidder = data.curr_bidder;
                io.sockets.emit('bid updated',{
                new_bid_amt : newbid,
                bidholder : newbidder
            });
        }
    else{
            socket.emit('late bid',{
                reason:"sorry, you were late to bid."
            });
        }
            
    });

  

    setInterval(function(){
        timelimit--;
        if(timelimit<0){
            product_no++;
            if(product_no<total_products)
            {
                newbid = allproducts[product_no].base_price;
                newbidder = '';
                product_name = allproducts[product_no].name;
                product_description = allproducts[product_no].description;
                product_image = allproducts[product_no].productImage;
                io.sockets.emit('changeprod',{
                    bidamt : newbid ,
                    bidder: newbidder,
                    prod_name : product_image,
                    prod_desc : product_description,
                    prod_image : product_image
                });
                last_bid_time=new Date().getTime();
                timelimit=10;
            }
            else{
                io.sockets.emit('end of auction',{
                    message : 'all products have finished.'
                });
            }
        }
    },1000);


    });

 
}



var init = function(app){

	ioEvents(app.io);
}

module.exports = init;

