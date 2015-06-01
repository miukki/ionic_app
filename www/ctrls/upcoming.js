app.controller('UpcomingCtrl', function($scope, $http, $ionicLoading, Moment, Constant) {
  $ionicLoading.show();
  $scope.upcomingCl = [];
  $scope.error = '';

  $http.get('http://' + Constant.host + Constant.path.up).then(function(resp) {
    $scope.upcomingCl = resp.data.IsSuccess && resp.data.Result instanceof Array && resp.data.Result.length  ? resp.data.Result : [];

    $scope.upcomingCl.forEach(function(element, index, array) {
      element.weekday = new Moment(element.StartTime).weekday;
      element.time = new Moment(element.StartTime).time
    });

    $ionicLoading.hide();

  }, function(err) {

    console.error('ERR', err.config, err.statusText);
    $ionicLoading.hide();
    $scope.error = err.statusText || 'Error Request';
  })

});
