app.controller('ModalCtrl', function($scope, $ionicLoading, getSubsList, Constant) {

  // Close the new task modal
  $scope.closeModal = function() {
    $ionicLoading.show();
    $scope.modal.hide();

    console.log('$scope.shift', $scope.shift);
    $scope.doRefresh($scope.shift)
  };

 //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    // Execute
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });


});
