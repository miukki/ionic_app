angular.module('starter', ['ionic']).config(function($stateProvider, $urlRouterProvider) {

  'use strict';

  $urlRouterProvider.otherwise('/');

  $stateProvider.state('index', {
    url: '/',
    templateUrl: 'index.html',
    controller: 'IndexCtrl'
  });

  $stateProvider.state('subs', {

    url: '/subs',
    templateUrl: 'subs.html',
    controller: 'SubsCtrl'
  });

  $stateProvider.state('upcoming', {
    url: '/upcoming',
    templateUrl: 'upcoming.html',
    controller: 'UpcomingCtrl'
  });

  $stateProvider.state('nograded', {
    url: '/nograded',
    templateUrl: 'nograded.html',
    controller: 'NogradedCtrl'
  });

})


.run(function($ionicPlatform) {
  'use strict';

  $ionicPlatform.ready(function() {
    console.log('ionic platform ready');

    // Hide the accessory bar by default
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

  });
})


.constant('Constant', {
    'strqNoGraded': 'axis_composite_class!\'{"TimeRange":{"StartTime":"%s","EndTime":"%s"},"Assignment":{"TeacherMemberId": "%s"},"ClassStatus":["assigned","booked"]}\'',
    'strqSubs': 'axis_assignable_class_type!\'{"TimeRange":{"StartTime":"%s","EndTime":"%s"}, "ClassStatus" :["Subout","New"], "AssignableTeacher":{"TeacherMemberId": "%s" }}\'',
    'path': {
      'up': '/axis/wechat/LoadNextClasses?count=100',
      'subs': '/services/api/axis/query',
      'subsChain': '/services/api/axis/command/classcommand/AssignClass',
      'swichAv': '/services/api/axis/command/teachercommand/UpdateAvailability'
    },
    'loaderSet': {
      content: '<ion-spinner icon="dots"></ion-spinner>',
      hideOnStageChange: true,
      animation: 'fade-in',
      showDelay: 0
    }

})

.factory('teacherMemberId', function(CallTroop, Constant){
  'use strict';
  return new CallTroop(Constant.path.subs, {q:'axis_context!current'}).then(function(resp){
    return resp.data[0].data.memberId;
  });
})


.factory('currentDay', function(CallTroop, Constant, $filter) {
  'use strict';
  return new CallTroop(Constant.path.subs, {q:'axis_server_time!current'}).then(function(resp){
    var t = resp.data[0].data;
    return $filter('YYYYMMDD')($filter('standartTimeStr')(t));
  });
})

