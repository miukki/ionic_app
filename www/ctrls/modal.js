app.controller('ModalCtrl', function($scope, $ionicLoading) {

  // Close the new task modal
  $scope.closeModal = function() {
    $ionicLoading.show();
    $scope.getSubsList();
    $scope.modal.hide();
  };


});
