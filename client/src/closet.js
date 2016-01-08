'use strict';

angular.module('myApp')
  .controller('ClosetCtrl', ['$scope','$http', '$window','$state','Register', 'Authorization', '$stateParams', function($scope,$http,$window,$state, Register, Authorization, $stateParams) {
    $scope.header = 'You will find your closet here';
    // $scope.imageUrl = url;
    $scope.search = "-1";
    // $scope.fire = 'https://s-media-cache-ak0.pinimg.com/236x/4a/8b/c7/4a8bc790db90babc2d5346f07e516ddb.jpg';



    // Temporary Data Storage
    $scope.username = $stateParams.username || $window.localStorage.getItem('username');
    $scope.userID = undefined; // will be set when 'getUserInfo' is run
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
        $scope.user = data;

        $scope.firstname = data.firstname;
        $scope.lastname = data.lastname;
        $scope.gender = data.gender;
        $scope.userCredibility = data.userCredibility;

        // Scoring Closet Photos
        $scope.pics = data.pics;

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
