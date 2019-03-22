
app.controller("loginCtrl", function($scope, $rootScope, $location, $log, loginSrv, appUser) {

    $scope.invalidLogin = false;
    let email = "sample@email.com"; //nirch.work@gmail.com";
    let pwd = "123456"; //recipeBook123";
    email = "a@b.c";
    pwd = "a";
    email = "abc@def.com";
    pwd = "a";
    //let modal = 

    $scope.login = function() {
        let loginEmail = ($scope.email) ? $scope.email : email;
        let loginPwd = ($scope.pwd) ? $scope.pwd : pwd;

        //let modal = document.getElementById("loginModal");
        let closeModal = document.getElementById("btnDismissLoginModal");
        //debugger;
        loginSrv.login(loginEmail, loginPwd).then(function(activeUser) {
            $scope.activeUser = activeUser;
            appUser.activeUser = activeUser;
            $location.path("/family");
            closeModal.click();
        }, function() {
            $scope.invalidLogin = true;
        });

    }

    $scope.logout = function() {
        loginSrv.logout();//.then(function() {
            $scope.invalidLogin = false;
            $location.path("/");
        // }, function() {
        //     $scope.invalidLogin = false;
        // });

    }

    $scope.okBtn = function () {
        $log.info("ok pressed from loginCtrl");
        $rootScope.modalInstance.close($rootScope.selected.item);
        //this.close($rootScope.selected.item);
    };

    function someComponentController(){

        //here example usage of dismiss
        $rootScope.modalInstance.dismiss('cancel'); //this.modalInstance is $uibModalInstance
      
        $log.info(this.resolve); //here object with resolved params
      }
})
