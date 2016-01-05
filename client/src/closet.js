'use strict';

angular.module('myApp')
  .controller('ClosetCtrl', ['$scope','$http', '$window','$state','Register', 'Authorization', function($scope,$http,$window,$state, Register, Authorization) {
    $scope.header = 'You will find your closet here';
    $scope.imageUrl = url;
    $scope.username = $window.localStorage.getItem('username');
    $scope.search = "-1";
    $scope.video, $scope.image;
    $scope.channel = {};

    $scope.getCloset = function(){

      //Call the factory method which gets a users images and votes for those images
      Register.register.getCloset($scope.username)
      .then(function(data){
        /*************this needs to be moved into the factory******************/
        $scope.pics = data.pics;  //data.pics is an array of the users images
        //for each picture, we have an inner for loop that checks every vote to see if it belongs to the current picture
        for(var j = 0; j<data.pics.length; j++){
          $scope.pics[j].total = 0; //total number of votes
          $scope.pics[j].yes = 0; //total number of 'up' votes
            //loop through every vote that belongs to one of the user's pictures
            for(var i = 0; i<data.votes.length; i++){
              var row = data.votes[i]; //data.votes is an array of objects, so this grabs the individual object
              var vote = row["vote"]; //value is either a 1 for 'up' or 0 for 'down' vote
              var imageName = row["image_name"];
              if($scope.pics[j].image_name === imageName){
                if(vote === 1){
                  $scope.pics[j].yes += 1;
                  $scope.pics[j].total += 1;
                }
                else{
                  $scope.pics[j].total += 1;
                }
            }
          }//end first for loop
        }
        /*************this needs to be moved into the factory******************/
      }); //end .then
    };

    $scope.removeImage = function(imageId, imageName){
      console.log('inside of remove image function');
      console.log('current image ID', imageId);
      console.log('current image NAME', imageName);
      Register.register.removeImage(imageId, imageName)
      .then(function(data){
        console.log(data);
      })
    };

    $scope.customFilter = function (pic) {
      if (pic.type_id === parseInt($scope.search)) {
        return true;
      }
      else if (parseInt($scope.search) === -1) {
        return true;
      }
      else {
        return false;
      }
    };

    
    $scope.patOpts = {x: 0, y: 0, w: 25, h: 25};
    $scope.myChannel = {};

    $scope.onSuccess = function () {
        // The video element contains the captured camera data
        $scope.video = $scope.channel.video;
        $scope.$apply(function() {
            $scope.patOpts.w = $scope.video.width;
            $scope.patOpts.h = $scope.video.height;
            $scope.showDemos = true;
        });
    };


    $scope.makeSnapshot = function makeSnapshot() {
        if ($scope.video) {
            var patCanvas = document.querySelector('#snapshot');
            if (!patCanvas) return;

            patCanvas.width = $scope.video.width;
            patCanvas.height = $scope.video.height;
            var ctxPat = patCanvas.getContext('2d');

            var idata = getVideoData($scope.patOpts.x, $scope.patOpts.y, $scope.patOpts.w, $scope.patOpts.h);
            ctxPat.putImageData(idata, 0, 0);

            $scope.image = patCanvas.toDataURL();
            console.log($scope.image);
        }
    };

    var getVideoData = function getVideoData(x, y, w, h) {
        var hiddenCanvas = document.createElement('canvas');
        hiddenCanvas.width = $scope.video.width;
        hiddenCanvas.height = $scope.video.height;
        var ctx = hiddenCanvas.getContext('2d');
        ctx.drawImage($scope.video, 0, 0, $scope.video.width, $scope.video.height);
        return ctx.getImageData(x, y, w, h);
    };


    // initialize page with closet images if auth is good
    if(Authorization.authorized) {
        $scope.getCloset();
    }

    $scope.reloadPage = function(){
      $state.go($state.current, {}, {reload: true});
    };

  }]);
