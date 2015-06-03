app.controller('IndexCtrl', function($scope, MenuF, $ionicLoading) {
  $ionicLoading.hide();

  $scope.menuOdds = MenuF.odds();
  $scope.menuEvens = MenuF.evens();

});

app.controller('MainCtrl', function($scope, $timeout, $ionicModal, MenuF, $ionicSideMenuDelegate, $ionicLoading) {

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


});

app.controller('ModalCtrl', function($scope) {

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

app.controller('UpcomingCtrl', function($scope, $http, $ionicLoading, Moment, Constant) {
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

});
