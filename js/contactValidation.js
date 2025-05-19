var contactName = document.getElementById("contactName");
var contactEmail = document.getElementById("contactEmail");
var contactPhone = document.getElementById("contactPhone");
var contactAge = document.getElementById("contactAge");
var contactPassword = document.getElementById("contactPassword");
var contactPassword2 = document.getElementById("contactPassword2");
var contactForm = document.getElementById("contactForm");

var isOk = [false, false, false, false, false, false]; // Flag to check if all inputs are valid

var nameRegex = /^[a-zA-Z ]{2,}$/; // Name: at least 2 letters, spaces allowed
var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; 
var phoneRegex = /^01[0125][0-9]{8}$/; // Egyptian phone
var ageRegex = /^(1[6-9]|[2-9][0-9]|100)$/; // Age: 16-100
var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/; // Password: min 8 chars, 1 uppercase, 1 lowercase, 1 digit

function validation(unitTest, regex){
    if (unitTest.value.match(regex)) {
        return true;
    } else {
        return false;
    }
}

contactName.addEventListener("input", function() {
    if (validation(contactName, nameRegex)) {
        contactName.classList.add("is-valid");
        contactName.classList.remove("is-invalid");
        isOk[0] = true;
    } else {
        contactName.classList.add("is-invalid");
        contactName.classList.remove("is-valid");
        isOk[0] = false;
    }
});
contactEmail.addEventListener("input", function () {
  if (validation(contactEmail, emailRegex)) {
    contactEmail.classList.add("is-valid");
    contactEmail.classList.remove("is-invalid");
    isOk[1] = true;
  } else {
    contactEmail.classList.add("is-invalid");
    contactEmail.classList.remove("is-valid");
    isOk[1] = false;
  }
});
contactPhone.addEventListener("input", function () {
  if (validation(contactPhone, phoneRegex)) {
    contactPhone.classList.add("is-valid");
    contactPhone.classList.remove("is-invalid");
    isOk[2] = true;
  } else {
    contactPhone.classList.add("is-invalid");
    contactPhone.classList.remove("is-valid");
    isOk[2] = false;
  }
});
contactAge.addEventListener("input", function () {
  if (validation(contactAge, ageRegex)) {
    contactAge.classList.add("is-valid");
    contactAge.classList.remove("is-invalid");
    isOk[3] = true;
  } else {
    contactAge.classList.add("is-invalid");
    contactAge.classList.remove("is-valid");
    isOk[3] = false;
  }
});
contactPassword.addEventListener("input", function () {
  if (validation(contactPassword, passwordRegex)) {
    contactPassword.classList.add("is-valid");
    contactPassword.classList.remove("is-invalid");
    isOk[4] = true;
  } else {
    contactPassword.classList.add("is-invalid");
    contactPassword.classList.remove("is-valid");
    isOk[4] = false;
  }
});
contactPassword2.addEventListener("input", function () {
  if (contactPassword2.value == contactPassword.value) {
    contactPassword2.classList.add("is-valid");
    contactPassword2.classList.remove("is-invalid");
    isOk[5] = true;
  } else {
    contactPassword2.classList.add("is-invalid");
    contactPassword2.classList.remove("is-valid");
    isOk[5] = false;
  }
});
contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
  if (isOk[0] && isOk[1] && isOk[2] && isOk[3] && isOk[4] && isOk[5]) {
    Swal.fire({
      title: "Done",
      text: "Form submitted successfully!",
      icon: "success",
    });
  } else {
    Swal.fire({
      title: "Oops...",
      text: "Please fill out the form correctly.",
      icon: "error",
    });
  }
});