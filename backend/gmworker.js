//This is the worker that handles the canvas image
//and everything pertaining to graphics magick
//talks to the server through redis

const redisConnection = require("./redis-connection");
console.log("graphics worker running");

//require filesystem
var fs = require('fs');



//A new image has been uploaded, save it and
//send to all clients states
redisConnection.on("upload_new_image", (data, channel) => {
  //open new image and keep updated
  image = data;
  const buf = new Buffer(image.data.image.data);
  fs.writeFile('../public/canvas.jpg', buf, 'hex', function (err) {
      if (err) {
          console.log("There was an error writing the image")
      }
      else {
          console.log("image uploaded successfully")
          //send message saying image was changed back to clients
          redisConnection.emit("canvas_image_changed", image.data.image.data);
      }
  });

});