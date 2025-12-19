// Used by: CSV import (index.js) and form submission (server.js)

// Regular expression for alphanumeric names (max 20 characters)
const NAME_REGEX = /^[a-zA-Z0-9]{1,20}$/;

// Regular expression for email validation
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Regular expression for phone number (exactly 10 digits)
const PHONE_REGEX = /^\d{10}$/;

// Regular expression for Eircode validation (starting with digit, 6 alphanumeric characters)
const EIRCODE_REGEX = /^[0-9][a-zA-Z0-9]{5}$/i; // Case insensitive

// Validate first name or last name (alphanumeric, max 20 characters)
function isValidName(name) {
    return NAME_REGEX.test(name.trim());
}

// Validate email address
function isValidEmail(email) {
    return EMAIL_REGEX.test(email.trim());
}

// Validate phone number (exactly 10 digits)
function isValidPhone(phone) {
    return PHONE_REGEX.test(phone.replace(/\s/g, '')); // Remove spaces if any
}

// Validate Eircode (starts with digit, 6 alphanumeric characters)
function isValidEircode(eircode) {
    return EIRCODE_REGEX.test(eircode.trim());
}

// Validate full user data and return clean version and errors
function validateFullUser(data) {
    const cleaned = {
    first_name: data.first_name.trim(),

    // Support both 'second_name' and 'last_name' keys
    second_name: (data.second_name || data.last_name).trim(),

    email: data.email.trim(),

    // Support both 'phone_number' and 'phone' keys
    phone_number: (data.phone_number || data.phone).trim(),

    // Support both 'eircode' and 'eir_code' keys, convert to uppercase
    eircode: (data.eircode || data.eir_code).trim().toUpperCase()
    };

    // Cosnt to hold validation messages errors
    const errors = [];

    // Check if name is valid
    if (!isValidName(cleaned.first_name)) {
        errors.push('First name must be alphanumeric and up to 20 characters');

    }

    // Check if last name is valid
    if (!isValidName(cleaned.second_name)) {
        errors.push('Last name must be alphanumeric and up to 20 characters');
    }

    // Check if email is valid
    if (!isValidEmail(cleaned.email)) {
        errors.push('Invalid email format');
    }

    // Check if phone number is valid
    if (!isValidPhone(cleaned.phone_number)) {
        errors.push('Phone number must have exactly 10 digits');
    }

    // Check if eircode is valid
    if (!isValidEircode(cleaned.eircode)) {
        errors.push('Eircode must start with a number and have 6 alphanumeric characters');
    }

    // Return validation result
    return {
        isValid: errors.length === 0,
        errors,
        data: cleaned
    };
}

// Export validation functions
module.exports = {
  isValidName,
  isValidEmail,
  isValidPhone,
  isValidEircode,
  validateFullUser
};