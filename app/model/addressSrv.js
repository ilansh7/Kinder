

app.factory("addressSrv", function ($q, $log) {

    const appFamily = null;

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
        this.address = "";
    }

    function addAddress() {
        let async = $q.defer();
        const tmpAddress = Parse.Object.extend('Address');
        const address = new tmpAddress();
        
        //address.set('family_id', 1);
        
        address.save().then(
            (result) => {
                //if (typeof document !== 'undefined') document.write(`Family created: ${JSON.stringify(result)}`);
                //address.set('family_id', calcFamilyNum(address.id));
                updateFamily(address.id);
                async.resolve(address);
                $log.info('Address created', result);
            },
            (error) => {
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
                    addresses.push(new Address(results[i]));                    
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
