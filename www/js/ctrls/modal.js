angular.module('starter').controller('ModalCtrl', function($scope, $ionicLoading) {
  'use strict';
  // Close the new task modal
  $scope.closeModal = function() {
    $ionicLoading.show();
    $scope.modal.hide();
    $scope.doRefresh();
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
