

app.factory("personSrv", function($q, $log/*, appUser, addressSrv, loginSrv, familySrv*/) {

    let personObj = null;
    let personArr = [];

    function Person(personObj) {
        if (personObj) {
            //this.objectId = personObj[0].get("objectId");
            this.object_type = "";
            this.family_rel_type = personObj.get("family_rel_type");
            this.identity_id = personObj.get("identity_id");
            this.birthday = personObj.get("birthday");
            this.family_id = personObj.get("family_id");
            this.gender = personObj.get("gender");
            this.first_name = personObj.get("first_name");
            this.last_name = personObj.get("last_name");
            this.email = personObj.get("email");
            this.user_id = personObj.get("user_id");
            this.type = personObj.get("type");
        }
        // this.homeAddress = {
        //     address1 : "",
        //     address2 : ""
        // };
    }

    function newPerson(id) {
        const person = new Person(personObj);
        person.objectId = id;
        return person;
    }

    function addPerson(personObj) {
        let async = $q.defer();

        personObj.save().then(function(result) {
            $log.info('Person created', result);

            personObj = new Person(result);
            personObj.objectId = result.id;
            personObj.object_type = result.className;
            personArr.push(personObj);

            async.resolve(personObj);
            personObj = null;
        },
        function(error) {
            $log.error('Error while creating Person: ', error);
            async.reject(error);
        });
    }

    function getPerson(account) {
        var async = $q.defer();

        const tmpPerson = Parse.Object.extend('Person');
        const query = new Parse.Query(tmpPerson);

        // if (!activeUser) {
        //     activeUser = loginSrv.getActiveUser();
        // }
        if (account.family_Obj) {
            var familyPtr = new Parse.Object("Family");
            familyPtr.id = account.family_Obj;
            query.equalTo("family_id", familyPtr);
        }
        if (account.family_rel_type) {
            query.equalTo("family_rel_type", account.family_rel_type);
        }

        query.find().then(function(results) {
            if (results.length > 0) {
                $log.info('getPerson : Person found', results);
                personArr = [];
                for (let i = 0; i < results.length; i++) {
                    personObj = new Person(results[i]);
                    personObj.objectId = results[i].id;
                    personObj.object_type = results[i].className;
                    personArr.push(personObj);
                    personObj = null;
                }
            }
            else {
                personArr = [];
                $log.info('Person : No data found');
            }
            // const uniques = Array.from(new Set(personArr.map(s => s.objectId)))
            // .map(objectId => {
            //     return {
            //         objectId: objectId,
            //         object_type: personArr.find(s => s.objectId === objectId).object_type,
            //         identity_id: personArr.find(s => s.objectId === objectId).identity_id,
            //         family_id: personArr.find(s => s.objectId === objectId).family_id,
            //         family_rel_type: personArr.find(s => s.objectId === objectId).family_rel_type,
            //         first_name: personArr.find(s => s.objectId === objectId).first_name,
            //         last_name: personArr.find(s => s.objectId === objectId).last_name,
            //         birthday: personArr.find(s => s.objectId === objectId).birthday,
            //         email: personArr.find(s => s.objectId === objectId).email,
            //         gender: personArr.find(s => s.objectId === objectId).gender,
            //         type: personArr.find(s => s.objectId === objectId).type,
            //         user_id: personArr.find(s => s.objectId === objectId).user_id
            //     };
            // });
            async.resolve(personArr);
        }, function(error) {
            async.reject(error);
            $log.error('Error while fetching Person', error);
        });
        return async.promise;
    }

    // Array.prototype.unique = function() {
    //     var arr = [];
    //     for(var i = 0; i < this.length; i++) {
    //         if(!arr.includes(this[i])) {
    //             arr.push(this[i]);
    //         }
    //     }
    //     return arr; 
    // }

    function getUserData(user) {
        let async = $q.defer();
        const tmpPerson = Parse.Object.extend("Person");
        const query = new Parse.Query(tmpPerson);
        if (!user) {user = Parse.User.current()};

        // if (user.family_Obj) {
        //     query.equalTo("family_id", user.family_Obj);
        // }
        // if (user.family_rel_type) {
        //     query.equalTo("family_rel_type", user.family_rel_type);
        // }
        query.equalTo("userId", user);
        query.find().then(function(results) {
            if (results.length > 0) {
                $log.info('getUserData: Person found', results);
                personObj.first_name = results[0].get("first_name");
                //personObj = results[0];
            }
            else {
                $log.info('No data found');
            }
            async.resolve(personObj);
        }, function(error) {
            $log.error('Error while fetching Person', error);
            async.reject(error);
        });
        return async.promise;
    }
    

    return {
        newPerson: newPerson,
        addPerson: addPerson,
        getPerson: getPerson,
        getUserData: getUserData
    }
})
