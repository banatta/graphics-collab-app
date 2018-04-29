//This is a worker that handles the connection to the
//Amazon s3 bucket
//Communicates to server through redis
//Credentials in s3-config.json
const redisConnection = require("./redis-connection");

var AWS = require('aws-sdk');
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

//We are using a socket for the refresh so that we can emit
//a refresh when we return from an upload

//upload

// var data = {Key: imageName, Body: imageFile};
// s3Bucket.putObject(data, function(err, data){
//   if (err) 
//     { console.log('Error uploading data: ', data); 
//     } else {
//       console.log('succesfully uploaded the image!';
//     }
// });