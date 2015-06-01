app.controller('ModalCtrl', function($scope) {

  $scope.createTask = function(menu) {
    $scope.menu.push({
      title: menu.title,
      sref: 'index'
    });
    $scope.taskModal.hide();
    menu.title = "";
  };

  // Close the new task modal
  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  };


});