.factory('ObjF', function() {
  'use strict';
  return {
    replaceObjectKeysToValue: function(obj, key, value, needAll) {
        var that = this;
        function isObject(some) {
            return (typeof some === 'object' && !Array.isArray(some));
        }
        var replaced = false;
        var method = needAll ? 'forEach' : 'some';

        Array.prototype[method].call(Object.keys(obj), function (keyName) {

            if (keyName === key) {
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

  };

})

.factory('MenuF', function() {
  'use strict';
  return {
    all: function() {
      return [
        {'title': 'Subs Available', 'sref': 'subs'},
        {'title': 'My Upcoming Classes', 'sref': 'upcoming'},
        {'title': 'No graded Classes', 'sref': 'nograded'}

      ];
    },
    odds: function(){
      return this.all().filter(function(v, i){return i%2===0;});
    },
    evens: function() {
      return this.all().filter(function(v, i){return i%2!==0;});
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

  };
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

.factory('formDataObject', function() { //transform config for multipart/form-data
  'use strict';
  return function(data) {
      var fd = new FormData();
      angular.forEach(data, function(value, key) {
          fd.append(key, value);
      });
      return fd;
  };
})

.factory('CallTroop', function(formDataObject, $http) { //CallTroop - frame for all requests to troop-service
    'use strict';
    return function(URL, DATA, ContentType) {
      var req = {
       method: 'POST',
       url: URL,
       data: DATA,
       headers: {'Content-Type': ContentType}
      };
      if (!ContentType) {
        req.transformRequest = formDataObject; //transform config for multipart/form-data
      }

      return $http(req).then(function(resp) { //define cash for $http
        if (resp.data[0].status === 0) { //only for this codeStatus - success
          return resp;
        } else {
          throw resp.data[0];
        }

      });


    };
})
.factory('setAvailability', function(CallTroop, Constant) {
  'use strict';
  return function(elem){
      var strT = elem.param.classCriteria.timeRange.startTime, endT = elem.param.classCriteria.timeRange.endTime, mId = elem.param.teacherCriteria.teacherMemberId;
      var q = {
        TimeRange: {StartTime: strT, EndTime: endT},
        AvailabilityDetail :[{ TeacherMemberId: mId, StartTime: strT, EndTime: endT }]
      }
      return new CallTroop(Constant.path.swichAv, {param: q}, 'application/json');
  };

})
.factory('chainReq', function($q, CallTroop, Constant, setAvailability){
  'use strict';
  return function(arr, subsCl){

    return $q.all(arr.map(function(elem){ //send chain of promises

      return setAvailability(elem).then(function(){
        console.log('availability success!');
        return new CallTroop(Constant.path.subsChain, elem, 'application/json')
      }).then(

          function(){
            subsCl[elem.param.index].assigned = true;
            console.log('! success', subsCl[elem.param.index]);
          },
          function(error){

            subsCl[elem.param.index].assigned = false;
            subsCl[elem.param.index].errorMessage = error.message;
          }

      );

    }));

  };

})

.factory('getMainList', function(CallTroop, Constant, $filter) {
  'use strict';
  return function(str) {

    return new CallTroop(Constant.path.subs, { q: str }).then(function(resp){
        var data = resp.data && resp.data[0].data instanceof Array && resp.data[0].data.length  ? resp.data[0].data : [];

        if (!data.length) {
          throw {message: 'No data!'}
        }

        if (data.length){

          return data.map(function(element) {
            var t = $filter('standartTimeStr')(element.startTime);
            angular.extend(element, {weekday: $filter('date')(t, 'dd','+400') + ' ' + $filter('date')(t,'MMM','+400') + ' ' + $filter('date')(t,'EEE','+400'), time: $filter('date')(t,'shortTime','+400')});
            return element;
          });

        }

    });

  }

})

.factory('getSubsList', function(CallTroop, Constant, $filter) {
  'use strict';

  return function (interval, ID) {
    var str = $filter('sprintf')(Constant.strqSubs, interval[0], interval[1], ID);
    console.log('interval!', interval, 'ID', ID); //debug

    return new CallTroop(Constant.path.subs, { q: str }).then(function(resp){
        var subsCl = resp.data && resp.data[0].data instanceof Array && resp.data[0].data.length  ? resp.data[0].data : [];

        if (!subsCl.length) {
          throw {message: 'No data!'}
        }
        if (subsCl.length){
          subsCl.forEach(function(element) {
            //convert to standartTimeStr otherwise error in Safari
            var t = $filter('standartTimeStr')(element.startTime);
            angular.extend(element, {date: $filter('date')(t, 'medium', '+400'), choosen: false});
          });
        }

        return subsCl;
    });

  };



})

.filter('errorTxt', function() {
  'use strict';
  return function (error) { //not asyn we not need use $stateful
    if (error) return 'Error: ' +  (error.status || '') +  ' ' + (error.statusText || error.message || 'Error Request');
  };
})

.filter('sprintf', function() {
    'use strict';
    return function() {
      function parse(str, args) {
          var i = 0;
          return str.replace(/%s/g, function() { return args[i++] || '';});
      }
      return parse(Array.prototype.slice.call(arguments, 0,1)[0], Array.prototype.slice.call(arguments, 1));
    };
})

.filter('standartTimeStr', function() {
  'use strict';
  return function(t){
    return t.replace(/\s+/g, 'T').concat('.000+00:00');
  }

})

.filter('YYYYMMDD', function($filter){
  'use strict';
  return function(t) {
    //making format yyyy-mm-dd
    return $filter('date')(t,'yyyy','+400') + '-' + $filter('date')(t,'MM','+400') + '-' + $filter('date')(t,'dd','+400');
  };
})

.filter('SetIntDay', function($filter){
  'use strict';
  return function(t, shift) {

    var currD = $filter('ShiftDay')(t,shift),
    nextD = $filter('ShiftDay')(currD,1);

    return [].concat([currD, nextD]);
  };

})

.filter('ShiftDay', function($filter){
  'use strict';

  return function (d, shift) {
    var date = new Date($filter('date')(d, 'medium', '+400')); //take correct timezone (NYT)
    return $filter('YYYYMMDD')(date.setDate(date.getDate() + (shift || 0))); //shift day
  }


});




