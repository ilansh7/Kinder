

app.factory("addressSrv", function ($q, $log) {

    const appFamily = null;
    let addressObj = null;

    function Address(addressObj) {
        this.type = addressObj.get("type");
        this.object_rel_id = addressObj.get("object_rel_id");
        this.object_rel_type = addressObj.get("object_rel_type");
        this.address1 = addressObj.get("address1");
        this.address2 = addressObj.get("address2");
        this.city = addressObj.get("city");
        this.house = addressObj.get("house");
        this.misc = addressObj.get("misc");
        this.state = addressObj.get("state");
        this.country = addressObj.get("country");
        this.zipcode = addressObj.get("zipcode");
        this.location = addressObj.get("location");
        this.address = this.address1 + 
            (this.house !== undefined ? " " + this.house : "") +
            (this.address2 !== undefined ? ", " + this.address2 : "") +
            (this.city !== undefined ? ", " + this.city : "") +
            (this.zipcode !== undefined ? ", " + this.zipcode : "");
        this.person_id = "";
    }

    function addAddress(addressObj) {
        let async = $q.defer();
        //const tmpAddress = Parse.Object.extend('Address');
        //const address = new tmpAddress();
        
        addressObj.save().then(function(result) {
                //if (typeof document !== 'undefined') document.write(`Family created: ${JSON.stringify(result)}`);
                //address.set('family_id', calcFamilyNum(address.id));
                async.resolve(new Address(result));
                $log.info('Address created', result);
            }, function(error) {
                //if (typeof document !== 'undefined') document.write(`Error while creating Address: ${JSON.stringify(error)}`);
                async.reject(error);
                $log.error('Error while creating Address: ', error);
            }
        );
        return async.promise;
    }

    function getAddress(objId, objType, type) {
        let async = $q.defer();
        const tmpAddress = Parse.Object.extend('Address');
        const query = new Parse.Query(tmpAddress);
        
        let addresses = [];
        if (type != "0") {
            query.equalTo("type", type);
        }
        var personPtr = new Parse.Object("Person");
        personPtr.id = objId
        query.equalTo("object_rel_id", personPtr);
        query.equalTo("object_rel_type", objType);

        query.find().then(function(results) {
            if (results.length > 0) {
                $log.info('Address found', results);
                //addressObj = new Address(results);
                for (let i = 0; i < results.length; i++) {
                    addressObj = new Address(results[i]);
                    addressObj.person_id = addressObj.object_rel_id.id;
                    addresses.push(addressObj);
                    addressObj = null;                    
                }
            }
            else {
                $log.info('Address : No data found');
            }
            async.resolve(addresses);
        }, function(error) {
            $log.error('Error while fetching Address', error);
            async.reject(error);
        });
        return async.promise;
    }

    return {
        addAddress: addAddress,
        getAddress: getAddress
    }
})
