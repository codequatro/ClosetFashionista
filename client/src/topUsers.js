'use strict';

angular.module('myApp')
  .controller('TopUsersCtrl', ['$state', '$scope', '$window', '$location', 'Register', 'Authorization', function($state, $scope, $window, $location, Register, Authorization) {

    $scope.user = {
      username: $window.localStorage.getItem('username'),
      userID: $window.localStorage.getItem('userID')
    }

    $scope.users = [];
    // $scope.users = {
    //   [
    //     {
    //       credibilityscore : null,
    //       firstname : "Tarly",
    //       gender : "male",
    //       lastname : "Fass",
    //       user_id : 1,
    //       username : "Tarly"
    //     }
    //   ]
    // }

    $scope.getTopUsers = function() {
      Register.register.getTopUsers($scope.user)
      .then(function(data){
        $scope.users = $scope.users.concat(data);
        console.log('topUsers', $scope.users);
      })
      .catch(function (error) {
        console.error(error);
      });
    };

    $scope.getTopUsers();

  }]);
