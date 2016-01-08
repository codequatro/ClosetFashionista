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

    $scope.goToProfile = function(user) {
      console.log('Switching to %s\'s profile', user.username);
      Register.register.getCloset(user.username)
        .then(function(data){
          $window.location.href = '/#/profile/' + user.username;
        });
    }

    $scope.follow = function(userToFollow) {
      console.log('About to follow user:\n', userToFollow);
      Register.register.follow({
        follower: $scope.user,
        following: userToFollow
      })
        .then(function(data) {
          console.log('cool');
          var follower = data.follower;
          var following = data.following;

          if ( ! $scope.user.following ) {
            $scope.user.following =[];
          }

          if ( ! userToFollow.followers ) {
            userToFollow.followers =[];
          }

          console.log('userToFollow before\n', userToFollow);
          userToFollow.followers.push(follower);
          console.log('userToFollow after\n', userToFollow);

          $scope.user.following.push(following);
        })
        .catch(function (error) {
          console.log('not cool');
          console.error(error);
        });
    }

    $scope.getTopUsers();

  }]);
