'use strict';

angular.module('myApp', [
    'ui.router'
  ])

    .config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
        })

        .state('signin', {
          url:'/signin',
          templateUrl: 'views/signin.html',
          controller: 'AuthCtrl'
        })

        .state('signup', {
          url:'/signup',
          templateUrl: 'views/signup.html',
          controller: 'AuthCtrl'
        })

        .state('signout', {
          url:'/signout',
          templateUrl: 'views/signout.html',
          controller: 'AuthCtrl'
        })

        .state('vote', {
          url: '/vote',
          templateUrl: 'views/vote.html',
          controller: 'VoteCtrl'
        })

        .state('closet', {
          url: '/closet',
          templateUrl: 'views/closet.html',
          controller: 'ClosetCtrl'
        })

        .state('s3test', {
          url: '/s3test',
          templateUrl: 'views/s3test.html',
          controller: 'S3Ctrl'
        })

})
.service('Authorization', function($state, $window) {
  // This service is a simple version checking for local authtoken
  // and using a state change listener to check on each transistion
  // see .run below for that test
  // It should be tied into a more robust auth check

  if (!!$window.localStorage.authtoken) {
    this.authorized = true;

  } else {
    this.authorized = false;
  }

  return {
    authorized: this.authorized
  };
})
.run( function($rootScope, $location, $state, Authorization) {
    // register listener to watch route changes
    $rootScope.$on( '$locationChangeStart', function(event, next, toState) {

     if(Authorization.authorized === false) {
       if(next.match('vote') || next.match('closet')){
        $location.path('/signin');
       }
     }

    });
  })

 .factory('Register', function($http, $window){
    var register = {};  // local storage for users and current user

    register.currentUser =  $window.localStorage.getItem('username') || '' ;
    register.users = [];

    /***************AUTHORIZATION***********************/
    register.signup = function(user) {
      return $http({
        method: 'POST',
        url: '/signup',
        data: user
      })
      .then(function(resp){
        return resp.data;
      })
    };

    register.signin = function(user){
      return $http({
        method: 'POST',
        url: '/signin',
        data: user
      })
      .then(function(resp){
        return resp.data;
      })
    };
    /***************AUTHORIZATION***********************/

    /*****************VOTING ON IMAGE*******************/
    register.randomImage = function(username){
      return $http({
        method: 'POST',
        url: '/randomimage',
        data: {username: username}
      })
      .then(function(resp){
        return resp.data;
      })
    }

    register.vote = function(hotOrNot, username, imageId){
      console.log('Factory Image ID', imageId);
      return $http({
        method: 'POST',
        url: '/vote',
        data: {hotOrNot: hotOrNot, username: username, imageId: imageId}
      })
      .then(function(resp){
        return resp.data;
      })
    }
    /*****************VOTING ON IMAGE*******************/

    /*************GET CLOSET IMAGES********************/
    register.getCloset = function(user){
      return $http({
        method: 'POST',
        url: '/closet',
        data: {username: user}
      })
      .then(function(resp){
        return resp.data;
      })
    };
    /*************GET CLOSET IMAGES********************/
    register.removeImage = function(imageId, imageName){
      return $http({
        method: 'POST',
        url: '/removeimage',
        data: {imageId: imageId, imageName: imageName}
      })
      .then(function(resp){
        return resp.data;
      })
    };

    return {
      register: register
    }
  })

; // end of app.js

