app.controller('IndexCtrl', function($scope, MenuF, $ionicLoading) {
  'use strict';
  $ionicLoading.hide();
  $scope.menuOdds = MenuF.odds();
  $scope.menuEvens = MenuF.evens();

});
