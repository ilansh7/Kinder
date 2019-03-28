

app.factory("familySrv", function ($q, $log) {

    const appFamily = null;

    function Family(parsefamily) {
        this.id = parsefamily.get("id");
        if (this.id === undefined) {
            this.id = parsefamily.id;
        }
        this.family_id = parsefamily.get("family_id");
        this.family_num = parsefamily.get("family_id");
    }

    function addFamily() {
        let async = $q.defer();
        const tmpFamily = Parse.Object.extend('Family');
        const family = new tmpFamily();
        
        //family.set('family_id', 1);
        
        family.save().then(function(results) {
                //if (typeof document !== 'undefined') document.write(`Family created: ${JSON.stringify(result)}`);
                //family.set('family_id', calcFamilyNum(family.id));
                var familyObj = new Family(results);
                updateFamily(familyObj.objectId);
                async.resolve(familyObj);
                $log.info('Family created', results);
            }, function(error) {
                //if (typeof document !== 'undefined') document.write(`Error while creating Family: ${JSON.stringify(error)}`);
                async.reject(error);
                $log.error('Error while creating Family: ', error);
            }
        );
        return async.promise;
    }

    function updateFamily(id) {
        const tmpFamily = Parse.Object.extend('Family');
        const query = new Parse.Query(tmpFamily);
        // here you put the objectId that you want to update
        query.get(id).then(function(object) {
            object.set('family_id', calcFamilyNum(id));
            object.save().then((response) => {
                $log.info('Updated Family', response);
            }, function(error) {
                //if (typeof document !== 'undefined') document.write(`Error while updating Family: ${JSON.stringify(error)}`);
                $log.error('Error while updating Family', error);
            });
        });        
    }

    function getFamily(id) {
        let async = $q.defer();
        const tmpFamily = Parse.Object.extend('Family');
        const query = new Parse.Query(tmpFamily);
        
        query.equalTo("family_id", id);
        query.find().then((family) => {
            async.resolve(family);
            $log.info('Family found', family);
        }, (error) => {
            async.reject(error);
            $log.error('Error while fetching Family', error);
        });
        return async.promise;
    }

    function calcFamilyNum(id) {
        let num = 0;
        if (id) {
            for (let i = 0; i < id.length; i++) {
                //$log.info("curr : i=" + i + ", char=" + id[i].charCodeAt(0) + ", pow=" + Math.pow(2, i) + ", result=" + id[i].charCodeAt(0) * Math.pow(2, i));
                num += id[i].charCodeAt(0) * Math.pow(2, i); 
            }
        }
        return num;
    }

    return {
        addFamily: addFamily,
        getFamily: getFamily,
        calcFamilyNum: calcFamilyNum
    }
})
