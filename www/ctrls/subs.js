app.controller('SubsCtrl', function($scope, $ionicLoading, $http, Moment, Constant, $q, formDataObject, CallTroop) {
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

  var data = { q: 'axis_assignable_class_type!\'{"TimeRange":{"StartTime":"2015-12-1","EndTime":"2015-12-2"}, "ClassStatus" :["Subout","New"], "AssignableTeacher":{"TeacherMemberId": "' + Constant.teacherMemberId + '"}}\'' };

  CallTroop(Constant.path.subs, data).then(function(resp){
      $scope.subsCl = resp.data && resp.data[0].data instanceof Array && resp.data[0].data.length  ? resp.data[0].data : [];

      $scope.subsCl.forEach(function(element, index, array) {

        element.month = new Moment(element.startTime).month;
        element.day = new Moment(element.startTime).day;
        element.time = new Moment(element.startTime).time;
        element.choose = false;

      });

      $ionicLoading.hide();

  }, function(err) {

      console.error('ERR', err.config, err.statusText);
      $ionicLoading.hide();
      $scope.error = 'Error: ' +  err.statusText || 'Error Request';

  });


});
