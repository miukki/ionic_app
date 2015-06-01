app.controller('MainCtrl', function($scope, $timeout, $ionicModal, MenuF, $ionicSideMenuDelegate, $ionicLoading) {

  $scope.stateMenu = true;
  $scope.menu = MenuF.all();


  // Setup the loader
  $ionicLoading.show({
    content: '<ion-spinner icon="dots"></ion-spinner>',
    hideOnStageChange: true,
    animation: 'fade-in',
    showDelay: 0
  });


  // Create and load the Modal
  $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $scope.selectMenu = function(item, index) {
    $scope.activeMenu = item;
    $scope.toggleMenu($scope.stateMenu);
  };

  // Open our new task modal
  $scope.newTask = function() {
    $scope.taskModal.show();
  };


  //open left menu
  $scope.toggleMenu = function(fl) {
    $ionicSideMenuDelegate.toggleLeft(fl);
    $scope.stateMenu = !$scope.stateMenu;
  };


  // $timeout so everything is initialized
  $timeout(function() {
    if($scope.menu.length == 0) {
      while(true) {
        //show popup 'no-data available'
        break;
      }
    }
  });


});
