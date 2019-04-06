app.controller("familyCtrl", function($scope, $rootScope, $location, $log, appUser, loginSrv, personSrv, familySrv, addressSrv, phoneSrv) {

    $scope.newPersonObj = {
        family_rel_type : "",
        identity_id: "",
        last_name : "",
        first_name : "",
        birthday : ""
    };
    $scope.familyRelation = appUser.lists[3];
    $scope.invalid_gurdian_identity_id = false;
    $scope.phonesArr = [];

    if (!loginSrv.isLoggedIn()) {
        $location.path("/");
        return;
    };

    if (!appUser.activeFamily.activeUser) {
        appUser.activeFamily.activeUser = loginSrv.getActiveUser();
    };
    $scope.currFamily = appUser.activeFamily;

    $scope.noLegalGardian = false;
    const default_country_code = "972";
    $scope.phone = {};
    $scope.phone.country_code = default_country_code;
    $scope.phone.AreaCodes = appUser.lists[1];
    $scope.phone.Types = appUser.lists[2];
    $scope.phone.CurrentPersonType = "";

    //$scope.personId = $scope.currFamily.spause.id;
    //$scope.personType = $scope.familyRelation.spause;

    $scope.init = function() {
        $scope.currFamily = appUser.activeFamily;
        // get persons
        let personType = {
            family_Obj : $scope.currFamily.family.id,
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
                    $scope.currFamily.gurdian = element;
                    $scope.currFamily.guardianName = element.first_name + " " + element.last_name;
                    appUser.activeUser.gurdian = results.id;
                }
                if (element.family_rel_type == $scope.familyRelation.spause) {
                    $scope.currFamily.spause = element;
                    $scope.isEmptySpause = false;
                }
            });

            phoneSrv.getPhones(undefined, appUser.codes.guardian_object_type, undefined).then(function(phoneResults) {
                $scope.currFamily.gurdian.isNotEmptyLegalGardianPhones = false;
                $scope.currFamily.spause.isNotEmptySpausePhones = false;
                $scope.gPhonesArr = [];
                $scope.sPhonesArr = [];
                    if (!phoneResults) {
                    //return;
                }
                else {
                    // if (phoneResults.length > 0) {
                    //     $scope.isNotEmptyLegalGardianPhones = true;
                    // }
                    $scope.phonesArr = phoneResults;
                    $scope.phonesArr.forEach(function(element) {
                        if (element.person_id == $scope.currFamily.gurdian.id) {
                            $scope.currFamily.gurdian.isNotEmptyLegalGardianPhones = true;
                            $scope.gPhonesArr.push(element);
                        }
                        if (element.person_id == $scope.currFamily.spause.id) {
                            $scope.currFamily.spause.isNotEmptySpausePhones = true;
                            $scope.sPhonesArr.push(element);
                        }
                    });
                    $log.info("phonesArr length = " + $scope.phonesArr.length);
                    //let ff = 0;
                }
            });            

            addressSrv.getAddress($scope.currFamily.gurdian.id, $scope.currFamily.gurdian.object_type, undefined).then(function(addressResults) {
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

    $scope.currFamilyMemberId = "";
    $scope.setFamilyMember = function(type) {
        if (type === "G") { // Guardian
            $scope.currFamilyMemberId = $scope.currFamily.gurdian.identity_id;
        }
        if (type === "S") { // Spause
            $scope.currFamilyMemberId = $scope.currFamily.spause.identity_id;
        }
        //$scope.currFamily.gurdian.id
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
                $scope.currFamily.familyId = family.id;
                
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
                            $scope.currFamily.familyNum = person.familyNum;
                            $scope.currFamily.gurdian = person;
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
            $scope.AddressArr.push(address);

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
            $scope.phonesArr.push(phone);
            if (phone.object_rel_id.id == $scope.currFamily.spause.id) {
                $scope.sPhonesArr.push(phone);
            }
            if (phone.object_rel_id.id == $scope.currFamily.gurdian.id) {
                $scope.gPhonesArr.push(phone);
            }
            //$scope.phonesArr = phoneResults;

            $scope.phone.phone_type = "";
            $scope.phone.country_code = "972";
            $scope.phone.area_code = "";
            $scope.phone.number = "";
            $scope.phone.ext = "";

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

    $scope.addressType = appUser.lists[0];

    $scope.isEmptyLegalGardian = appUser.emptySection.legalGardian;
    $scope.isEmptySpause = appUser.emptySection.spause;
    
    $scope.isNotEmptyLegalGardianPhones = false;
    $scope.hideLegalGardianPhones = function() {
        if ($scope.currFamily.gurdian.isNotEmptyLegalGardianPhones) {
            //$log.info("Legal Gardian (" + $scope.currFamily.gurdian.id + ") Phones Found.");
        }
        else {
            //$log.info("evaluate hideLegalGardianPhones()");
        }
        return $scope.currFamily.gurdian.isNotEmptyLegalGardianPhones;
    }

    $scope.setPhoneParams = function(type) {
        $log.info("setPhoneParams(), type=" + type);
        $scope.phone.CurrentPersonType = type;
    }
    //$scope.setPhoneParams = setPhoneParams();
    

    $scope.isNotEmptyLegalGardianAddress = false;
    $scope.hideLegalGardianAddress = function() {
        return $scope.currFamily.gurdian.isNotEmptyLegalGardianPhones;
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

    $scope.addddPhone = function() {
        $rootScope.adddPhone();
    }

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
        personPtr.id = $scope.currFamily.gurdian.id;

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
        //personPtr.id = $scope.currFamily.gurdian.id;
        if ($scope.phone.CurrentPersonType == $scope.familyRelation.familyHead) {
            personPtr.id = $scope.currFamily.gurdian.id;
        }
        if ($scope.phone.CurrentPersonType == $scope.familyRelation.spause) {
            personPtr.id = $scope.currFamily.spause.id;
        }
                       
        let phonePtr = new Parse.Object("Phones");
        phonePtr.set('object_rel_type', $scope.currFamily.gurdian.object_type);
        phonePtr.set('object_rel_id', personPtr);  
        phonePtr.set('type', $scope.phone.phone_type);
        phonePtr.set('country_code', $scope.phone.country_code);
        phonePtr.set('area_code', $scope.phone.area_code);
        phonePtr.set('phone_number', $scope.phone.number);
        phonePtr.set('ext', $scope.phone.ext);

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
    
});