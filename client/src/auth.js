'use strict';

angular.module('myApp')
  .controller('AuthCtrl', ['$state', '$scope', '$window', '$location', 'Register', 'Authorization', function($state, $scope, $window, $location, Register, Authorization) {
    // $scope.header = 'this will be the auth page';
    $scope.user = {};
    $scope.showErr = false;
    // $scope.user.username might need to grab local storage for current user

    $scope.signin = function(user) {
      var username = $scope.user.username;
      var password = $scope.user.password;

      var user = user || {username: username, password: password}

      Register.register.signin(user)
        .then(function(data){
          console.log(' signin data from our authjs', data);
          Authorization.authorized = true;
          $window.localStorage.setItem('authtoken', data.token);
          $window.localStorage.setItem('username', data.username);

          $state.go('home');

        })
        .catch(function(error){
          $scope.err = error.data.answer;
          $scope.showErr = true;
        });
    }

    $scope.signup = function() {
      var username = $scope.user.username;
      var password = $scope.user.password;

      var user = {username: username, password: password}

      Register.register.signup(user)
      .then(function(data){
        $scope.signin(user);
      })
      .catch(function(error){
        $scope.err = error.data.answer;
        $scope.showErr = true;
      });
    }

    $scope.signout = function() {
      Authorization.authorized = false;
      $window.localStorage.removeItem('authtoken');
      $window.localStorage.removeItem('username');
      $state.go('signin');
    }

  }]);
