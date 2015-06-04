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

app.controller('SubsCtrl', function($scope, $ionicModal, $ionicLoading, Constant, CallTroop, MenuF, ObjF, chainReq, $timeout, $filter, getSubsList) {
  $ionicLoading.show();
  $scope.error = '';
  $scope.subsCl = [];
  $scope.isDisabled = false;
  $scope.shift = 0;

  // Create and load the Modal
  $ionicModal.fromTemplateUrl('modal.html', function(modal) {
    $scope.modal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up',
    backdropClickToClose: false
  });


  var step = (function() {
      var count= 1;
      return function () {
          return count++;
      }
  })();


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

        //inconsistent data!
          angular.extend(element, {'index': index, 'teacherMemberId': Constant.teacherMemberId, 'classStatus': new Array(element.classStatusCode, 'Subout')})
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


  $scope.moreDataCanBeLoaded = function(shift) {
    console.log('shift', shift);
    var fl = shift < 9  ? true : false;
    return fl;
  }

  $scope.loadMoreData = function() {
    $scope.shift = step();
    console.log('loadMoreData', $scope.shift)

    getSubsList(Constant.currentDay, $scope.shift).then(function(data) {

      if (data.err) {
        $scope.error = data.err; return;
      }
      $scope.subsCl = data['subsCl'];//$scope.subsCl.concat(data['subsCl']);

      $timeout(function() {
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }, 2000);

    });
  }

  $scope.$on('$stateChangeSuccess', function() {
    $scope.loadMoreData();
  });

  $scope.doRefresh = function() {
    getSubsList(Constant.currentDay, 0).then(function(data) {
      if (data.err) {
        $scope.error = data.err; return;
      }
      $scope.subsCl = data['subsCl'];
      $scope.shift = 0;
      $scope.$broadcast('scroll.refreshComplete');
    });

  };


  getSubsList(Constant.currentDay).then(function(data) {
      if (data.err) {
        $scope.error = data.err; return;
      }
      $scope.subsCl = data['subsCl'];
  });


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
