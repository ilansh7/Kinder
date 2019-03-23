// $(document).ready(function() {
//     $('#frmLegalGardian').bootstrapValidator();
// });

function LegalTz(num) {
    return true;
    let tot = 0;
    let tz = new String(num);
    for (i=0; i<8; i++) {
        x = (((i%2)+1)*tz.charAt(i));
        if (x > 9) {
            x = x.toString();
            x = parseInt(x.charAt(0)) + parseInt(x.charAt(1));
        }
        tot += x;
    }
        
    if ((tot + parseInt(tz.charAt(8))) % 10 == 0) {
        //alert("תקין");
        return true;
    } else {
        alert("לא תקין")
        return false;
    }
}

function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if ( (charCode > 31 && charCode < 48) || charCode > 57) {
        return false;
    }
    return true;
}

function externalValidate() {
    alert ("yo");
    return false;
}

// (function() {
//     'use strict';
//     window.addEventListener('load', function() {
//       // Fetch all the forms we want to apply custom Bootstrap validation styles to
//       var forms = document.getElementsByClassName('needs-validation');
//       // Loop over them and prevent submission
//       var validation = Array.prototype.filter.call(forms, function(form) {
//         form.addEventListener('submit', function(event) {
//           if (form.checkValidity() === false) {
//             event.preventDefault();
//             event.stopPropagation();
//           }
//           form.classList.add('was-validated');
//         }, false);
//       });
//     }, false);
//   })();