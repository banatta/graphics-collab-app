//Server that handles the chat socket
//Sends messages between client and s3 worker gm worker with redis

const redisConnection = require("./redis-connection");
const express = require("express");
const app = express();

server = app.listen(8080, function(){
    console.log('Server is running on port 8080')
});

var socket = require('socket.io');
io = socket(server);

//Socket Connection
io.on('connection', (socket) => {
  console.log(socket.id);

  //Chat
  socket.on('send_message', function(data){
    io.emit('receive_message', data);
  })

  //Request Gallery
  socket.on('request_gallery', function(data){
    redisConnection.emit("request_gallery", {data});
  })

  //Return Gallery
  redisConnection.on("return_gallery", (data, channel) => {
    io.emit("return_gallery", data);
  });

  //Image upload
  socket.on('upload_new_image', function(data){
    redisConnection.emit("upload_new_image", {data});
  })

  //Image change
  redisConnection.on("send_canvas_buffer", (data, channel) => {
    io.emit("send_canvas_buffer", {image: true, buffer: data});
  });

  //Save Canvas to s3
  socket.on("save_canvas", function(data){
    redisConnection.emit("save_canvas", {data});
  })


});
