

app.controller("familyCtrl", function($scope, $location, $log, appUser, loginSrv, personSrv, familySrv, addressSrv, phoneSrv) {

    // $scope.currFamily = {
    //     activeUser : null,
    //     //userId : "",
    //     family : null,
    //     familyId : "",
    //     familyNum : "",
    //     guardianName : "",
    //     gurdian : {},
    //     spause : {}
    // };
    $scope.currFamily = appUser.activeFamily;
    $scope.newPersonObj = {
        family_rel_type : "",
        identity_id: "",
        last_name : "",
        first_name : "",
        birthday : ""
    };
    $scope.familyRelation = appUser.lists[3];
    $scope.invalid_gurdian_identity_id = false;

    if (!loginSrv.isLoggedIn()) {
        $location.path("/");
        return;
    };

    if (!appUser.activeFamily.activeUser) {
        appUser.activeFamily.activeUser = loginSrv.getActiveUser();
    };

    $scope.noLegalGardian = false;

    //$scope.personId = $scope.currFamily.spause.id;
    //$scope.personType = $scope.familyRelation.spause;

    $scope.init = function() {
        $scope.currFamily = appUser.activeFamily;
        // get persons
        let personType = {
            family_Obj : appUser.activeFamily.family.id,
            family_rel_type : undefined // Fetch all person's family  // appUser.lists[3].familyHead // familyRelation
        }        

        personSrv.getPerson(personType).then(function(results) {
            //debugger;
            if (!results || results.length <= 0) {
                return;
            }
            $scope.noLegalGardian = true;
            $scope.personsArr = results;
            $scope.personsArr.forEach(function(element) {
                if (element.family_rel_type == $scope.familyRelation.familyHead) {
                    $scope.isEmptyLegalGardian = false;
                    appUser.activeFamily.gurdian = element;
                    appUser.activeFamily.guardianName = element.first_name + " " + element.last_name;
                    appUser.activeUser.gurdian = results.id;
                }
                if (element.family_rel_type == $scope.familyRelation.spause) {
                    appUser.activeFamily.spause = element;
                    $scope.isEmptySpause = false;
                }
            });

            // phoneSrv.getPhones(undefined, appUser.codes.guardian_object_type, undefined).then(function(phoneResults) {
            //     if (!phoneResults) {
            //         //return;
            //     }
            //     else {
            //         if (phoneResults.length > 0) {
            //             $scope.isNotEmptyLegalGardianPhones = true;
            //         }
            //         $scope.phonesArr = phoneResults;
            //     }
            // });

            addressSrv.getAddress(appUser.activeFamily.gurdian.id, appUser.activeFamily.gurdian.object_type, 0).then(function(addressResults) {
                if (!addressResults) {
                    //return;
                }
                else {
                    if (addressResults.length > 0) {
                        $scope.isNotEmptyLegalGardianAddress = true;
                    }
                    $scope.addressesArr = addressResults
                }
            });

        });
    };

    $scope.updateFamilyMember = function(type) {
        const id = $scope.personsArr[0].id;
        $scope.newPersonObj = {
            family_rel_type : type,
            identity_id: $scope.personsArr[0].identity_id,
            last_name : $scope.personsArr[0].last_name,
            first_name : $scope.personsArr[0].first_name,
            birthday : $scope.personsArr[0].birthday//.toUTCString()
        }
        personSrv.updatePerson(id, $scope.newPersonObj);//.then(function(person) {
            // if (personType.family_rel_type == $scope.familyRelation.familyHead) {
            //     $scope.isEmptyLegalGardian = false;
            // }
            // if (personType.family_rel_type == $scope.familyRelation.spause) {
            //     $scope.isEmptySpause = false;
            // }
            //$log.info("Person updated now : " + person);
        //});
    }
    
    $scope.createFamilyMember = function(type) {
        let identityId = undefined;
        let familyRelationType = type;
        $scope.newPersonObj.family_rel_type = type;

        if (type === "G") { // Guardian
            if (appUser.activeFamily.gurdian) {
                identityId = appUser.activeFamily.gurdian.identity_id;
            }
            //familyRelationType = $scope.familyRelation.familyHead; //appUser.lists[3].familyHead;
        }
        if (type === "S") { // Spause
            if (appUser.activeFamily.spause) {
                identityId = appUser.activeFamily.spause.identity_id;
            }
            //familyRelationType = $scope.familyRelation.spause; // appUser.lists[3].spause;
        }

        if (identityId && !validateId(identityId)) {
            return false;
        }
        $log.info("Button Create Legal Gardian clicked");
        // add Family object
        if (appUser.activeFamily.family) {
            // Family object found
            let personType = {
                family_Obj : appUser.activeFamily.family.id,
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
                appUser.activeFamily.familyId = family.id;
                
                appUser.getObject(family.id, "Family").then(function(familyObj) {

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
                            appUser.activeFamily.familyNum = person.familyNum;
                            appUser.activeFamily.gurdian = person;
                            appUser.activeUser.gurdian = person.id;
                            if (type === "G") { // Spause
                                appUser.activeUser.gurdian = person.id;
                                $scope.isEmptyLegalGardian = false;
                            }
                            if (type === "S") { // Spause
                                appUser.activeUser.spause = person.id;
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
            $scope.phonesArr.push(address);

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
    
    // $scope.savePhone = function() {
    //     $log.info("Button SavePhone Clicked");
    //     //let closeModal = document.getElementById("btnDismissPhoneModal");
    //     //debugger;
    //     phoneSrv.addPhone(fillPhonePointer()).then(function(phone) {
    //         $scope.phonesArr.push(phone);

    //         $scope.phone_type = "";
    //         $scope.phone_country = "972";
    //         $scope.phone_areaCode = "";
    //         $scope.phone_number = "";

    //         //closeModal.click();
    //         $('#addPhoneModal').modal('hide');
    //     });
    // }
    
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
        if (appUser.activeFamily.gurdian.isNotEmptyLegalGardianPhones) {
            //$log.info("Legal Gardian (" + appUser.activeFamily.gurdian.id + ") Phones Found.");
        }
        else {
            //$log.info("evaluate hideLegalGardianPhones()");
        }
        return appUser.activeFamily.gurdian.isNotEmptyLegalGardianPhones;
    }

    $scope.isNotEmptyLegalGardianAddress = false;
    $scope.hideLegalGardianAddress = function() {
        return appUser.activeFamily.gurdian.isNotEmptyLegalGardianPhones;
    }

    $scope.currFamily.family = appUser.activeUser.family_Obj;
    if (!$scope.currFamily.family) {
        return;
    }

    $scope.isValidGuardianIdentityId = function() {
        return $scope.invalid_gurdian_identity_id;
    }
    
    $scope.toggleMin();
    $scope.init();

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
            personPtr.set('identity_id', appUser.activeFamily.gurdian.identity_id);
            personPtr.set('birthday', appUser.activeFamily.gurdian.birthday);
            personPtr.set('gender', '');
            personPtr.set('family_rel_type', appUser.lists[3].familyHead); // familyRelation
            personPtr.set('first_name', appUser.activeFamily.gurdian.first_name);
            personPtr.set('last_name', appUser.activeFamily.gurdian.last_name);
            personPtr.set('email', '');
            personPtr.set('userId', Parse.User.current());
        }
        personPtr.set('family_id', appUser.activeFamily.family);
        return personPtr;
    }

    function fillAddressPointer() {
        let personPtr = new Parse.Object("Person");
        personPtr.id = appUser.activeFamily.gurdian.id;

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
        addressPtr.set('object_rel_type', appUser.activeFamily.gurdian.object_type);
        addressPtr.set('object_rel_id', personPtr);        

        return addressPtr;
    }

    function fillPhonePointer() {
        let personPtr = new Parse.Object("Person");
        personPtr.id = appUser.activeFamily.gurdian.id;

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