// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'ngCordova', 'satellizer'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  });

app.config(function ($authProvider) {
  $authProvider.loginUrl = 'http://37.139.23.228/api/authenticate';
});


app.controller("ExampleController", function ($scope, $cordovaBarcodeScanner, $http, $auth) {


  var credentials = {
    email: 'admin@cvo.be',
    password: ''
  };
  $http.post('http://37.139.23.228/api/authenticate', credentials).success(function (response) {
    console.log(response);
  }, function (err) {
    console.log(err);
  });

  var plantId = '';

  $scope.userLoggedIn = false;

  $scope.scanBarcode = function () {
    $cordovaBarcodeScanner.scan().then(function (imageData) {
      plantId = imageData.text.substr(imageData.text.lastIndexOf('/'));
      console.log(plantId);
      $http.get('http://37.139.23.228/api/freePlant' + plantId).success(function (result) {
        console.log(result);
        $scope.result = result;
      }, function (error) {
        console.log(error);
      });
      console.log("Barcode Format -> " + imageData.format);
      console.log("Cancelled -> " + imageData.cancelled);
    }, function (error) {
      console.log("An error happened -> " + error);
    });
  };

  $scope.login = function () {
    var credentials = {
      email: $scope.email,
      password: $scope.password
    };
    $auth.login(credentials).then(function () {
      $http.get('http://37.139.23.228/api/plant' + plantId).success(function (result) {
        $scope.result = result;
        $scope.userLoggedIn = true;
      }).error(function (error) {
        console.log(error);
      });
    }, function (error) {
      // vm.loginError = true;
      // vm.loginErrorText = error.data.error;
    });
  };

  $scope.logout = function () {
    $auth.logout().then(function () {
      $scope.userLoggedIn = false;
    });
  };

});

