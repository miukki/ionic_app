var teacherMemberId = '1872';
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic']);


app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/')

  $stateProvider.state('index', {
    url: '/list',
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


.run(function($ionicPlatform) {
    //load templates

  $ionicPlatform.ready(function() {
    console.log('ionic platform ready');

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


.constant('Constant', {
    'host': '10.128.42.95',
    'path': {
      'up': '/axis/wechat/LoadNextClassesMock?count=5',
      'subs': '/services/api/axis/query'
    },
    'teacherMemberId': teacherMemberId || '1872'


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

/*
.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(){
        })
        .error(function(){
        });
    }
}])

*/
.factory('Moment', function() {
  return function(t) {
    var d = new Date(t);
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    this.day = d.getDate();
    this.weekday = d.getDate() + ' ' + days[d.getDay()];
    this.time = (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) + ':' + (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()) + (d.getHours() < 12 ? 'am' : 'pm');
    this.month = months[d.getMonth()];
  }
});

