app.controller('SubsCtrl', function($scope, $ionicLoading, $http, Moment, Constant) {
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
   data: { q: 'axis_assignable_class_type!\'{"TimeRange":{"StartTime":"2015-12-1","EndTime":"2015-12-2"}, "ClassStatus" :["Subout","New"], "AssignableTeacher":{"TeacherMemberId": "' + Constant.teacherMemberId + '"}}\'' },

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

  $http(req).then(function(resp) {
    $scope.subsCl = resp.data && resp.data[0].data instanceof Array && resp.data[0].data.length  ? resp.data[0].data : [];

    console.log('$scope.subsCl', $scope.subsCl);

    $scope.subsCl.forEach(function(element, index, array) {
      element.month = new Moment(element.startTime).month;
      element.day = new Moment(element.startTime).day;
      element.time = new Moment(element.startTime).time;
      element.choose = false;
    });

    $ionicLoading.hide();


  }, function(err){

      console.error('ERR', err.config, err.statusText);
      $ionicLoading.hide();
      $scope.error = err.statusText || 'Error Request';

  });


});
