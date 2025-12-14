
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

//Route to serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

//POST route to process the submitted form data
app.post('/submit', (req, res) => {

    //Extract form data from the request body
    const { first_name, second_name, email, phone_number, eircode } = req.body;

    //Server-side validation

    const first_nameTrim = first_name.trim();
    const second_nameTrim = second_name.trim();

    //Regex to validate first name and last name, letters, number and spaces only and max 20 characters
    const nameRegex = /^[a-zA-Z0-9]{1,20}$/;

    if (!nameRegex.test(first_nameTrim) || !nameRegex.test(second_nameTrim)) {
        return res.redirect('/?error=true');
    }

    //Regex to validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        return res.redirect('/?error=true');
    }
    
    const phoneTrim = phone_number.trim();

    //Regex to validate phone number, digits only and exactly 10 digits
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneTrim)) {
        return res.redirect('/?error=true');
    }

    const eircodeTrim = eircode.toUpperCase().trim();

    //Regex to validate Eircode format
    const eircodeRegex = /^[0-9][a-zA-Z0-9]{5}$/;
    if (!eircodeRegex.test(eircodeTrim)) {
        return res.redirect('/?error=true');
    }

    //If validation passes, insert the data into the database
    const query = "INSERT INTO mysql_table (first_name, second_name, email, phone_number, eircode) VALUES (?, ?, ?, ?, ?)";
    database.query(query, [first_nameTrim, second_nameTrim, email, phoneTrim, eircodeTrim], (err, result) => {
        if (err) {
            //If there is an error during insertion, redirect with error
            return res.redirect('/?error=true');

        }else {

            //If insertion is successful, redirect with success
            return res.redirect('/?success=true');

        }
        
    });
});

app.listen(PORT, () => {
    console.log('http://localhost:${PORT}');
});
