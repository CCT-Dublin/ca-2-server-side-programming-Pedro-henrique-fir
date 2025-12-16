const fs = require("fs");
const csv = require("csv-parser");
const database = require("./database");
const { validateFullUser } = require('./validation');


let rowNumber = 0;

fs.createReadStream("Personal_information.csv").pipe(csv()).on("data", (row) => {
    rowNumber++;

    const result = validateFullUser(row);

    if (!result.isValid) {
      console.error(`Row ${rowNumber} error: ${result.errors.join(' | ')}`);
      return;
      
    }
    
    const query = "INSERT INTO mysql_table (first_name, second_name, email, phone_number, eircode) VALUES (?, ?, ?, ?, ?)";

    const currentRow = rowNumber; 

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
