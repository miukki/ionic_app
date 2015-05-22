// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])


.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.factory('MenuF', function() {
  return {
    all: function() {
      return [
        {'title': 'Subs Available'},
        {'title': 'My Upcoming Classes'},
        {'title': 'My Overdue Tasks'},
        {'title': 'My Availability'},
        {'title': 'My Finished Classes'},
        {'title': 'My EF'}
      ];
    }
  }
})


.controller('MenuCtrl', function($scope, $timeout, $ionicModal, MenuF, $ionicSideMenuDelegate) {

  $scope.stateMenu = true;
  $scope.menu = MenuF.all();

  // Create and load the Modal
  $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $scope.selectMenu = function(item, index) {
    $scope.activeMenu = item;
    $scope.toggleMenu($scope.stateMenu);
  };

  $scope.createTask = function(menu) {
    $scope.menu.push({
      title: menu.title
    });
    $scope.taskModal.hide();
    menu.title = "";
  };
  // Open our new task modal
  $scope.newTask = function() {
    $scope.taskModal.show();
  };

  // Close the new task modal
  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  };

  //open left menu
  $scope.toggleMenu = function(fl) {
    $ionicSideMenuDelegate.toggleLeft(fl);
    $scope.stateMenu = !$scope.stateMenu;
  };

});
