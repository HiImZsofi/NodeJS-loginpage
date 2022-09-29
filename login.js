const mysql = require('mysql');
const express = require('express');
const session = require('express-session');  
const path = require('path');

const connection = mysql.createConnection({  //default database connection
    host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'nodelogin',
})

const app = express(); //initializes express

app.use(session({           //express module configuration
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());  //express json extracts data from the html page
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));


app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, '/login.html'));     //declare the login route
})

app.post('/auth', function(request, response) {
    //capture the input fields
    let username = request.body.username;
    let password = request.body.password;

    if(username && password) {
        connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields){
            if (error) {
                throw error;
            }
            //if account exists
            if(results.length > 0) {
                request.session.loggedIn = true;
                request.session.username = username;
            }
        })
    }
})
