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
      'subs': '/services/api/axis/query',
      'subsChain': '/services/api/axis/command/classcommand/AssignClass'
    },
    'teacherMemberId': teacherMemberId || '1872'
})

.factory('ObjF', function() {
  return {
    replaceObjectKeysToValue: function(obj, key, value, needAll) {
        var that = this;
        function isObject(some) {
            return (typeof some == 'object' && !Array.isArray(some));
        }
        var replaced = false;
        var method = needAll ? 'forEach' : 'some';

        Array.prototype[method].call(Object.keys(obj), function (keyName) {

            if (keyName == key) {
                obj[keyName] = value;
                replaced = true;
                return true;
            } else if (obj[keyName] && isObject(obj[keyName])) {
                var result = that.replaceObjectKeysToValue(obj[keyName], key, value, needAll);
                if (!replaced) replaced = result;
                return result;
            } else {
                return false;
            }

        });

        return replaced;
    }

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
    },
    emptyObj: function() {
      return {'param': {
         'classCriteria': {
            'timeRange': {'startTime': '', 'endTime': ''},
            'classGroup': {
              'serviceTypeCode': '',
              'serviceSubTypeCode': '',
              'levelCode': '',
              'partnerCode': '',
              'marketCode': '',
              'languageCode': '',
              'unitCode': '',
              'evcServerCode': ''
            },
            'classMeta': {'isVideoClass': false},
            'assignableTeacher': {'teacherMemberId': ''},
            'classStatus': []
          },
         'teacherCriteria': {'teacherMemberId': ''},
         'index': null

        }
      };
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

.factory('formDataObject', function() {
    return function(data) {
        var fd = new FormData();
        angular.forEach(data, function(value, key) {
            fd.append(key, value);
        });
        return fd;
    };
})

.factory('CallTroop', function($q, formDataObject, $http) {
    return function(URL, DATA, fl) {
      var deferred = $q.defer();
      var req = {
       method: 'POST',
       url: URL,
       data: DATA,
       headers: {'Content-Type': fl ? 'application/json' : undefined} //fl - if you need send post request with data
      };
      if (!fl) {
        req['transformRequest'] = formDataObject
      }

      $http(req).then(function(resp) {
        if (resp.data[0].status === 0) {
          deferred.resolve(resp);
        } else {
          deferred.reject({'code': resp.data[0].status, 'statusText': resp.data[0].message});
        }
      }, function(err){
        console.log('err', err)
        deferred.reject(err);
      });

      return deferred.promise;

    };
})

.factory('chainReq', function($q, CallTroop, Constant){
  return function(arr, subsCl){
    var output = [], deferred = $q.defer();

    fn(arr, 0);

    function fn(arr,index) {
      if (!arr[index]) {
        deferred.resolve();
        return;
      };

      CallTroop(Constant.path.subsChain, arr[index], true).then(function(resp){
          subsCl[arr[index].param['index']]['assigned'] = true;
          console.log('! success', subsCl[arr[index].param['index']]);

      }, function(err){
          subsCl[arr[index].param['index']]['assigned'] = false;
          console.error('ERR', err.code, err.statusText);

      }).finally(function(){
          var idx = arr[index].param['index'];
          //output = output.concat(subsCl.filter(function(v, i, arr){return i === idx}))
          index++; fn(arr, index);
      });

    };

    return deferred.promise;

  };

});



