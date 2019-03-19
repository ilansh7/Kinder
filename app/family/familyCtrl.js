

app.controller("familyCtrl", function($scope, $location, $log, appUser, loginSrv, personSrv, familySrv, addressSrv, phoneSrv) {

    $scope.currFamily = {
        activeUser : null,
        //userId : "",
        family : null,
        familyId : "",
        familyNum : ""
    }

    if (!loginSrv.isLoggedIn()) {
        $location.path("/");
        return;
    }

    if (!$scope.currFamily.activeUser) {
        $scope.currFamily.activeUser = loginSrv.getActiveUser();
    }

    $scope.createLegalGardian = function() {
        $log.info("Button Create Legal Gardian clicked");
        // add Family object
        if ($scope.currFamily.family) {
            // Family object found
            let personType = {
                family_Obj : $scope.currFamily.family.id,
                family_rel_type : appUser.familyRelation.familyHead
            }        
        
            personSrv.getPerson(personType).then(function(results) {
                let a = 5;
                if (!results) {
                    // Create Person (Guardian) object
                    personSrv.addPerson(fillPersonPointer()).then(function(person) {
                        let hgj = 0;
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
                        sleep(3000);
                        // create head of familt class
                        personSrv.addPerson(fillPersonPointer()).then(function(person) {

                        });
                    });
                });
            });
        }
    }

    $scope.saveAddress = function() {
        $log.info("Button SaveAddress Clicked");
        let closeModal = document.getElementById("btnDismissAddressModal");
        //debugger;
        addressSrv.addAddress(fillAddressPointer()).then(function(person) {
            closeModal.click();
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

    $scope.phoneAreaCodes = appUser.phoneAreaCodes;
    $scope.phoneTypes = appUser.phoneTypes;
    $scope.addressType = appUser.addressType;

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
    //$scope.currFamily.familyNum = familySrv.calcFamilyNum($scope.currFamily.family.id);
    //appUser.activeUser.familyNum = $scope.currFamily.familyNum;
    //$scope.currFamily.familyNum = appUser.activeUser.familyNum;
    //$scope.currFamily.objectId = appUser.activeUser.objectId;

    // get Legal Guardian details
    let personType = {
        family_Obj : $scope.currFamily.family.id,
        family_rel_type : appUser.familyRelation.familyHead
    }        

    personSrv.getPerson(personType).then(function(results) {
        //debugger;
        if (!results) {
            // let personPointer = Parse.Object.extend('Person');
            // //const tmpPerson = 
            // personPointer.set('identity_id', '123456789');
            // personPointer.set('birth_date', new Date('2000-01-01'));
            // personPointer.set('type', '');
            // personPointer.set('gender', '');
            // personPointer.set('family_rel_type', appUser.familyRelation.familyHead);
            // personPointer.set('first_name', 'John');
            // personPointer.set('last_name', 'Dow');
            // personPointer.set('email', '');
            // personPointer.set('userId', Parse.User.current());
            // personPointer.set('family_id', $scope.currFamily.family);
            
            //personSrv.addPerson(appUser.familyRelation.familyHead, '123456789', 'John', 'Dow', '', new Date('2000-01-01'), Parse.User.current(), $scope.currFamily.family, '', '').then(function(person) {

            //});            
            return;
        }
        //$scope.currFamily.gurdian.objectId
        $scope.currFamily.familyNum = results.familyNum;
        $scope.currFamily.gurdian = results;

        $scope.isEmptyLegalGardian = false;

        phoneSrv.getPhones($scope.currFamily.gurdian.objectId, $scope.currFamily.gurdian.object_type, 0).then(function(phoneResults) {
            if (!phoneResults) {
                //return;
            }
            else {
                $scope.isNotEmptyLegalGardianPhones = true;
                $scope.guardian_phones = phoneResults;
                for (let i = 0; i < phoneResults.length; i++) {
                    $scope.guardian_phones[i].phone = (phoneResults[i].country_code !== "972" ? "+" + phoneResults[i].country_code + "-" : "") +
                        phoneResults[i].area_code + "-" + phoneResults[i].phone_number + 
                        (phoneResults[i].ext !== undefined ? " Ext " + phoneResults[i].ext : "");
                }
            }
        });

        addressSrv.getAddress($scope.currFamily.gurdian.objectId, $scope.currFamily.gurdian.object_type, 0).then(function(addressResults) {
            if (!addressResults) {
                //return;
            }
            else {
                $scope.isNotEmptyLegalGardianAddress = true;
                $scope.guardian_addresses = addressResults
                for (let i = 0; i < addressResults.length; i++) {
                    $scope.guardian_addresses[i].address = addressResults[i].address1 + 
                    (addressResults[i].house !== undefined ? " " + addressResults[i].house : "") +
                    (addressResults[i].address2 !== undefined ? ", " + addressResults[i].address2 : "") +
                    (addressResults[i].city !== undefined ? ", " + addressResults[i].city : "") +
                    (addressResults[i].zipcode !== undefined ? ", " + addressResults[i].zipcode : "");
                }
            }
        });

    });

    $scope.toggleMin();

    function fillPersonPointer() {
        let personPtr = new Parse.Object("Person");
        personPtr.set('type', '');
        personPtr.set('identity_id', $scope.currFamily.gurdian.identity_id);
        personPtr.set('birthday', $scope.currFamily.gurdian.birthday);
        personPtr.set('gender', '');
        personPtr.set('family_rel_type', appUser.familyRelation.familyHead);
        personPtr.set('first_name', $scope.currFamily.gurdian.firstName);
        personPtr.set('last_name', $scope.currFamily.gurdian.last_name);
        personPtr.set('email', '');
        personPtr.set('userId', Parse.User.current());
        personPtr.set('family_id', $scope.currFamily.family);

        return personPtr;
    }

    function fillAddressPointer() {
        let personPtr = new Parse.Object("Person");
        personPtr.id = $scope.currFamily.gurdian.objectId;

        let addressPtr = new Parse.Object("Address");
        addressPtr.set('type', $scope.addr_type);
        addressPtr.set('address1', $scope.addr_street);
        addressPtr.set('address2', undefined);
        addressPtr.set('city', $scope.addr_city);
        addressPtr.set('house', $scope.addr_house);
        addressPtr.set('misc', $scope.addr_neighborhood);
        addressPtr.set('state', $scope.addr_state);
        addressPtr.set('country', 'Israel');
        addressPtr.set('zipcode', $scope.addr_zipcode);
        addressPtr.set('location', undefined);
        addressPtr.set('object_rel_type', $scope.currFamily.gurdian.object_type);
        addressPtr.set('object_rel_id', personPtr);        

        return addressPtr;
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