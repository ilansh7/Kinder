

app.directive("addressDetails", function() {
    return {
        templateUrl: "app/assets/address/addressDetails.html",
        restrcit: "E",
        controller: "familyCtrl",
        scope: {
            personId: "=",
            personType: "="
        }
    }
})