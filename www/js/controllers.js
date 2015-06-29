angular.module('starter').controller('IndexCtrl', function($scope, MenuF, $ionicLoading) {
  'use strict';
  $ionicLoading.hide();
  $scope.menu = MenuF.all();
});

angular.module('starter').controller('MainCtrl', function($scope, $timeout, MenuF, $ionicSideMenuDelegate) {
  'use strict';

  $scope.stateMenu = true;
  $scope.menu = MenuF.all();


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

angular.module('starter').controller('ModalCtrl', function($scope, $ionicLoading) {
  'use strict';
  // Close the new task modal
  $scope.closeModal = function() {
    $ionicLoading.show();
    $scope.modal.hide();
    $scope.doRefresh();
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

angular.module('starter').controller('NogradedCtrl', function($scope, $http, $ionicLoading, Constant, $filter, $q, currentDay, teacherMemberId, getMainList) {
  'use strict';
  $scope.nogradedCl = [];
  $scope.error = '';

  var cDay, ID;

  function errCb(error) {
    $scope.error = error; $ionicLoading.hide(); throw error;
  }

  $q.all([currentDay, teacherMemberId]).then(function(result){
    console.log('result', result)
    cDay = result[0];
    ID = result[1];

  }, errCb).then(function(){

    $ionicLoading.show(Constant.loaderSet);
    $scope.interval = [$filter('ShiftDay')(cDay, -7), cDay]

    var str = $filter('sprintf')(Constant.strqNoGraded, $scope.interval[0], $scope.interval[1], ID);
    return getMainList(str);

  }).then(function(data){ $scope.nogradedCl = data; }, errCb).finally(function(){
    $ionicLoading.hide();
  });


});


angular.module('starter').controller('SubsCtrl', function($scope, $ionicModal, $ionicLoading, Constant, MenuF, ObjF, chainReq, $timeout, $filter, getSubsList, currentDay, teacherMemberId, $q) {
  'use strict';
  $scope.error = '';
  $scope.subsCl = [];
  $scope.isDisabled = false;
  $scope.shift = 0;

  var ID, cDay;

  function errCb(error) {
    $scope.error = error; $ionicLoading.hide(); throw error;
  }

  $q.all([currentDay, teacherMemberId]).then(function(result){
    cDay = result[0];
    ID = result[1];

  }, errCb).then(function(){
    $ionicLoading.show(Constant.loaderSet);
    loadD();
  });

  // Create and load the Modal (popup for status-of-chosen-classes)
  $ionicModal.fromTemplateUrl('modal.html', function(modal) {
    $scope.modal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up',
    backdropClickToClose: false
  });


  function loadD() {
    $scope.error = '';
    $scope.subsCl = '';
    $scope.interval = $filter('SetIntDay')(cDay, $scope.shift);
    return getSubsList($scope.interval, ID).then(function(data) {
      $scope.subsCl = data;
    }, errCb).then(function(){
      $ionicLoading.hide();
    });

  }


  $scope.toggleClaim = function(fl) {
    $scope.subsCl.forEach(function(element) {
      element.choosen = fl;
    });
  };

  $scope.checkToggle = function() {
    return $scope.subsCl ? $scope.subsCl.filter(function(element) {
      return element.choosen === true;
    }).length : undefined;
  };


  $scope.newPost = function() {
    $scope.postData = [];
    $scope.isDisabled = true;

    $scope.subsCl.forEach(function(element, index){

      if (element.choosen) {
        var obj = MenuF.emptyObj();

        //inconsistent data!
        angular.extend(element, {'index': index, 'teacherMemberId': ID, 'classStatus': new Array(element.classStatusCode, 'Subout')});
        //inconsistent data!

        //preparing opbject for push to server
        Array.prototype.forEach.call(Object.keys(element), function (keyName){
          ObjF.replaceObjectKeysToValue(obj, keyName, element[keyName], true);
        });

        $scope.postData.push(obj);
      }

    });

    chainReq($scope.postData, $scope.subsCl).finally(function(){
      $scope.isDisabled = false;
      $scope.modal.show();
    });

  };


  $scope.pNextPrev = function (dir) {
    $scope.shift = dir > 0 ? $scope.shift + 1 : $scope.shift - 1;
    console.log('$scope.shift', $scope.shift);
    $ionicLoading.show();
    loadD();
  };

  $scope.loadMoreData = function() {
    $scope.shift = $scope.shift + 1;

    loadD().then(function() {

      $timeout(function() {
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }, 2000);

    });

  };

  $scope.$on('$stateChangeSuccess', function() {
    //$scope.loadMoreData(); not neccessary!
  });


  $scope.doRefresh = function() {
      loadD().then(function() {
        $scope.$broadcast('scroll.refreshComplete');
      });

  };



});

angular.module('starter').controller('UpcomingCtrl', function($scope, $http, $ionicLoading, Constant, $filter, $q, currentDay, teacherMemberId, getMainList) {
  'use strict';
  $scope.upcomingCl = [];
  $scope.error = '';

  var cDay, ID;

  function errCb(error) {
    $scope.error = error; $ionicLoading.hide(); throw error;
  }

  $q.all([currentDay, teacherMemberId]).then(function(result){
    console.log('result', result)
    cDay = result[0];
    ID = result[1];

  }, errCb).then(function(){

    $ionicLoading.show(Constant.loaderSet);
    $scope.interval = [cDay, $filter('ShiftDay')(cDay, 7)]

    var str = $filter('sprintf')(Constant.strqNoGraded, $scope.interval[0], $scope.interval[1], ID);
    return getMainList(str);

  }).then(function(data){ $scope.upcomingCl = data; }, errCb).finally(function(){
    $ionicLoading.hide();
  });


});
