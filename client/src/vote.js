'use strict';

angular.module('myApp')
.controller('VoteCtrl', ['$scope','$http', '$window','Register', 'Authorization', function($scope, $http, $window, Register , Authorization) {
$scope.updated = false;
$scope.username = $window.localStorage.getItem('username');
$scope.rating = {};

$scope.vote = function(){
  Register.register.vote(parseInt($scope.rating.value), $scope.username, $scope.imageId)
  .then(function(data){
    $scope.updated = true;
        $scope.getImage();
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

}]);
