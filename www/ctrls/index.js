app.controller('IndexCtrl', function($scope, MenuF, $ionicLoading) {
  $ionicLoading.hide();

  $scope.menuOdds = MenuF.odds();
  $scope.menuEvens = MenuF.evens();

});
