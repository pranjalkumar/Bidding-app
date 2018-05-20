//import { default_type } from "../../.cache/typescript/2.6/node_modules/@types/mime";

'use strict';
// var cron = require('node-cron');
 
// cron.schedule('* * 16 * *', function(){
//   console.log('running a task every minute');
// });


var users_count=0;
var newbid=100 , newbidder='tarun';
var curr_time;
var last_bid_time=new Date().getTime();

const defaultRoom = 'biddingroom';

var ioEvents = function(io) {

    io.on('connection', function (socket) {
        users_count=users_count+1;
        console.log(users_count);
  // socket.on('my other event', function (data) {
  //   console.log(data);
  //       });

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

    // socket.on('changeroom',function(data){
    //     data.previousroom = defaultRoom;
    //     socket.leave(defaultRoom);
    //     socket.join(data.roomname);
    //     io.in(defaultRoom).emit('user left',data);
    //     io.in(data.roomname).emit('user joined',data);
    // });
    
    socket.on('bid placed',function(data){
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
        })
    }
        
    });

    
});

   
}


var init = function(app){

	ioEvents(app.io);
}

module.exports = init;