
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
