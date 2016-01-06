'use strict';

angular.module('myApp')
.controller('VoteCtrl', ['$scope','$http', '$window','Register', 'Authorization', function($scope, $http, $window, Register , Authorization) {
$scope.updated = false;
$scope.username = $window.localStorage.getItem('username');

$scope.vote = function(voteValue){
  Register.register.vote(voteValue, $scope.username, $scope.imageId)
  .then(function(data){
    $scope.updated = true;
        $scope.getImage();
  });
};

var getImage = function(){
  Register.register.randomImage($scope.username)
  .then(function(data){
    $scope.imageUrl = data.image_name;
    $scope.imageId = data.image_id;
  });
};

if(Authorization.authorized) {
  getImage();
}

}]);
