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
      var username = $scope.user.username;
      var password = $scope.user.password;
      var firstname = $scope.user.firstname;
      var lastname = $scope.user.lastname;
      var gender = $scope.user.gender;

      var user = {username: username, password: password, firstname: firstname, lastname: lastname, gender: gender}

      Register.register.signup(user)
      .then(function(data){
        $scope.signin(user)
      })
    }

    $scope.signout = function() {
      Authorization.authorized = false
      $window.localStorage.removeItem('authtoken')
      $window.localStorage.removeItem('username')
      $state.go('home')
    }

  }]);
