

app.factory("phoneSrv", function ($q, $log) {

    const appFamily = null;

    function Phone(phoneObj) {
        this.type = phoneObj.get("type");
        this.person_id = phoneObj.get("person_id");
        this.object_rel_id = phoneObj.get("object_rel_id");
        this.object_rel_type = phoneObj.get("object_rel_type");
        this.country_code = phoneObj.get("country_code");
        this.area_code = phoneObj.get("area_code");
        this.phone_number = phoneObj.get("phone_number");
        this.ext = phoneObj.get("ext");
        this.phone = "";
    }

    function addPhone() {
        let async = $q.defer();
        const tmpPhone = Parse.Object.extend('Phones');
        const phone = new tmpPhone();
        
        phone.set('family_id', 1);
        
        phone.save().then(
            (result) => {
                //if (typeof document !== 'undefined') document.write(`Family created: ${JSON.stringify(result)}`);
                //phone.set('family_id', calcFamilyNum(phone.id));
                updateFamily(phone.id);
                async.resolve(phone);
                $log.info('Phone created', result);
            },
            (error) => {
                //if (typeof document !== 'undefined') document.write(`Error while creating Phone: ${JSON.stringify(error)}`);
                async.reject(error);
                $log.error('Error while creating Phone: ', error);
            }
        );
        return async.promise;
    }

    function getPhones(objId, objType, type) {
        let async = $q.defer();
        const tmpPhone = Parse.Object.extend('Phones');
        const query = new Parse.Query(tmpPhone);
        
        //const phoneObj = new Phone();
        let phones = [];
        let pp = [];

        var personPtr = new Parse.Object("Person");
        personPtr.id = objId;
        query.equalTo("object_rel_id", personPtr);
        query.equalTo("object_rel_type", objType);

        query.find().then(function(results) {
            if (results.length > 0) {
                $log.info('Phone found', results);
                for (let i = 0; i < results.length; i++) {
                    phones.push(new Phone(results[i]));                    
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

    return {
        addPhone: addPhone,
        getPhones: getPhones
    }
})
