app.controller("permitsCtrl", function($scope, $location, $anchorScroll) {

    $scope.cbPermits = {
        regulations : true,
        health : false,
        camera : false,
        payment : true
      };
 
    $scope.dispalyTabContext = function(id) {
        //alert("Hello! I am an alert box!!");
        let children = document.getElementById("tabContent").children;
        for (let i = 0; i < children.length; i++) {
            //let tableChild = children[i];
            //tableChild.classList.remove('active');
            children[i].classList.remove('active');
        }

        let tab = document.getElementById(id);
        //let javaTab = document.getElementById("javatab");
        tab.classList.add('active');
        //$location.hash(id);

        // call $anchorScroll()
        //$anchorScroll();
    }

})
