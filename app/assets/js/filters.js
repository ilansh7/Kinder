

app.filter('personByType', function() {
  return function(input, type) {
      let out = [];
      if (input === undefined) {
        return out;
      }
      for (let i = 0; i < input.length; i++) {
          if(input[i].family_rel_type == type){
              out.push(input[i]);
          }
      }
      return out;
  }
});

app.filter("phoneByPerson", function() {
  return function(arrPhones, id) {
      let out = [];
      if (arrPhones === undefined) {
        return out;
      }
      for (let i = 0; i < arrPhones.length; i++) {
          if(arrPhones[i].person_id == id){
              out.push(arrPhones[i]);
          }
      }
      return out;
  }
});

app.filter("addressByPerson", function() {
  return function(arrAddress, id) {
      let out = [];
      if (arrAddress === undefined) {
        console.log("No array for id : " + id);
        return out;
      }
      //console.log("Array found for id : " + id);
      for (let i = 0; i < arrAddress.length; i++) {
          if(arrAddress[i].person_id == id){
              out.push(arrAddress[i]);
          }
      }
      return out;
  }
});

app.filter('reverse', function() {
  return function(input, uppercase) {
    input = input || '';
    var out = '';
    for (var i = 0; i < input.length; i++) {
      out = input.charAt(i) + out;
    }
    // conditional based on optional argument
    if (uppercase) {
      out = out.toUpperCase();
    }
    return out;
  };
})

//let months = ['','January','Febuary','March','April','May','June','July','August','September','October','November','December'];


