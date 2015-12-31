'use strict';

angular.module('myApp')
  .controller('AuthCtrl', ['$scope', '$window', '$location', 'Register', 'Authorization', function($scope, $window, $location, Register, Authorization) {

    $scope.user = {}
    // $scope.user.username might need to grab local storage for current user

    $scope.signin = function(user) {
      var username = $scope.user.username;
      var password = $scope.user.password;
      var user = user || {username: username, password: password}

      Register.register.signin(user)
      .then(function(data){
        Authorization.authorized = true
        $window.localStorage.setItem('authtoken', data.token)
        $window.localStorage.setItem('username', data.username)
        $location.path('/closet')
      })
    }

    $scope.signup = function() {
      var username = $scope.user.username;
      var password = $scope.user.password;
      var user = {username: username, password: password}

      Register.register.signup(user)
      .then(function(data){
        $scope.signin(user)
      })
    }

    $scope.signout = function() {
      Authorization.authorized = false
      $window.localStorage.removeItem('authtoken')
      $window.localStorage.removeItem('username')
    }

  }]);
