'use strict';

angular.module('myApp')
.controller('VoteCtrl', ['$scope','$http', '$window','Register', 'Authorization', function($scope, $http, $window, Register , Authorization) {
$scope.updated = false;
$scope.submitButton = true;
$scope.username = $window.localStorage.getItem('username');
$scope.rating = {};
$scope.rating.value = 0;
$scope.comment = {};
$scope.comment.message = '';

$scope.vote = function(){
  Register.register.vote(parseInt($scope.rating.value), $scope.username, $scope.imageId, $scope.comment.message)
  .then(function(data){
    $scope.updated = true;
        $scope.getImage();
        $scope.rating.value = 0;
        $scope.comment.message = '';
  });

};

$scope.getImage = function(){
  Register.register.randomImage($scope.username)
  .then(function(data){
    $scope.imageUrl = data.image_name;
    $scope.imageId = data.image_id;
  });
};

if(Authorization.authorized) {
  $scope.getImage();
}

$scope.submitComment = function(){
  $scope.submitButton = false;
  $scope.submitted = true;
}
}]);
