const fs = require('fs');
const csv = require('csv-parser');


function isAlphaNumMax20(value) {
    return /^[a-zA-Z0-9]{1,20}$/.test(value);
}

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value) {
    return /^[0-9]{10}$/.test(value);
}

function isValidEircode(value) {
    return /^[0-9][a-zA-Z0-9]{5}$/.test(value);
}

let rowNumber = 1;

fs.createReadStream('personal_information.csv').pipe(csv()).on('data', (row) => {
    rowNumber++;

    const first_name = row.first_name;
    const last_name  = row.last_name;
    const email      = row.email;
    const phone      = row.phone;
    const eir_code   = row.eir_code;

    const isValid =
      isAlphaNumMax20(first_name) &&
      isAlphaNumMax20(last_name) &&
      isValidEmail(email) &&
      isValidPhone(phone) &&
      isValidEircode(eir_code);

    if (!isValid) {
      console.error(`Error on row ${rowNumber}: invalid data`);
      return;
    }

  }).on('end', () => {
    console.log('CSV processing finished');
  });
