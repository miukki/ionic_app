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
