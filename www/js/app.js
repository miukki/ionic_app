// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/')

  $stateProvider.state('index', {
    url: '/',
    templateUrl: 'index.html'
  })

  $stateProvider.state('subs', {
    url: '/subs',
    templateUrl: 'subs.html'
  })

})


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
        {'title': 'Subs Available', 'sref': 'subs'},
        {'title': 'My Upcoming Classes', 'sref': 'subs'},
        {'title': 'My Overdue Tasks', 'sref': 'subs'},
        {'title': 'My Availability', 'sref': 'subs'},
        {'title': 'My Finished Classes', 'sref': 'subs'},
        {'title': 'My EF', 'sref': 'subs'}
      ];
    }
  }
})


.controller('MenuCtrl', function($scope, $timeout, $ionicModal, MenuF, $ionicSideMenuDelegate) {

  $scope.stateMenu = true;
  $scope.menu = MenuF.all();
  $scope.menuOdds = $scope.menu.filter(function(v, i, arr){return i%2==0})
  $scope.menuEvens = $scope.menu.filter(function(v, i, arr){return i%2!=0})

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


  // $timeout so everything is initialized
  $timeout(function() {
    if($scope.menu.length == 0) {
      while(true) {
        //show popup 'no-data available'
        break;
      }
    }
  });


});
