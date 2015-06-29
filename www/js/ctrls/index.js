angular.module('starter').controller('IndexCtrl', function($scope, MenuF, $ionicLoading) {
  'use strict';
  $ionicLoading.hide();
  $scope.menu = MenuF.all();
});
