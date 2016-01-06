'use strict';

angular.module('myApp')
  .controller('ClosetCtrl', ['$scope','$http', '$window','$state','Register', 'Authorization', function($scope,$http,$window,$state, Register, Authorization) {
    $scope.header = 'You will find your closet here';
    $scope.imageUrl = url;
    $scope.search = "-1";
    // $scope.fire = 'https://s-media-cache-ak0.pinimg.com/236x/4a/8b/c7/4a8bc790db90babc2d5346f07e516ddb.jpg';



    // Temporary Data Storage
    $scope.username = $window.localStorage.getItem('username');
    $scope.firstname = undefined; // will be set when 'getUserInfo' is run
    $scope.lastname = undefined; // will be set when 'getUserInfo' is run
    $scope.gender = undefined; // will be set when 'getUserInfo' is run
    $scope.userCredibility = undefined; // will be set when 'getUserInfo' is run


    $scope.getUserInfo = function(){

      //Call the factory method which gets a users images and votes for those images
      Register.register.getCloset($scope.username)
      .then(function(data){
        console.log('User Info: ', data)

        // Storing User Info
        $scope.firstname = data.firstname;
        $scope.lastname = data.lastname;
        $scope.gender = data.gender;
        $scope.userCredibility = data.userCredibility;

        // Scoring Closet Photos
        $scope.pics = data.pics;

        // NEED TO REVIEW...pics now have upvote/downvote data included in picture object
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
    // initialize page with closet images if auth is good
    if(Authorization.authorized) {
        $scope.getUserInfo();
    }

    $scope.reloadPage = function(){
      $state.go($state.current, {}, {reload: true});
    };

  }]);
