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
