app.controller('IndexCtrl', function($scope, MenuF, $ionicLoading) {
  $ionicLoading.hide();

  $scope.menuOdds = MenuF.odds();
  $scope.menuEvens = MenuF.evens();

});

app.controller('MainCtrl', function($scope, $timeout, MenuF, $ionicSideMenuDelegate, $ionicLoading) {

  $scope.stateMenu = true;
  $scope.menu = MenuF.all();


  // Setup the loader
  $ionicLoading.show({
    content: '<ion-spinner icon="dots"></ion-spinner>',
    hideOnStageChange: true,
    animation: 'fade-in',
    showDelay: 0
  });


  $scope.selectMenu = function(item, index) {
    $scope.activeMenu = item;
    $scope.toggleMenu($scope.stateMenu);
  };

  // Open our new task modal
  $scope.newTask = function() {
    //create new task;
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

app.controller('ModalCtrl', function($scope, $ionicLoading) {

  // Close the new task modal
  $scope.closeModal = function() {
    $ionicLoading.show();
    $scope.getSubsList();
    $scope.modal.hide();
  };

 //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    // Execute
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
    console.log('3')
  });


});

app.controller('SubsCtrl', function($scope, $ionicModal, $ionicLoading, Constant, CallTroop, MenuF, ObjF, chainReq, $timeout, $filter) {
  $ionicLoading.show();
  $scope.error = '';
  $scope.subsCl = [];
  $scope.isDisabled = false;

  // Create and load the Modal
  $ionicModal.fromTemplateUrl('modal.html', function(modal) {
    $scope.modal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up',
    backdropClickToClose: false
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
    $scope.getSubsList().finally(function(){
      $scope.$broadcast('scroll.refreshComplete');
    });

  };


  $scope.getSubsList = function(shift) {
    shift = shift || 0;
    var t = $filter('SetIntDay')('2015-12-01',shift); //0 - shift valeu
    //console.log('t',t);
    var str = $filter('sprintf')(Constant.strq, t[0], t[1], Constant.teacherMemberId);
    var data = { q: str };


    return CallTroop(Constant.path.subs, data).then(function(resp){
        $scope.subsCl = resp.data && resp.data[0].data instanceof Array && resp.data[0].data.length  ? resp.data[0].data : [];

        if (!$scope.subsCl.length){
          $scope.error = 'No data';
        } else {
          $scope.subsCl.forEach(function(element, index, array) {
            var t = new Date(element.startTime);
            angular.extend(element, {month: $filter('date')(t, 'MMM'), day: $filter('date')(t, 'dd'), time: $filter('date')(t, 'hh') + ':' + $filter('date')(t, 'mm'), choosen: false, assigned: undefined})
          });
        }

        $ionicLoading.hide();


    }, function(err) {

        console.error('ERR', err.code, err.statusText);
        $ionicLoading.hide();
        $scope.error = 'Error: ' +  err.statusText || 'Error Request';

    });

  }

  $scope.getSubsList();


});

app.controller('UpcomingCtrl', function($scope, $http, $ionicLoading, Constant, $filter) {
  $ionicLoading.show();
  $scope.upcomingCl = [];
  $scope.error = '';

  $http.get(Constant.path.up).then(function(resp) {
    $scope.upcomingCl = resp.data.IsSuccess && resp.data.Result instanceof Array && resp.data.Result.length  ? resp.data.Result : [];

    $scope.upcomingCl.forEach(function(element, index, array) {
      var t = new Date(element.StartTime);
      angular.extend(element, {weekday: $filter('date')(t, 'EEE'), time: $filter('date')(t, 'hh') + ':' + $filter('date')(t, 'mm')});

    });

    $ionicLoading.hide();

  }, function(err) {

    console.error('ERR', err.config, err.statusText);
    $ionicLoading.hide();
    $scope.error = err.statusText || 'Error Request';

  })

});
