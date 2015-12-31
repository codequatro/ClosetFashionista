'use strict';

angular.module('myApp')
  .controller('VoteCtrl', ['$scope','$http', '$window','Register', function($scope, $http, $window, Register) {
    $scope.header = 'I am ready to vote on ugly fools';
    $scope.updated = false;
    $scope.hotOrNot = 0;

    $scope.getImage = function(){
    	Register.register.randomImage()
    	.then(function(data){
    		$scope.imageUrl = '../uploads/' + data.image_name;
    		$scope.imageId = data.image_id;
    	})
    };

    $scope.username = $window.localStorage.getItem('username');

    $scope.vote = function(){
    	Register.register.vote($scope.hotOrNot, $scope.username, $scope.imageId)
    	.then(function(data){
    		$scope.updated = true;
    	})
    };


  }]);
