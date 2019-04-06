app.factory("loginSrv", function($q, $log, appUser) {

    let activeUser = null;

    function User(parseUser) {
        //this.id = parseUser.get("id");
        this.objectId = parseUser.get("objectId");
        this.email = parseUser.get("email");
        this.family_Obj = parseUser.get("family_id");
        this.guardian = "";
        this.spause = "";
    }

    function login(email, pwd) {
        var async = $q.defer();

        Parse.User.logIn(email, pwd).then(function(user) {
            // Do stuff after successful login
            $log.info('Logged in user', user.get("username"));
            activeUser = new User(user);
            activeUser.objectId = user.id;
            if (activeUser.family_Obj !== undefined) {
                let familyObjectId = activeUser.family_Obj.id;
                activeUser.family = appUser.getObject(familyObjectId, "Family");
            }
            async.resolve(activeUser);
        }, function(error) {
            $log.error('Error while logging in user', error);
            async.reject(error);
        });

        return async.promise;
    }

    function isLoggedIn() {
        return activeUser ? true : false;
    }

    function logout() {
        activeUser = null;
    }

    function getActiveUser() {
        return activeUser;
    }

    function getUserData(user) {
        let async = $q.defer();
        const Person = Parse.Object.extend("Person");
        const query = new Parse.Query(Person);
        if (!user) {user = Parse.User.current()};

        query.equalTo("userId", user);
        query.find().then(function(results) {
            if (results.length > 0) {
                $log.info('Person(user) found', JSON.stringify(results));
                activeUser.first_name = results[0].get("first_name");
                activeUser.identity_id = results[0].get("identity_id");
                //activeUser = results[0];
            }
            else {
                $log.info('No data found');
            }
            async.resolve(activeUser);
        }, function(error) {
            $log.error('Error while fetching Person', error);
            async.reject(error);
        });
        return async.promise;
    }

    function updateUser(paramsArr) {
        // apply Family_id to current user loggedin
        let async = $q.defer();

        const tmpUser = new Parse.User();
        const query = new Parse.Query(tmpUser);

        // Finds the user by its ID
        query.get(appUser.activeUser.objectId).then(function(user) {
            // Updates the data we want
            for (let i = 0; i < paramsArr.length; i++) {
                //const element = paramsArr[i];
                user.set(paramsArr[i].key, paramsArr[i].value)
            }
            
            //user.set('family_id', new Parse.Object("Family"));
            //Saves the user with the updated data
            user.save().then(function(response) {
                $log.info('Updated user', response);
            }).catch(function(error) {
                $log.error('Error while updating user', error);
            });
        });

    }

    return {
        login:          login,
        isLoggedIn:     isLoggedIn,
        logout:         logout,
        getActiveUser:  getActiveUser,
        getUserData:    getUserData,
        updateUser:     updateUser
    }

});