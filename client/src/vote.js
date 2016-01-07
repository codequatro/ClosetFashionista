'use strict';

angular.module('myApp')
  .controller('VoteCtrl', ['$scope','$http', '$window','Register', 'Authorization', function($scope, $http, $window, Register , Authorization) {
    $scope.updated = false;
    // $scope.hotOrNot;


    // Temporary Data Storage
    $scope.username = $window.localStorage.getItem('username');
    $scope.firstname = undefined; // will be set when 'getBasicUserInfo' is run
    $scope.lastname = undefined; // will be set when 'getBasicUserInfo' is run
    $scope.gender = undefined; // will be set when 'getBasicUserInfo' is run
    $scope.userCredibility = undefined; // will be set when 'getBasicUserInfo' is run


    $scope.imagePic = undefined;
    $scope.imageSource = undefined;
    $scope.imageInfo = undefined;
    $scope.imageId = undefined;

    $scope.getBasicUserInfo = function(){
        Register.register.getCloset($scope.username)
        .then(function(data){
            console.log('User Info: ', data)
            // Storing User Info
            $scope.firstname = data.firstname;
            $scope.lastname = data.lastname;
            $scope.gender = data.gender;
            $scope.userCredibility = data.userCredibility;
        })
    };

    $scope.getImage = function(){
    	Register.register.randomImage($scope.username)
    	.then(function(data){
            $scope.imagePic = data.image.image;
            $scope.imageSource = data.image.source;
            $scope.imageInfo = data.image.image_name;
            $scope.imageId = data.image.image_id;
    	})
    };

    $scope.username = $window.localStorage.getItem('username');

    $scope.vote = function(voteValue){
    	console.log('$scope.imageId', $scope.imageId, 'current vote', voteValue);
    	Register.register.vote(voteValue, $scope.username, $scope.imageId, $scope.gender)
    	.then(function(data){
    		$scope.updated = true;
            $scope.getImage();
    	})
    };

    // initialize page with image if auth is good
    if(Authorization.authorized) {
        $scope.getBasicUserInfo();
        $scope.getImage();
    }

  }]);
