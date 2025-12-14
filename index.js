const fs = require("fs");
const csv = require("csv-parser");
const database = require("./database");

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

fs.createReadStream("Personal_information.csv").pipe(csv()).on("data", (row) => {
    rowNumber++;

    const first_name = row.first_name;
    const last_name = row.last_name;
    const email = row.email;
    const phone = row.phone;
    const eir_code = row.eir_code;

    const errors = [];

    if (!isAlphaNumMax20(first_name)){
      errors.push("first_name must be alphanumeric and max 20 chars");
    }

    if (!isAlphaNumMax20(last_name)){
      errors.push("second_name must be alphanumeric and max 20 chars");
    }

    if (!isValidEmail(email)){
        errors.push("email format is invalid");
    }

    if (!isValidPhone(phone)){
        errors.push("phone_number must be exactly 10 digits");
    }

    if (!isValidEircode(eir_code)){
      errors.push("eircode must start with a number, be alphanumeric, and be 6 chars");
    }

    if (errors.length > 0) {
      console.error(`Error on row ${rowNumber}: ${errors.join(" | ")}`);
      return;
    }

    const query = "INSERT INTO mysql_table (first_name, second_name, email, phone_number, eircode) VALUES (?, ?, ?, ?, ?)";

    const currentRow = rowNumber; 

    database.query(query, [first_name, last_name, email, phone, eir_code], (err) => {
        if (err) {
          console.error(`Database error on row ${currentRow}:`, err.message);
        } else {
          console.log(`Row ${currentRow} inserted successfully`);
        }
      }
    );

  }).on("end", () => {
    console.log("CSV processing finished");
    database.end();
  });
