app.controller('IndexCtrl', function($scope, MenuF, $ionicLoading) {
  $ionicLoading.hide();
  'use strict';
  $scope.menuOdds = MenuF.odds();
  $scope.menuEvens = MenuF.evens();

});
