
//Imports Express to create the web server
const express = require('express');

//Imports database.js to connect with MySQL database
const database = require("./database");

//Module to handle and resolve file paths
const path = require('path');

//Helmet for security hardening
const helmet = require('helmet');

//Import validation module
const { validateFullUser } = require('./validation');

//Initializes the Express
const app = express();

//Use Helmet to set HTTP headers for security
app.use(helmet());

//Content Security Policy configuration
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'"],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      frameAncestors: ["'none'"]
    }
  })
);

//Port where the server will run
const PORT = 3000;

//Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

//Parses form data POST, so it is available in req.body
app.use(express.urlencoded({ extended: true }));

//Middleware to log each request with timestamp
app.use((req, res, next) => {
    const now = new Date().toISOString();
    console.log(`${req.method} ${req.url} - ${now}`);
    next();
});

//Route to serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

//Middleware to validate form data
const validateFormData = (req, res, next) => {
    const result = validateFullUser(req.body);

    if(!result.isValid) {
        return res.redirect('/?error=true');
    }

    // Replace req.body with the cleaned and validated data
    req.body = result.data;
    next();
};

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

        //Extract existing column names from the results
        const existingColumns = results.map(column => column.Field);

        //Check for missing columns
        const missingColumns = requiredColumns.filter(
            col => !existingColumns.includes(col)
        );

        //If any required columns are missing, log error and exit
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
app.post('/submit', validateFormData, (req, res) => {

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
