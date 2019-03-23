

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

app.filter('phoneByPerson', function() {
  return function(input, id) {
      let out = [];
      if (input === undefined) {
        return out;
      }
      for (let i = 0; i < input.length; i++) {
          if(input[i].person_id == id){
              out.push(input[i]);
          }
      }
      return out;
  }
});

app.filter('addressByPerson', function() {
  return function(input, id) {
      let out = [];
      if (input === undefined) {
        return out;
      }
      for (let i = 0; i < input.length; i++) {
          if(input[i].fpersonId == id){
              out.push(input[i]);
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


