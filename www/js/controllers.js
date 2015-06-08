app.controller('IndexCtrl', function($scope, MenuF, $ionicLoading) {
  $ionicLoading.hide();
  'use strict';
  $scope.menuOdds = MenuF.odds();
  $scope.menuEvens = MenuF.evens();

});

app.controller('MainCtrl', function($scope, $timeout, MenuF, $ionicSideMenuDelegate, $ionicLoading) {
  'use strict';

  $scope.stateMenu = true;
  $scope.menu = MenuF.all();


  // Setup the loader
  $ionicLoading.show({
    content: '<ion-spinner icon="dots"></ion-spinner>',
    hideOnStageChange: true,
    animation: 'fade-in',
    showDelay: 0
  });


  $scope.selectMenu = function(item) {
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
    if($scope.menu.length === 0) {
      while(true) {
        //show popup 'no-data available'
        break;
      }
    }
  });


});

app.controller('ModalCtrl', function($scope, $ionicLoading, getSubsList, Constant) {

  // Close the new task modal
  $scope.closeModal = function() {
    $ionicLoading.show();
    $scope.modal.hide();

    console.log('$scope.shift', $scope.shift);
    $scope.doRefresh($scope.shift)
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
  });


});


app.controller('SubsCtrl', function($scope, $ionicModal, $ionicLoading, Constant, CallTroop, MenuF, ObjF, chainReq, $timeout, $filter, getSubsList) {
  'use strict';

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
      };
  })();


  $scope.toggleClaim = function(fl) {
    $scope.subsCl.forEach(function(element) {
      element.choosen = fl;
    });
  };

  $scope.newPost = function() {
    $scope.postData = [];
    $scope.isDisabled = true;


    $scope.subsCl.forEach(function(element, index){

      if (element.choosen) {
        var obj = MenuF.emptyObj();

        //inconsistent data!
          angular.extend(element, {'index': index, 'teacherMemberId': Constant.teacherMemberId, 'classStatus': new Array(element.classStatusCode, 'Subout')});
        //inconsistent data!

        Array.prototype.forEach.call(Object.keys(element), function (keyName){
          ObjF.replaceObjectKeysToValue(obj, keyName, element[keyName], true);
        });

        $scope.postData.push(obj);
      }

    });

    chainReq($scope.postData, $scope.subsCl).then(function(){
      $scope.isDisabled = false;
      $scope.modal.show();
    });

  };


  $scope.moreDataCanBeLoaded = function() {
    var fl = $scope.shift < 9  ? true : false;
    return fl;
  };

  $scope.loadMoreData = function() {
    $scope.shift = step();
    console.log('loadMoreData', $scope.shift);

    $scope.interval = $filter('SetIntDay')(Constant.currentDay, $scope.shift);
    getSubsList(Constant.currentDay, $scope.shift).then(function(data) {

      if (data.error) {
        $scope.error = data.error; return;
      }
      $scope.subsCl = data.subsCl;//$scope.subsCl.concat(data['subsCl']);

      $timeout(function() {
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }, 2000);

    });
  };

  $scope.$on('$stateChangeSuccess', function() {
    //$scope.loadMoreData();
  });

  $scope.doRefresh = function(shift) {
    $scope.interval = $filter('SetIntDay')(Constant.currentDay, shift || 0);
    getSubsList(Constant.currentDay, shift || 0).then(function(data) {
      if (data.error) {
        $scope.error = data.error; return;
      }
      $scope.subsCl = data.subsCl;
      $scope.shift = shift || 0;
      $scope.$broadcast('scroll.refreshComplete');
    });

  };

  $scope.interval = $filter('SetIntDay')(Constant.currentDay, $scope.shift);
  getSubsList(Constant.currentDay, $scope.shift).then(function(data) {
      if (data.error) {
        $scope.error = data.error; return;
      }
      $scope.subsCl = data.subsCl;
  });

/*


link: function($scope, element, attrs){

    $scope.$parent.$watch(attrs.ngDisabled, function(newVal){
        element.prop('disabled', newVal);
    });

    //...
}


*/


});

app.controller('UpcomingCtrl', function($scope, $http, $ionicLoading, Constant, $filter) {
  'use strict';
  $ionicLoading.show();
  $scope.upcomingCl = [];
  $scope.error = '';

  $http.get(Constant.path.up).then(function(resp) {
    $scope.upcomingCl = resp.data.IsSuccess && resp.data.Result instanceof Array && resp.data.Result.length  ? resp.data.Result : [];

    $scope.upcomingCl.forEach(function(element) {
      var t = new Date(element.StartTime);
      angular.extend(element, {weekday: $filter('date')(t, 'EEE'), time: $filter('date')(t, 'hh') + ':' + $filter('date')(t, 'mm')});

    });

    $ionicLoading.hide();

  }, function(err) {

    console.error('ERR', err.config, err.statusText);
    $ionicLoading.hide();
    $scope.error = err.statusText || 'Error Request';

  });

});
