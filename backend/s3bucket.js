//This is a worker that handles the connection to the
//Amazon s3 bucket
//Communicates to server through redis
//Credentials in s3-config.json
const redisConnection = require("./redis-connection");

var AWS = require('aws-sdk');
var fs = require('fs');
AWS.config.loadFromPath('./s3config.json');
var s3Bucket = new AWS.S3({params: {Bucket: 'graphics-collab-bucket'}});
console.log("S3 Connection Successful");

var params = {Bucket: 'graphics-collab-bucket'};

//Request all images in bucket
redisConnection.on("request_gallery", (data, channel) => {
  gallery = [];
  s3Bucket.listObjects(params, function(err, data){
    var bucketContents = data.Contents;
    for (var i = 0; i < bucketContents.length; i++){
      var urlParams = {Bucket: 'graphics-collab-bucket', Key: bucketContents[i].Key};
      var url = s3Bucket.getSignedUrl('getObject', urlParams);
      gallery.push(url);
    }

    //send urls back to server
    redisConnection.emit("return_gallery", gallery);
  });
  
});

//Save Current Canvas to s3 and re-request gallery
redisConnection.on("save_canvas", (data, channel) => {
  console.log("recieved save request");

  fs.readFile('canvas.jpg', function (err, data) {
    if (err) { throw err; }

    var base64data = new Buffer(data, 'binary');

    var keyname = Date.now().toString(); 
    s3Bucket.putObject({
      Bucket: 'graphics-collab-bucket',
      Key: keyname,
      Body: base64data,
      ACL: 'public-read'
    },function (resp) {
      console.log(arguments);
      console.log('Successfully uploaded package.');
      //refresh the gallery
      redisConnection.emit("request_gallery", 'Saved');
    });
  });

});