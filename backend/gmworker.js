//This is the worker that handles the canvas image
//and everything pertaining to graphics magick
//talks to the server through redis

const redisConnection = require("./redis-connection");
console.log("graphics worker running");

var fs = require('fs')
  , gm = require('gm');

//A new image has been uploaded, save it and
//send to all clients states
redisConnection.on("upload_new_image", (data, channel) => {
  //open new image and keep updated
  console.log("heard upload");
  image = data;
  const buf = new Buffer(image.data.image.data);
  fs.writeFile('canvas.jpg', buf, 'hex', function (err) {
      if (err) {
          console.log("There was an error writing the image")
      }
      else {
          console.log("image uploaded successfully")
          //send message saying image was changed back to clients
          redisConnection.emit("canvas_image_changed", data);
      }
  });
});

//fetch the canvas for new connections
redisConnection.on("fetch_canvas", (data, channel) => {
  redisConnection.emit("canvas_image_changed", data);  
});

//open the file and send a buffer to client
redisConnection.on("canvas_image_changed", (data, channel) => {
  if (fs.existsSync('canvas.jpg')) {
    fs.readFile('canvas.jpg', function(err, file) {
      if (err) throw err;
      redisConnection.emit("send_canvas_buffer", file.toString('base64'));
    })
  }
});

//Graphics Magick Buttons
redisConnection.on("edit_image", (data, channel) => {
  var command = data;
  var image = gm('canvas.jpg');

  //parse gm commands
  switch(command) {
    case 'blur':
      image = image.blur(7,3);
      break;
    case 'implode':
      image = image.implode(-1.5);
      break;
    case 'sepia':
      image = image.sepia();
      break;
    case 'flip':
      image = image.flip();
      break;
    case 'flop':
      image = image.flop();
      break;
    case 'monochrome':
      image = image.monochrome();
      break;
    case 'negate':
      image = image.negative();
      break;
    default:
      break;
  }

  //write out and resend to client
  image.write('canvas.jpg', function (err){
    if (!err)
      redisConnection.emit("canvas_image_changed", data);
    else
      console.log(err);
  });
});
