

app.controller("addressCtrl", function($scope, $log, appUser, addressSrv) {

    $scope.mySelf = {fName: 'Ilan',lName: 'Shchori'};
    let address_objct_id = "";
    let address_objct_type = "";
    $scope.addresses = [];
    $scope.addressType = appUser.lists[0];

    //sleep(2500);
    if ($scope.personType === "S") {
        address_objct_id = appUser.activeUser.spause; // "buyF60mvJw";
        address_objct_type = appUser.codes.spause_object_type;
    }
    if ($scope.personType === "G") {
        address_objct_id = appUser.activeUser.guardian; // "qF5itocZK3";
        address_objct_type = appUser.codes.guardian_object_type;
    }

    if ($scope.personType) {
    addressSrv.getAddress(address_objct_id, address_objct_type, 0).then(function(addressResults) {
        if (!addressResults) {
            //return;
        }
        else {
            $scope.isNotEmptyLegalGardianAddress = true;
            $scope.addresses = addressResults
            //$scope.guardian_addresses = addressResults;
        }
    });
    }

    $scope.saveAddress = function() {
        $log.info("Button SaveAddress Clicked");
        //let closeModal = document.getElementById("btnDismissAddressModal");
        //debugger;
        addressSrv.addAddress(fillAddressPointer()).then(function(address) {
            $scope.addresses.push(address);

            $scope.addr.type = "";
            $scope.addr.street = "";
            $scope.addr.house = "";
            $scope.addr.neighborhood = "";
            $scope.addr.city = "";
            $scope.addr.state = "";
            $scope.addr.zipcode = "";

            //closeModal.click();
            $('#addAddressModal').modal('hide');
        });
    }

    function fillAddressPointer() {
        let personPtr = new Parse.Object("Person");
        personPtr.id = $scope.currFamily.gurdian.objectId;

        let addressPtr = new Parse.Object("Address");
        addressPtr.set('type', $scope.addr.type);
        addressPtr.set('address1', $scope.addr.street);
        addressPtr.set('address2', undefined);
        addressPtr.set('city', $scope.addr.city);
        addressPtr.set('house', $scope.addr.house);
        addressPtr.set('misc', $scope.addr.neighborhood);
        addressPtr.set('state', $scope.addr.state);
        addressPtr.set('country', 'Israel');
        addressPtr.set('zipcode', $scope.addr.zipcode);
        addressPtr.set('location', undefined);
        addressPtr.set('object_rel_type', $scope.currFamily.gurdian.object_type);
        addressPtr.set('object_rel_id', personPtr);        

        return addressPtr;
    }



});