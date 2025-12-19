//Imports file system module to read CSV file 
const fs = require("fs");

//Imports csv-parser module to parse CSV data
const csv = require("csv-parser");

//Imports database.js to connect with MySQL database
const database = require("./database");

//Import validation module
const { validateFullUser } = require('./validation');

//Counter to track row numbers for error reporting
let rowNumber = 0;

//Read and process the CSV file
fs.createReadStream("Personal_information.csv").pipe(csv()).on("data", (row) => {

  //Increment row number
  rowNumber++;

    //Validate each row
    const result = validateFullUser(row);

    //If validation fails, log the errors with row number
    if (!result.isValid) {
      console.error(`Row ${rowNumber} error: ${result.errors.join(' | ')}`);
      return;
      
    }
    
    //If validation passes, insert data into the database
    const query = "INSERT INTO mysql_table (first_name, second_name, email, phone_number, eircode) VALUES (?, ?, ?, ?, ?)";
   
    const currentRow = rowNumber; 

    //Insert validated data into the database
    database.query(query, [
      result.data.first_name,
      result.data.second_name,
      result.data.email,
      result.data.phone_number,
      result.data.eircode], (err) => {
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
