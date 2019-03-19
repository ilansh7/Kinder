
app.controller("navbarCtrl", function($scope, $rootScope, loginSrv, $uibModal, $log, $location) {

    $rootScope.selected = "xxx";
    $rootScope.modalInstance = undefined;
    $scope.isUserLoggedIn = function() {
        return loginSrv.isLoggedIn();
    }

    // $scope.logout = function() {
    //     userSrv.logout();
    //     $location.path("/");
    // }

    $scope.openModal = function () {
        //var parentElem = parentSelector ? angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
        $rootScope.modalInstance = $uibModal.open({
          //animation: true,
          //ariaLabelledBy: 'modal-title',
          //ariaDescribedBy: 'modal-body',
          templateUrl: 'app/login/login1.html',
          //windowTemplateUrl: 'app/login/login.html'//,
          //component: someComponentWithContent,
          controller: 'loginCtrl',
          //controllerAs: '$ctrl',
          //size: size,
          //appendTo: parentElem,
        });

        var someComponentWithContent = {

            bindings:{
              modalInstance:"<",
              resolve:"<"
            },
            controller: 'loginCtrl',
            template:"Some template"
            
            };        

        $rootScope.modalInstance.result.then(function (selectedItem) {
            $rootScope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }


    // $scope.openModal = function () {
    //   var modalInstance = $uibModal.open({
    //     animation: $ctrl.animationsEnabled,
    //     component: 'modalComponent',
    //     resolve: {
    //       items: function () {
    //         return $ctrl.items;
    //       }
    //     }
    //   });
  
    //   modalInstance.result.then(function (selectedItem) {
    //     $ctrl.selected = selectedItem;
    //   }, function () {
    //     $log.info('modal-component dismissed at: ' + new Date());
    //   });
    // };

    $scope.okBtn = function () {
        $log.info("ok pressed from navbarCtrl");
        $rootScope.modalInstance.close($scope.selected.item);
      };
    
      $scope.cancel = function () {
        modalInstance.dismiss('cancel');
      };
  
    

    $scope.tempo = 0;
})