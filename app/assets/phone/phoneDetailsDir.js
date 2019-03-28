

app.directive("phoneDetails", function() {
    return {
        templateUrl: "app/assets/phone/phoneDetails.html",
        restrcit: "E",
        controller: "phoneCtrl",
        scope: {
            type: "=",
            personId: "=",
            personType: "="
        }
    }
})