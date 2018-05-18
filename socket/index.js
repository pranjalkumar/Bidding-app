'use strict';
var users_count=0;



var ioEvents = function(io) {

    io.on('connection', function (socket) {
        users_count=users_count+1;
        console.log(users_count);
  // socket.on('my other event', function (data) {
  //   console.log(data);
  //       });

  socket.on('disconnect',function (data) {
            users_count--;
            console.log(data);
        });
    });

}


var init = function(app){

	ioEvents(app.io);
}

module.exports = init;