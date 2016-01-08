'use strict';

angular.module('myApp')
  .controller('AuthCtrl', ['$state', '$scope', '$window', '$location', 'Register', 'Authorization', function($state, $scope, $window, $location, Register, Authorization) {
    // $scope.header = 'this will be the auth page';
    $scope.user = {}
    // $scope.user.username might need to grab local storage for current user

    $scope.signin = function(user) {
      var username = $scope.user.username;
      var password = $scope.user.password;

      var user = user || {username: username, password: password}

      Register.register.signin(user)
      .then(function(data){
        console.log(' signin data from our authjs', data)
        Authorization.authorized = true
        $window.localStorage.setItem('authtoken', data.token)
        $window.localStorage.setItem('username', data.username)
        $window.localStorage.setItem('userID', data.userID);
        $window.localStorage.setItem('user', JSON.stringify(data));

        $state.go('closet')

      })
      .catch(function (error) {
        $scope.signinErr = true;
        $scope.signinTxt = error.data.error ||
                           error.data.answer ||
                           'Signin error';
        console.error('Message: ', $scope.signinTxt);
      });
    }

    $scope.signup = function() {
      Register.register.signup($scope.user)
      .then(function(user){
        $scope.signin($scope.user)
      })
    }

    $scope.signout = function() {
      Authorization.authorized = false
      $window.localStorage.removeItem('authtoken')
      $window.localStorage.removeItem('username')
      $window.localStorage.removeItem('userID')
      $state.go('home')
    }

  }]);
