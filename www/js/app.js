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
    }
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
})



.controller('MainCtrl', function($scope, $timeout, $ionicModal, MenuF, $ionicSideMenuDelegate, $ionicLoading) {
  $scope.stateMenu = true;
  $scope.menu = MenuF.all();


  // Setup the loader
  $ionicLoading.show({
    content: '<ion-spinner icon="dots"></ion-spinner>',
    hideOnStageChange: true,
    animation: 'fade-in',
    showDelay: 0
  });


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

.controller('SubsCtrl', function($scope, $ionicLoading, $http, Moment, Constant) {
  $ionicLoading.show();
  $scope.error = '';
  $scope.subsCl = [];

  $scope.toggleClaim = function(fl) {
    $scope.subsCl.forEach(function(element, index, array) {
      element.choose = fl;
    });
  }

  $scope.newPost = function() {
    console.log('postData', $scope.subsCl.filter(function(element){ return element.choose}));
  }


  var req = {
   method: 'POST',
   url: Constant.path.subs,
   headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
   },
   data: { q: 'axis_assignable_class_type!\'{"TimeRange":{"StartTime":"2015-12-1","EndTime":"2015-12-2"}, "ClassStatus" :["Subout","New"], "AssignableTeacher":{"TeacherMemberId": "1872"}}\'' },

   transformRequest: function(obj) {
        var str = [];
        for (var key in obj) {
            if (obj[key] instanceof Array) {
                for(var idx in obj[key]){
                    var subObj = obj[key][idx];
                    for(var subKey in subObj){
                        str.push(encodeURIComponent(key) + "[" + idx + "][" + encodeURIComponent(subKey) + "]=" + encodeURIComponent(subObj[subKey]));
                    }
                }
            }
            else {
                str.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
            }
        }
        return str.join("&");
    }

  }

  $http(req)
    .success(function(data, status, headers, config) {
      console.log(data)
    })
    .error(function(data, status, headers, config) {
      console.log('error')
    });

  /*

  $http.get('http://' ).then(function(resp) {
    $scope.subsCl = resp.data.IsSuccess && resp.data.Result instanceof Array && resp.data.Result.length  ? resp.data.Result : [];

    $scope.subsCl.forEach(function(element, index, array) {
      element.month = new Moment(element.StartTime).month;
      element.day = new Moment(element.StartTime).day;
      element.time = new Moment(element.StartTime).time;
      element.choose = false;
    });

    $ionicLoading.hide();

    }, function(err) {
      console.error('ERR', err.config, err.statusText);
      $ionicLoading.hide();
      $scope.error = err.statusText || 'Error Request';
  });

*/

})

.controller('UpcomingCtrl', function($scope, $http, $ionicLoading, Moment, Constant) {
  $ionicLoading.show();
  $scope.upcomingCl = [];
  $scope.error = '';

  $http.get('http://' + Constant.host + Constant.path.up).then(function(resp) {
    $scope.upcomingCl = resp.data.IsSuccess && resp.data.Result instanceof Array && resp.data.Result.length  ? resp.data.Result : [];

    $scope.upcomingCl.forEach(function(element, index, array) {
      element.weekday = new Moment(element.StartTime).weekday;
      element.time = new Moment(element.StartTime).time
    });

    $ionicLoading.hide();

  }, function(err) {

    console.error('ERR', err.config, err.statusText);
    $ionicLoading.hide();
    $scope.error = err.statusText || 'Error Request';
  })

})

.controller('IndexCtrl', function($scope, MenuF, $ionicLoading) {
  $ionicLoading.hide();

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
