app.controller('SubsCtrl', function($scope, $ionicLoading, $http, Moment, Constant, $q, formDataObject, CallTroop, MenuF, ObjF) {
  $ionicLoading.show();
  $scope.error = '';
  $scope.subsCl = [];

  $scope.toggleClaim = function(fl) {
    $scope.subsCl.forEach(function(element, index, array) {
      element.choosen = fl;
    });
  }

  $scope.newPost = function() {
    $scope.postData = [];

    $scope.subsCl.forEach(function(element, index, array){

      if (element.choosen) {
        var obj = MenuF.emptyObj();
        //inconsistent data!
          element['teacherMemberId'] = Constant.teacherMemberId;
          element['classStatus'] = new Array(element.classStatusCode);
        //inconsistent data!

        Array.prototype.forEach.call(Object.keys(element), function (keyName, i, arr){
          ObjF.replaceObjectKeysToValue(obj, keyName, element[keyName], true);
        });

        $scope.postData.push(obj);
      }

    });


    chainReq($scope.postData);

  }

  var data = { q: 'axis_assignable_class_type!\'{"TimeRange":{"StartTime":"2015-12-1","EndTime":"2015-12-2"}, "ClassStatus" :["Subout","New"], "AssignableTeacher":{"TeacherMemberId": "' + Constant.teacherMemberId + '"}}\'' };

  $scope.doRefresh = function() {
    getSubsList(function() {
      $scope.$broadcast('scroll.refreshComplete');
    });

  };

  getSubsList();

  function chainReq(arr) {
    console.log('arr', arr);
  }

  function getSubsList(cb) {

    CallTroop(Constant.path.subs, data).then(function(resp){
        $scope.subsCl = resp.data && resp.data[0].data instanceof Array && resp.data[0].data.length  ? resp.data[0].data : [];

        $scope.subsCl.forEach(function(element, index, array) {

          element.month = new Moment(element.startTime).month;
          element.day = new Moment(element.startTime).day;
          element.time = new Moment(element.startTime).time;
          element.choosen = false;

        });

        $ionicLoading.hide();

    }, function(err) {

        console.error('ERR', err.config, err.statusText);
        $ionicLoading.hide();
        $scope.error = 'Error: ' +  err.statusText || 'Error Request';

    }).finally(cb);

  }


});
