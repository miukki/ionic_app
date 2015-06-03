app.controller('SubsCtrl', function($scope, $ionicLoading, $http, Moment, Constant, $q, formDataObject, CallTroop, MenuF, ObjF) {
  $ionicLoading.show();
  $scope.error = '';
  $scope.subsCl = [];
  var data = { q: 'axis_assignable_class_type!\'{"TimeRange":{"StartTime":"2015-12-3","EndTime":"2015-12-4"}, "ClassStatus" :["Subout","New"], "AssignableTeacher":{"TeacherMemberId": "' + Constant.teacherMemberId + '"}}\'' };


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

          element['index'] = index;
          element['teacherMemberId'] = Constant.teacherMemberId;
          element['classStatus'] = new Array(element.classStatusCode, 'Subout');
        //inconsistent data!

        Array.prototype.forEach.call(Object.keys(element), function (keyName, i, arr){
          ObjF.replaceObjectKeysToValue(obj, keyName, element[keyName], true);
        });

        $scope.postData.push(obj);
      }

    });

    chainReq($scope.postData);

  }


  $scope.doRefresh = function() {
    getSubsList(data, function() {
      $scope.$broadcast('scroll.refreshComplete');
    });

  };


  function chainReq(arr) {
    fn(arr, 0);

    function fn(arr,index) {
      if (!arr[index]) {
        return;
      };


      CallTroop(Constant.path.subsChain, arr[index], true).then(function(resp){
          var idx = arr[index].param['index'];
          $scope.subsCl[idx]['assigned'] = true;
          console.log('! success', $scope.subsCl[idx]);

      }, function(err){

          console.error('ERR', err.code, err.statusText);

      }).finally(function(){
          console.log('finally', index);
          index++; fn(arr, index);

      });

    };



  }

  function getSubsList(data, cb) {

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

  getSubsList(data);


});
