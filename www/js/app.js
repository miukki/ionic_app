// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic']);


app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/')

  $stateProvider.state('index', {
    url: '/',
    templateUrl: 'index.html',
    controller: 'IndexCtrl'
  })

  $stateProvider.state('subs', {
    url: '/subs',
    templateUrl: 'subs.html',
    controller: 'SubsCtrl'
  })

  $stateProvider.state('upcoming', {
    url: '/upcoming',
    templateUrl: 'upcoming.html',
    controller: 'UpcomingCtrl'
  })

})


.run(function($ionicPlatform, $templateCache) {
    //load templates


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
        {'title': 'My Upcoming Classes', 'sref': 'upcoming'},
        {'title': 'My Overdue Tasks', 'sref': 'index'},
        {'title': 'My Availability', 'sref': 'index'},
        {'title': 'My Finished Classes', 'sref': 'index'},
        {'title': 'My EF', 'sref': 'index'}
      ];
    },
    odds: function(){
      return this.all().filter(function(v, i, arr){return i%2==0})
    },
    evens: function() {
      return this.all().filter(function(v, i, arr){return i%2!=0})
    }
  }
})


.controller('MainCtrl', function($scope, $timeout, $ionicModal, MenuF, $ionicSideMenuDelegate) {

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

  // Open our new task modal
  $scope.newTask = function() {
    $scope.taskModal.show();
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


})

.controller('SubsCtrl', function($scope) {
  console.log('SubsCtrl');
})

.controller('UpcomingCtrl', function($scope) {
  console.log('UpcomingCtrl');
})

.controller('IndexCtrl', function($scope, MenuF) {

  $scope.menuOdds = MenuF.odds();
  $scope.menuEvens = MenuF.evens();

})

.controller('ModalCtrl', function($scope) {

  $scope.createTask = function(menu) {
    $scope.menu.push({
      title: menu.title,
      sref: 'index'
    });
    $scope.taskModal.hide();
    menu.title = "";
  };

  // Close the new task modal
  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  };


});
