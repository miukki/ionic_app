angular.module('starter').controller('MainCtrl', function($scope, $timeout, MenuF, $ionicSideMenuDelegate) {
  'use strict';

  $scope.stateMenu = true;
  $scope.menu = MenuF.all();


  $scope.selectMenu = function(item) {
    $scope.activeMenu = item;
    $scope.toggleMenu($scope.stateMenu);
  };

  // Open our new task modal
  $scope.newTask = function() {
    //create new task;
  };


  //open left menu
  $scope.toggleMenu = function(fl) {
    $ionicSideMenuDelegate.toggleLeft(fl);
    $scope.stateMenu = !$scope.stateMenu;
  };



  // $timeout so everything is initialized
  $timeout(function() {
    if($scope.menu.length === 0) {
      while(true) {
        //show popup 'no-data available'
        break;
      }
    }
  });


});
