//Wait for the DOM to load before attaching event listeners
document.addEventListener('DOMContentLoaded', () => {
    //Get the form element
    const form = document.getElementById('userForm');
    //Attach submit event listener to the form
    form.addEventListener('submit', (event) => {
        if (!validateForm(event)) {
        event.preventDefault();
        }
    });
});

//Get URL parameters to check for error or success messages
const urlParams = new URLSearchParams(window.location.search);

//Extract 'error' and 'success' parameters
const error = urlParams.get('error');
const success = urlParams.get('success');

//Get the message span element to display menssage
const messageSpan = document.getElementById('message');

//Check for error or success and display the right message
if (error === 'true') {
    messageSpan.innerText = 'Submission failed. Please try again.';
    messageSpan.style.color = 'red';
    messageSpan.style.display = 'block';
    
} else if (success === 'true') {
    messageSpan.innerText = 'Form submitted successfully!!!';
    messageSpan.style.color = 'green';
    messageSpan.style.display = 'block';

}

//Function to validate the form inputs on the client-side
function validateForm(event) {

    //var to check if the form is valid
    let validateFormCompleted = true;

    const firstName = document.getElementById('first_name');
    const spanFirstName = document.getElementById('firstNameError')

    //Regex to validate first name and last name, letter, number and spaces only and max 20 characters
    const nameRegex = /^[a-zA-Z0-9]{1,20}$/;

    //Validate first name
    if (!nameRegex.test(firstName.value)) {
        //If invalid, set border to red and show error message in span
        firstName.style.border = '1px solid red'; 
        spanFirstName.innerText = 'First Name must be alphabetic and max 20 characters long.';
        validateFormCompleted = false;

    } else {
        //If valid, reset styles and error message
        firstName.style.border = '';
        spanFirstName.innerText = '';

    }

    const lastName = document.getElementById('second_name');
    const spanLastName = document.getElementById('lastNameError');

    //Validate last name
    if (!nameRegex.test(lastName.value)) {
        //If invalid, set border to red and show error message in span
        lastName.style.border = '1px solid red';
        spanLastName.innerText = 'Last Name must be alphabetic and max 20 characters long.';
        validateFormCompleted = false;

    } else {
        //If valid, reset styles and error message
        lastName.style.border = '';
        spanLastName.innerText = '';

    }

    const email = document.getElementById('email');
    const spanEmail = document.getElementById('emailError');

    //Regex to validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    //Validate email
    if (!emailRegex.test(email.value)) {
        //If invalid, set border to red and show error message in span
        email.style.border = '1px solid red';
        spanEmail.innerText = 'Invalid email format.';
        validateFormCompleted = false;

    } else {
        //If valid, reset styles and error message
        email.style.border = '';
        spanEmail.innerText = '';

    }
    
    const phone = document.getElementById('phone_number');
    const spanPhone = document.getElementById('phoneError');

    //Regex to validate phone number, digits only and exactly 10 digits
    const phoneRegex = /^\d{10}$/;
    
    //Validate phone number
    if (!phoneRegex.test(phone.value)) {
        //If invalid, set border to red and show error message in span
        phone.style.border = '1px solid red';
        spanPhone.innerText = 'Phone Number must be exactly 10 digits.';
        validateFormCompleted = false;

    } else {
        //If valid, reset styles and error message
        phone.style.border = '';
        spanPhone.innerText = '';

    }

    const eircode = document.getElementById('eircode');
    const spanEircode = document.getElementById('eircodeError');

    //Regex to validate Eircode format
    const eircodeRegex = /^[0-9][a-zA-Z0-9]{5}$/;

    //Validate Eircode
    if (!eircodeRegex.test(eircode.value.toUpperCase())) {
        //If invalid, set border to red and show error message in span
        eircode.style.border = '1px solid red';
        spanEircode.innerText = 'Invalid Eircode format.';
        validateFormCompleted = false;

    } else {
        //If valid, reset styles and error message
        eircode.style.border = '';
        spanEircode.innerText = '';

    }

    //If any validation failed, prevent form submission
    if (!validateFormCompleted) {
        event.preventDefault();
        return false;
    }

    //If all validations pass, allow form submission
    return true;
}