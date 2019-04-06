app.factory("phoneSrv", function ($q, $log) {

    const appFamily = null;
    let phoneObj = null;

    function Phone(phoneObj) {
        this.id = phoneObj.get("id");
        this.type = phoneObj.get("type");
        this.person_id = phoneObj.get("person_id");
        this.object_rel_id = phoneObj.get("object_rel_id");
        this.object_rel_type = phoneObj.get("object_rel_type");
        this.country_code = phoneObj.get("country_code");
        this.area_code = phoneObj.get("area_code");
        this.phone_number = phoneObj.get("phone_number");
        this.ext = phoneObj.get("ext");
        this.phone = (this.country_code !== "972" ? "+" + this.country_code + "-" : "") + this.area_code + "-" + this.phone_number + (this.ext !== undefined ? " Ext " + this.ext : "");
    }

    function addPhone(phoneObj) {
        let async = $q.defer();
        
        phoneObj.save().then(function(result) {
                async.resolve(new Phone(result));
                $log.info('Phone created', result);
            }, function(error) {
                async.reject(error);
                $log.error('Error while creating Phone: ', error);
            }
        );
        return async.promise;
    }

    function getPhones(objId, objType, type) {
        let async = $q.defer();
        let phones = [];
        const tmpPhone = Parse.Object.extend('Phones');
        const query = new Parse.Query(tmpPhone);
        
        if (objId) {
            var personPtr = new Parse.Object("Person");
            personPtr.id = objId;
            query.equalTo("object_rel_id", personPtr);
        }
        if (objType) {
            query.equalTo("object_rel_type", objType);
        }
        if (type) {
            query.equalTo("type", type);
        }

        query.find().then(function(results) {
            if (results.length > 0) {
                $log.info('Phone found', results);
                for (let i = 0; i < results.length; i++) {
                    phoneObj = new Phone(results[i]);
                    phoneObj.id = results[i].id;
                    phoneObj.person_id = phoneObj.object_rel_id.id;
                    //phones.push(new Phone(results[i]));                    
                    phones.push(phoneObj);                    
                    phoneObj = null;
                }
            }
            else {
                $log.info('Phone : No data found');
            }
            async.resolve(phones);
        }, function(error) {
            $log.error('Error while fetching Phone', error);
            async.reject(error);
        });
        return async.promise;
    }

    function convertToObject(phone) {
        return new Phone(phone);
    }

    return {
        addPhone: addPhone,
        getPhones: getPhones
        //convertToObject: convertToObject
    }
})
