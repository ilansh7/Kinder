app.controller("phoneCtrl", function($scope, $log, phoneSrv, appUser) {

    $scope.mySelf = {fName: 'Ilan',lName: 'Shchori'};
    const default_country_code = "972";
    $scope.phoneAreaCodes = appUser.lists[1];
    $scope.phoneTypes = appUser.lists[2];
    $scope.phonesArr = [];
    //$scope.gPhonesArr = [];
    //$scope.sPhonesArr = [];

    //getPhones(objId, objType, type)
    phoneSrv.getPhones(undefined, appUser.codes.guardian_object_type, undefined).then(function(phoneResults) {
        appUser.activeFamily.gurdian.isNotEmptyLegalGardianPhones = false;
        appUser.activeFamily.spause.isNotEmptySpausePhones = false;
        //$scope.gPhonesArr = [];
        //$scope.sPhonesArr = [];
            if (!phoneResults) {
            //return;
        }
        else {
            // if (phoneResults.length > 0) {
            //     $scope.isNotEmptyLegalGardianPhones = true;
            // }
            $scope.phonesArr = phoneResults;
            $scope.phonesArr.forEach(function(element) {
                if (element.person_id == appUser.activeFamily.gurdian.id) {
                    appUser.activeFamily.gurdian.isNotEmptyLegalGardianPhones = true;
                    //$scope.gPhonesArr.push(element);
                }
                if (element.person_id == appUser.activeFamily.spause.id) {
                    appUser.activeFamily.spause.isNotEmptySpausePhones = true;
                    //$scope.sPhonesArr.push(element);
                }
            });
            //let ff = 0;
        }
    });

    $scope.savePhone = function() {
        $log.info("(phoneCtrl)Button SavePhone Clicked");
        //let closeModal = document.getElementById("btnDismissPhoneModal");
        //debugger;
        phoneSrv.addPhone(fillPhonePointer()).then(function(phone) {
            $scope.phonesArr.push(phone);
            //$scope.phonesArr = phoneResults;

            $scope.phone_type = "";
            $scope.phone_country = "972";
            $scope.phone_areaCode = "";
            $scope.phone_number = "";

            //closeModal.click();
            $('#addPhoneModal').modal('hide');
        });
    }

    $scope.setData = function(index) {
        let a1 = $scope.phonesArr[index];
        $log.info("setData() activatrd : " + $scope.phone.id);
    }

    function fillPhonePointer() {
        let personPtr = new Parse.Object("Person");
        if ($scope.phone.CurrentPersonType = appUser.familyRelation.familyHead) {
            personPtr.id = appUser.activeFamily.gurdian.id;
        }

        let phonePtr = new Parse.Object("Phones");
        phonePtr.set('ext', undefined);
        phonePtr.set('object_rel_type', appUser.activeFamily.gurdian.object_type);
        phonePtr.set('object_rel_id', personPtr);  
        phonePtr.set('type', $scope.phone_type);
        phonePtr.set('area_code', $scope.phone_areaCode);
        phonePtr.set('phone_number', $scope.phone_number);
        phonePtr.set('country_code', $scope.phone_country);

        return phonePtr;
    }


});