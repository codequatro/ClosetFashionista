'use strict';
// var AWS = require('aws-sdk');

angular.module('myApp')
  .controller('S3Ctrl', ['$scope','$window','Register', function($scope, $window, Register) {

  // AWS.config.region = 'us-east-1';

  // AWS.config.loadFromPath('./config.json');

  // AWS.config.update({accessKeyId: 'AKIAJ5L2GGPWMDVDVSMQ', secretAccessKey: '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'});

  // var bucket = new AWS.S3({params: {Bucket: 'cqphotos'}});
  // console.log('AWS.config', AWS.config);
  // console.log('bucket', bucket);
  // console.log('connected to bucket: ', bucket);

  // var fileChooser = document.getElementById('file-chooser');
  // var button = document.getElementById('upload-button');
  // var results = document.getElementById('results');


  // button.addEventListener('click', function() {

    // var file = fileChooser.files[0];

    // console.log('file', file)

    // if (file) {
    //   results.innerHTML = '';

    //   var params = {Key: file.name, ContentType: file.type, Body: file};

      // bucket.upload(params, function (err, data) {
      //   results.innerHTML = err ? 'ERROR!' : 'UPLOADED.';
      // });
      // Register.register.s3(params);
    // } else {
    //   results.innerHTML = 'Nothing to upload.';
    // }
  // }, false);

  }]);
