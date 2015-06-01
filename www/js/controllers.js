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
