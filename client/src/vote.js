'use strict';

angular.module('myApp')
  .controller('VoteCtrl', ['$scope','$http', '$window', function($scope,$http,$window) {
    $scope.header = 'I am ready to vote on ugly fools';
    $scope.updated = false;


    $scope.imageUrl = '../uploads/pants.jpeg';

    $scope.getImage = function(){

    };

    $scope.username = $window.localStorage.getItem('username');

    $scope.vote = function(){
    	Register.register.vote($scope.hotOrNot, $scope.username)
    	.then(function(data){
    		$scope.updated = true;
    	})
    };


  }]);
