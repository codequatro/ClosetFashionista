'use strict';

angular.module('myApp')
.controller('VoteCtrl', ['$scope','$http', '$window','Register', 'Authorization', function($scope, $http, $window, Register , Authorization) {
$scope.updated = false;
$scope.username = $window.localStorage.getItem('username');
$scope.rating = null;

$scope.vote = function(){
  Register.register.vote($scope.rating, $scope.username, $scope.imageId)
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
