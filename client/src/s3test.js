'use strict';


angular.module('myApp')
  .controller('S3Ctrl', ['$scope','$window', function($scope, $window) {

  // AWS.config.loadFromPath('./config.json');

  var bucket = new AWS.S3({params: {Bucket: 'cqphotos'}});
  var fileChooser = document.getElementById('file-chooser');
  var button = document.getElementById('upload-button');
  var results = document.getElementById('results');

  button.addEventListener('click', function() {

    var file = fileChooser.files[0];

    if (file) {
      results.innerHTML = '';

      var params = {Key: file.name, ContentType: file.type, Body: file};

      bucket.upload(params, function (err, data) {
        results.innerHTML = err ? 'ERROR!' : 'UPLOADED.';
      });
    } else {
      results.innerHTML = 'Nothing to upload.';
    }
  }, false);

  }]);
