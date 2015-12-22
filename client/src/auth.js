'use strict';

angular.module('myApp')
  .controller('AuthCtrl', ['$scope','$http', '$window', 'Register', function($scope,$http, $window, Register) {
    // $scope.header = 'this will be the auth page';

    $scope.user = {}
    // $scope.user.username might need to grab local storage for current user

    $scope.signin = function(user) {
      var username = $scope.user.username;
      var password = $scope.user.password;

      var user = {username: username, password: password}

      Register.register.signin(user)
      .then(function(data){
        console.log(' signin reg data', data)
      })
    }

    $scope.signup = function() {
      var username = $scope.user.username;
      var password = $scope.user.password;

      var user = {username: username, password: password}

      Register.register.signup(user)
      .then(function(data){
        console.log('signup reg data', data)
      })
    }

    $scope.reset = function() {
      $scope.user = angular.copy($scope.master)
    }

    $scope.reset();

  }]);
