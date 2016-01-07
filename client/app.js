'use strict';

angular.module('myApp', [
    'ui.router'
  ])

    .config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider

       .state('home', {
        url: '/',
        views: {
            "nav": {templateUrl: "client/views/nav.html"},
            "main": {templateUrl: 'client/views/closet.html'}
          }
      })

      .state('signin', {
        url:'/signin',
        views: {
            "nav": {templateUrl: "client/views/nav.html"},
            "main":{templateUrl: 'client/views/signin.html'}
          }
      })

      .state('signup', {
        url:'/signup',
        views: {
            "nav": {templateUrl: "client/views/nav.html"},
            "main":{templateUrl: 'client/views/signup.html'}
          }
      })

      .state('signout', {
        url:'/signout',
        views: {
            "nav": {templateUrl: "client/views/nav.html"},
            "main":{templateUrl: 'client/views/signout.html'}
          }
      })

      .state('vote', {
        url: '/votes',
        views: {
            "nav": {templateUrl: "client/views/nav.html"},
            "main":{templateUrl: 'client/views/vote.html'}
          }
      })

      .state('singleOutfit', {
        url: '/singleOutfit',
        views: {
          "nav": {templateUrl: "client/views/nav.html"},
          "main": {templateUrl: "client/views/singleOutfit.html"}
        },
        params: {
          imageUrl: null
        }
      })

      .state('s3test', {
        url: '/s3test',
        views: {
            "nav": {templateUrl: "client/views/nav.html"},
            "main":{templateUrl: 'client/views/s3test.html'}
          }
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
        $location.path('/signin')
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

    register.vote = function(rating, username, imageId, message){
      console.log('Factory Image ID', imageId);
      console.log(rating);
      return $http({
        method: 'POST',
        url: '/vote',
        data: {rating: rating, username: username, imageId: imageId, message: message}
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
    /***************** AWS S3 ****************************/
    register.s3 = function(params){
      return $http({
      method:'POST',
      url:'/s3test',
      data: {params: params}
      })
      .then(function(resp){
        return resp.data;
      })
    };
    /***************** AWS S3 ****************************/

    return {
      register: register
    }
  })

; // end of app.js

