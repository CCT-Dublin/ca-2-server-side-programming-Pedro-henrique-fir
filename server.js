
//Imports Express to create the web server
const express = require('express');

//Imports database.js to connect with MySQL database
const database = require("./database");

//Middleware to parse form data sent via POST
const bodyParser = require('body-parser');

//Module to handle and resolve file paths
const path = require('path');

//Initializes the Express
const app = express();

//Port where the server will run
const PORT = 3000;

//Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

//Enables Express to read form data sent via HTML forms
app.use(bodyParser.urlencoded({ extended: true }));


app.use((req, res, next) => {
    const now = new Date().toISOString();
    console.log(`${req.method} ${req.url} - ${now}`);
    next();
});

//Route to serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

//Middleware to validate user data
function validateUserData(req, res, next) {

    const { first_name, second_name, email, phone_number, eircode } = req.body;

    const firstNameTrim = first_name?.trim();
    const secondNameTrim = second_name?.trim();
    const phoneTrim = phone_number?.trim();
    const eircodeTrim = eircode?.toUpperCase().trim();

    const nameRegex = /^[a-zA-Z0-9]{1,20}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^\d{10}$/;
    const eircodeRegex = /^[0-9][a-zA-Z0-9]{5}$/;

    if (
        !nameRegex.test(firstNameTrim) ||
        !nameRegex.test(secondNameTrim) ||
        !emailRegex.test(email) ||
        !phoneRegex.test(phoneTrim) ||
        !eircodeRegex.test(eircodeTrim)
    ) {
        return res.redirect('/?error=true');
    }


    req.body.first_name = firstNameTrim;
    req.body.second_name = secondNameTrim;
    req.body.phone_number = phoneTrim;
    req.body.eircode = eircodeTrim;

    next();
}

//Check if database schema is correct before accepting requests
function checkDatabaseSchema() {

    const sql = "SHOW COLUMNS FROM mysql_table";

    database.query(sql, (err, results) => {
        if (err) {
            console.error('Database schema check failed:', err.message);
            process.exit(1);
        }

        const requiredColumns = [
            'first_name',
            'second_name',
            'email',
            'phone_number',
            'eircode'
        ];

        const existingColumns = results.map(column => column.Field);

        const missingColumns = requiredColumns.filter(
            col => !existingColumns.includes(col)
        );

        if (missingColumns.length > 0) {
            console.error(
                'Database schema is invalid. Missing columns:',
                missingColumns.join(', ')
            );
            process.exit(1);
        }

        console.log('Database schema verified successfully');
    });
}



//POST route to process the submitted form data
app.post('/submit', validateUserData, (req, res) => {

    //Extract form data from the request body
    const { first_name, second_name, email, phone_number, eircode } = req.body;

    //If validation passes, insert the data into the database
    const query = "INSERT INTO mysql_table (first_name, second_name, email, phone_number, eircode) VALUES (?, ?, ?, ?, ?)";

    database.query(query, [first_name, second_name, email, phone_number, eircode], (err, result) => {
        if (err) {
            //If there is an error during insertion, redirect with error
            return res.redirect('/?error=true');

        }else {

            //If insertion is successful, redirect with success
            return res.redirect('/?success=true');

        }
        
    });
});

//Check database schema before starting the server
checkDatabaseSchema();

//Starts the server and listens on the specified port
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);

});
