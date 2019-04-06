app.directive("phoneDetails", function() {
    return {
        templateUrl: "app/assets/phone/phoneDetails.html",
        restrcit: "E",
        //controller: "phoneCtrl",
        scope: {
            personId: "=",
            personType: "=",
            phoneAreaCodes: "=",
            phoneTypes: "=",
            phoneParams: "=",
            phoneArray: "=",
            parentType: "=",
            //personType: '@'
        },
        // link: function(scope, element, attributes){

        //     console.log(attributes.phoneDetails);
		// 	console.log("Directive : " + attributes.personId);

		// }
    }
})