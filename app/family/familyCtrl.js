

app.controller("familyCtrl", function($scope, $location, $log, appUser, loginSrv, personSrv, familySrv, addressSrv, phoneSrv) {

    $scope.currFamily = {
        activeUser : null,
        //userId : "",
        family : null,
        familyId : "",
        familyNum : "",
        guardianName : "",
        gurdian : {},
        spause : {}
    }
    $scope.newPersonObj = {
        family_rel_type : "",
        identity_id: "",
        last_name : "",
        first_name : "",
        birthday : ""
    }
    $scope.familyRelation = appUser.lists[3];
    $scope.invalid_gurdian_identity_id = false;

    if (!loginSrv.isLoggedIn()) {
        $location.path("/");
        return;
    }

    if (!$scope.currFamily.activeUser) {
        $scope.currFamily.activeUser = loginSrv.getActiveUser();
    }

    $scope.createFamilyMember = function(type) {
        let identityId = undefined;
        let familyRelationType = type;
        $scope.newPersonObj.family_rel_type = type;

        if (type === "G") { // Guardian
            if ($scope.currFamily.gurdian) {
                identityId = $scope.currFamily.gurdian.identity_id;
            }
            //familyRelationType = $scope.familyRelation.familyHead; //appUser.lists[3].familyHead;
        }
        if (type === "S") { // Spause
            if ($scope.currFamily.spause) {
                identityId = $scope.currFamily.spause.identity_id;
            }
            //familyRelationType = $scope.familyRelation.spause; // appUser.lists[3].spause;
        }

        if (identityId && !validateId(identityId)) {
            return false;
        }
        $log.info("Button Create Legal Gardian clicked");
        // add Family object
        if ($scope.currFamily.family) {
            // Family object found
            let personType = {
                family_Obj : $scope.currFamily.family.id,
                family_rel_type : familyRelationType
            }        
        
            personSrv.getPerson(personType).then(function(results) {
                let a = 5;
                if (!results || results.length == 0) {
                    // Create Person (Guardian) object
                    personSrv.addPerson(fillPersonPointer()).then(function(person) {
                        if (personType.family_rel_type == $scope.familyRelation.familyHead) {
                            $scope.isEmptyLegalGardian = false;
                        }
                        if (personType.family_rel_type == $scope.familyRelation.spause) {
                            $scope.isEmptySpause = false;
                        }
                    });
                    return;
                }
                // Person (Suardian) found
            });
        }
        else {
            familySrv.addFamily().then(function(family) {
                $scope.currFamily.familyId = family.objectId;
                //$scope.currFamily.family = appUser.activeUser.family_Obj;
                //$scope.currFamily.familyNum = familySrv.calcFamilyNum($scope.currFamily.family.id);
                
                appUser.getObject(family.objectId, "Family").then(function(familyObj) {

                    // apply Family_id to current user loggedin
                    let updateUserParams = [
                        {
                            key: "family_id",
                            value: familyObj
                        }
                    ];
                    loginSrv.updateUser(updateUserParams).then(function(user) {
                        //sleep(3000);
                        // create head of familt class
                        personSrv.addPerson(fillPersonPointer()).then(function(person) {
                            $scope.currFamily.familyNum = person.familyNum;
                            $scope.currFamily.gurdian = person;
                            appUser.activeUser.gurdian = person.objectId;
                            if (type === "G") { // Spause
                                appUser.activeUser.gurdian = person.objectId;
                                $scope.isEmptyLegalGardian = false;
                            }
                            if (type === "S") { // Spause
                                appUser.activeUser.spause = person.objectId;
                                $scope.isEmptySpause = false;
                            }
                        });
                    });
                });
            });
        }
    }

    $scope.saveAddress = function() {
        $log.info("Button SaveAddress Clicked");
        //let closeModal = document.getElementById("btnDismissAddressModal");
        //debugger;
        addressSrv.addAddress(fillAddressPointer()).then(function(address) {
            $scope.guardian_addresses.push(address);

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
    
    $scope.savePhone = function() {
        $log.info("Button SavePhone Clicked");
        //let closeModal = document.getElementById("btnDismissPhoneModal");
        //debugger;
        phoneSrv.addPhone(fillPhonePointer()).then(function(phone) {
            $scope.guardian_phones.push(phone);

            $scope.phone_type = "";
            $scope.phone_country = "972";
            $scope.phone_areaCode = "";
            $scope.phone_number = "";

            //closeModal.click();
            $('#addPhoneModal').modal('hide');
        });
    }
    
    // DatePicker methods
    //$scope.birthday = new Date(1965,2,13);
    $scope.formats = ['dd-MMMM-yyyy', "dd/MM/yyyy", 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[1];
    $scope.altInputFormats = ['M!/d!/yyyy'];
    $scope.dpPopup = {
        opened: false
    };
    
    $scope.dateOptions = {
        //dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2050, 5, 22),
        minDate: new Date(1900, 1, 1),
        startingDay: 1
    };
    
    $scope.openDP = function() {
        $scope.dpPopup.opened = true;
    };
    
    $scope.toggleMin = function() {
        //$scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        //$scope.dateOptions.minDate = $scope.inlineOptions.minDate;
    };

    $scope.phone_country = "972";
    $scope.phoneAreaCodes = appUser.lists[1];
    $scope.phoneTypes = appUser.lists[2];
    $scope.addressType = appUser.lists[0];

    $scope.isEmptyLegalGardian = appUser.emptySection.legalGardian;
    $scope.isEmptySpause = appUser.emptySection.spause;
    
    $scope.isNotEmptyLegalGardianPhones = false;
    $scope.hideLegalGardianPhones = function() {
        return $scope.isNotEmptyLegalGardianPhones;
    }

    $scope.isNotEmptyLegalGardianAddress = false;
    $scope.hideLegalGardianAddress = function() {
        return $scope.isNotEmptyLegalGardianAddress;
    }

    $scope.currFamily.family = appUser.activeUser.family_Obj;
    if (!$scope.currFamily.family) {
        return;
    }

    $scope.isValidGuardianIdentityId = function() {
        return $scope.invalid_gurdian_identity_id;
    }
    

    // get Legal Guardian details
    let personType = {
        family_Obj : $scope.currFamily.family.id,
        family_rel_type : undefined // Fetch all person's family  // appUser.lists[3].familyHead // familyRelation
    }        

    personSrv.getPerson(personType).then(function(results) {
        //debugger;
        if (!results || results.length <= 0) {
            return;
        }
        //$scope.currFamily.gurdian.objectId
        // $scope.currFamily.familyNum = results.familyNum;
        // $scope.currFamily.gurdian = results;
        // appUser.activeUser.gurdian = results.objectId;

        $scope.personsArr = results;
        $scope.personsArr.forEach(function(element) {
            if (element.family_rel_type == $scope.familyRelation.familyHead) {
                $scope.isEmptyLegalGardian = false;
                $scope.currFamily.gurdian = element;
                $scope.currFamily.guardianName = element.first_name + " " + element.last_name;
                appUser.activeUser.gurdian = results.objectId;
            }
            if (element.family_rel_type == $scope.familyRelation.spause) {
                $scope.currFamily.spause = element;
                $scope.isEmptySpause = false;
            }
        });

        // var multiplePersons = [];
        // const gPersonPtr = new Parse.Object("Person");
        // gPersonPtr.id = $scope.currFamily.gurdian.objectId;
        // multiplePersons.push(gPersonPtr);
        // const gSersonPtr = new Parse.Object("Person");
        // gSersonPtr.id = $scope.currFamily.spause.objectId;
        // multiplePersons.push(gSersonPtr);

        phoneSrv.getPhones(undefined, appUser.codes.guardian_object_type, undefined).then(function(phoneResults) {
            if (!phoneResults) {
                //return;
            }
            else {
                if (phoneResults.length > 0) {
                    $scope.isNotEmptyLegalGardianPhones = true;
                }
                $scope.phonesArr = phoneResults;
            }
        });

        addressSrv.getAddress($scope.currFamily.gurdian.objectId, $scope.currFamily.gurdian.object_type, 0).then(function(addressResults) {
            if (!addressResults) {
                //return;
            }
            else {
                if (addressResults.length > 0) {
                    $scope.isNotEmptyLegalGardianAddress = true;
                }
                $scope.guardian_addresses = addressResults
            }
        });

    });

    // // get Spause details
    // personType = {
    //     family_Obj : $scope.currFamily.family.id,
    //     family_rel_type : appUser.lists[3].spause // familyRelation
    // }        

    // personSrv.getPerson(personType).then(function(results) {
    //     //debugger;
    //     if (!results) {
    //         return;
    //     }
    //     //$scope.currFamily.gurdian.objectId
    //     $scope.currFamily.familyNum = results.familyNum;
    //     $scope.currFamily.gurdian = results;
    //     appUser.activeUser.gurdian = results.objectId;

    //     $scope.isEmptySpause = false;

    //     phoneSrv.getPhones($scope.currFamily.gurdian.objectId, $scope.currFamily.gurdian.object_type, 0).then(function(phoneResults) {
    //         if (!phoneResults) {
    //             //return;
    //         }
    //         else {
    //             if (phoneResults.length > 0) {
    //                 $scope.isNotEmptyLegalGardianPhones = true;
    //             }
    //             $scope.guardian_phones = phoneResults;
    //         }
    //     });

    //     addressSrv.getAddress($scope.currFamily.gurdian.objectId, $scope.currFamily.gurdian.object_type, 0).then(function(addressResults) {
    //         if (!addressResults) {
    //             //return;
    //         }
    //         else {
    //             if (addressResults.length > 0) {
    //                 $scope.isNotEmptyLegalGardianAddress = true;
    //             }
    //             $scope.guardian_addresses = addressResults
    //         }
    //     });

    // });
    $scope.toggleMin();

    function fillPersonPointer() {
        let personPtr = new Parse.Object("Person");
        if ($scope.newPersonObj.identity_id) {
            personPtr.set('type', '');
            personPtr.set('identity_id', $scope.newPersonObj.identity_id);
            personPtr.set('birthday', $scope.newPersonObj.birthday);
            personPtr.set('gender', '');
            personPtr.set('family_rel_type', $scope.newPersonObj.family_rel_type);
            personPtr.set('first_name', $scope.newPersonObj.first_name);
            personPtr.set('last_name', $scope.newPersonObj.last_name);
            personPtr.set('email', '');
            let userPtr = Parse.User.current();
            if ($scope.newPersonObj.family_rel_type != $scope.familyRelation.familyHead) {
                userPtr.id = "xG9NXxG9Fh"; // dummy user
            }
            personPtr.set('userId', userPtr);

        }
        else {
            personPtr.set('type', '');
            personPtr.set('identity_id', $scope.currFamily.gurdian.identity_id);
            personPtr.set('birthday', $scope.currFamily.gurdian.birthday);
            personPtr.set('gender', '');
            personPtr.set('family_rel_type', appUser.lists[3].familyHead); // familyRelation
            personPtr.set('first_name', $scope.currFamily.gurdian.first_name);
            personPtr.set('last_name', $scope.currFamily.gurdian.last_name);
            personPtr.set('email', '');
            personPtr.set('userId', Parse.User.current());
        }
        personPtr.set('family_id', $scope.currFamily.family);
        return personPtr;
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

    function fillPhonePointer() {
        let personPtr = new Parse.Object("Person");
        personPtr.id = $scope.currFamily.gurdian.objectId;

        let phonePtr = new Parse.Object("Phones");
        phonePtr.set('ext', undefined);
        phonePtr.set('object_rel_type', $scope.currFamily.gurdian.object_type);
        phonePtr.set('object_rel_id', personPtr);  
        phonePtr.set('type', $scope.phone_type);
        phonePtr.set('area_code', $scope.phone_areaCode);
        phonePtr.set('phone_number', $scope.phone_number);
        phonePtr.set('country_code', $scope.phone_country);

        return phonePtr;
    }

    function validateId(num) {
        if (num == undefined) {
            return false;
        }
        $scope.invalid_gurdian_identity_id = true;
        if (isNaN(num)) {
            return false;
        }
        if (!LegalTz(num.toString())) {
            return false;
        }
        $scope.invalid_gurdian_identity_id = false;
        return true;
    }

    function disabled(data) {
        var date = data.date,
        mode = data.mode;
        //return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        return false;
    }

    function getDayClass(data) {
        var date = data.date,
          mode = data.mode;
        if (mode === 'day') {
          var dayToCheck = new Date(date).setHours(0,0,0,0);
    
          for (var i = 0; i < $scope.events.length; i++) {
            var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);
    
            if (dayToCheck === currentDay) {
              return $scope.events[i].status;
            }
          }
        }
    
        return '';
    }
    //   $scope.setDate = function(year, month, day) {
    //     $scope.dt = new Date(year, month, day);
    //   };
      
    
});