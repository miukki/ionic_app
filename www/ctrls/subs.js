app.controller('SubsCtrl', function($scope, $ionicModal, $ionicLoading, Moment, Constant, CallTroop, MenuF, ObjF, chainReq, $timeout) {
  $ionicLoading.show();
  $scope.error = '';
  $scope.subsCl = [];
  $scope.isDisabled = false;

  // Create and load the Modal
  $ionicModal.fromTemplateUrl('modal.html', function(modal) {
    $scope.modal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });



  $scope.toggleClaim = function(fl) {
    $scope.subsCl.forEach(function(element, index, array) {
      element.choosen = fl;
    });
  }

  $scope.newPost = function() {
    $scope.postData = [];
    $scope.isDisabled = true;


    $scope.subsCl.forEach(function(element, index, array){

      if (element.choosen) {
        var obj = MenuF.emptyObj();
          element['index'] = index;
        //inconsistent data!
          element['teacherMemberId'] = Constant.teacherMemberId;
          element['classStatus'] = new Array(element.classStatusCode, 'Subout');
        //inconsistent data!

        Array.prototype.forEach.call(Object.keys(element), function (keyName, i, arr){
          ObjF.replaceObjectKeysToValue(obj, keyName, element[keyName], true);
        });

        $scope.postData.push(obj);
      }

    });

    chainReq($scope.postData, $scope.subsCl).then(function(){
      $scope.isDisabled = false;
      $scope.modal.show();
    });

  }


  $scope.doRefresh = function() {
    $scope.getSubsList(function() {
      $scope.$broadcast('scroll.refreshComplete');
    });

  };


  $scope.getSubsList = function(cb) {
    var data = { q: 'axis_assignable_class_type!\'{"TimeRange":{"StartTime":"2015-12-4","EndTime":"2015-12-5"}, "ClassStatus" :["Subout","New"], "AssignableTeacher":{"TeacherMemberId": "' + Constant.teacherMemberId + '"}}\'' };

    CallTroop(Constant.path.subs, data).then(function(resp){
        $scope.subsCl = resp.data && resp.data[0].data instanceof Array && resp.data[0].data.length  ? resp.data[0].data : [];

        if (!$scope.subsCl.length){
          $scope.error = 'No data';
        } else {
          $scope.subsCl.forEach(function(element, index, array) {

            element.month = new Moment(element.startTime).month;
            element.day = new Moment(element.startTime).day;
            element.time = new Moment(element.startTime).time;
            element.choosen = false;

          });
        }

        $ionicLoading.hide();


    }, function(err) {

        console.error('ERR', err.code, err.statusText);
        $ionicLoading.hide();
        $scope.error = 'Error: ' +  err.statusText || 'Error Request';

    }).finally(cb);

  }

  $scope.getSubsList();


});
