

app.factory("personSrv", function($q, $log, appUser, addressSrv/*, loginSrv, familySrv*/) {

    let personObj = null;

    function Person(parsePerson) {
        if (parsePerson) {
            //this.objectId = parsePerson[0].get("objectId");
            this.object_type = "";
            this.identity_id = parsePerson.get("identity_id");
            this.birthday = parsePerson.get("birthday");
            this.family_id = parsePerson.get("family_id");
            this.gender = parsePerson.get("gender");
            this.first_name = parsePerson.get("first_name");
            this.last_name = parsePerson.get("last_name");
            this.email = parsePerson.get("email");
            this.user_id = parsePerson.get("user_id");
            this.type = parsePerson.get("type");
        }
        this.homeAddress = {
            address1 : "",
            address2 : ""
        };
    }

    function newPerson(id) {
        const person = new Person(personObj);
        person.objectId = id;
        return person;
    }

    //function addPerson(family_rel_type, identity_id, first_name, last_name, gender, birthday, userId, family_id, email, type) {
    function addPerson(personObj) {
        let async = $q.defer();

        // const tmpPerson = Parse.Object.extend('Person');
        // const person = new tmpPerson();

        // //if (typeof(obj) !== 'object') {

        // person.set('type', type);
        // person.set('identity_id', identity_id);
        // person.set('birthday', birthday);
        // person.set('gender', gender);
        // person.set('family_id', family_id);
        // person.set('family_rel_type', family_rel_type);
        // person.set('first_name', first_name);
        // person.set('last_name', last_name);
        // person.set('email', email);
        // person.set('userId', userId);
        // //}
        // //else {
        // //    person = obj;
        // //}

        personObj.save().then(function(result) {
            //if (typeof document !== 'undefined') document.write(`Person created: ${JSON.stringify(result)}`);
            $log.info('Person created', result);
            async.resolve(null);
        },
        function(error) {
            //if (typeof document !== 'undefined') document.write(`Error while creating Person: ${JSON.stringify(error)}`);
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
                personObj = new Person(results[0]);
                personObj.objectId = results[0].id;
                personObj.object_type = results[0].className;
            }
            else {
                $log.info('Person : No data found');
            }
            async.resolve(personObj);
        }, function(error) {
            async.reject(error);async.reject(error);
            $log.error('Error while fetching Person', error);
        });
        return async.promise;
    }

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
