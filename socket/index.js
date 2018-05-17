'use strict';




var ioEvents = function(io) {

    io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
        });
    });
}


var init = function(app){

	ioEvents(app.io);
}

module.exports = init;