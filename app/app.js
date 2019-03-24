
var app = angular.module("kinderOnLine", ["ngRoute", "ngImageInputWithPreview", "ngAnimate", "ngTouch", "ngSanitize", "ui.bootstrap"]);
//var app = angular.module("kinderOnLine", ["ngRoute", "ngImageInputWithPreview"]);

app.config(function($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "app/home/home.html",
        controller: "homeCtrl"
    // }).when("/login", {
    //     templateUrl: "app/login/login.html",
    //     controller: "loginCtrl"
    }).when("/signup", {

    }).when("/family/", {
        templateUrl: "app/family/family.html",
        controller: "familyCtrl"
    // }).when("/recipes", {
    //     templateUrl: "app/recipes/recipes.html",
    //     controller: "recipesCtrl"
    // }).when("/recipe/:recipeId", {

    // }).when("/new" , {
    //     templateUrl: "app/recipes/newRecipe.html",
    //     controller: "newRecipeCtrl"
    }).otherwise({
        redirectTo: "/"
    })
})

//app.service('hexafy', function() {
app.service('appUser', function($q, $log) {
    //this.ilan = "Shchori";
    this.activeUser = {};
    this.activeFamily = {
        activeUser : null,
        //userId : "",
        family : null,
        familyId : "",
        familyNum : "",
        guardianName : "",
        gurdian : {},
        spause : {}
    };
    this.codes = {
        // Address Type
        Home            : "H",
        Work            : "W",
        Mail            : "M",
        eMail           : "E",
        KinderGarden    : "K",
        // Family Relation
        account         : "ACT",
        // Object Types
        guardian_object_type    : "Person",
        spause_object_type      : "Person"
    };

    this.lists = [
        addressType = {
            "H"  : "Home",
            "W"  : "Work",
            "M"  : "Mail",
            "K"  : "Kinder Garden",
        },
        phoneAreaCodes = {
            "02"  :  "02",  // Bezeq landline Jerusalem
            "03"  :  "03",  // Bezeq landline Central
            "04"  :  "04",  // Bezeq landline North
            "08"  :  "08",  // Bezeq landline South
            "09"  :  "09",  // Bezeq landline East
            "050" : "050",  // Pelephone
            "052" : "052",  // Cellcom
            "053" : "053",  // Hot Mobile
            "054" : "054",  // Orange
            "055" : "055",  // 22x xxxx - Home Cellular, 66x xxxx - Rami Levy, 88x xxxx - YouPhone
            "056" : "056",  // Wataniya - Palestinian territories
            "057" : "057",  // Hot Mobile
            "058" : "058",  // Golan Telecom
            "059" : "059",  // Jawal - Palestinian territories
            "072" : "072",  // VoB 012 Smile
            "073" : "073",  // 2xx xxxx - Cellcom local calls, 3xx xxxx - Cellcom local business telephone lines, 7xx xxxx - VoB 013 Netvision
            "074" : "074",  // 7xx xxxx - Orange local calls
            "076" : "076",  // 5xx xxxx - VoB Bezeq International, 88x xxxx - Bezeq local
            "077" : "077"   // Hot Cable Phone Service
        },
        phoneTypes = {
            home    : "Home",
            work    : "Work",
            fax     : "Fax",
            mobile  : "Mobile"
        },
        familyRelation = {
            familyHead      : "H",
            spause          : "S",
            sisterBrother   : "B"
        }
    ];

    this.emptySection = {
        legalGardian: true,
        spause: true
    };
    this.getActiveUser = function (x) {
       return activeUser;
    }
    this.getObject = function (id, object) {
        let async = $q.defer();
        var obj = Parse.Object.extend(object);
        var query = new Parse.Query(obj);
        
        query.get(id).then(function(results) {
            $log.info('==> ' + object + ' found', JSON.stringify(results));
            async.resolve(results);
        }, function(error) {
            $log.error('== : " Error while fetching ' + object, error);
            async.reject(error);
        });
        return async.promise;
    }
  });
