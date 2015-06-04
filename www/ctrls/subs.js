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
