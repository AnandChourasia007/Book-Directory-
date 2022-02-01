var express = require("express");
var bodyParser = require("body-parser");
var { google } = require('googleapis');
// const fs = require('fs');                 //Functionality to add book to the website (using google drive api), will implement later 🤧 
// const CLIENT_ID='70123847870-g9cv238v1q38802fgrc05nd53tf37fn6.apps.googleusercontent.com';
// const CLIENT_SECRET='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';
// const REDIRECT_URI='https://developers.google.com/oauthplayground';
// const REFRESH_TOKEN='1//04Ekhv26bTwqsCgYIARAAGAQSNwF-L9Ir-X8t9u6z91Awe7FMthwFzoegIx84K8k3_O7AlUDmNn2RAEP-5w4wHgkyfua9P227Eo4';
const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/signupdb');
// const oauth2Client=new google.auth.OAuth2(
//     CLIENT_ID,      
//     CLIENT_SECRET,
//     REDIRECT_URI
// );
// oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN})
var db = mongoose.connection;                     
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function (callback) {
    console.log("Connection succeeded");
})
const User = mongoose.model('User', {
    email: { type: String },
    name: { type: String },                   
    password: { type: String }
})
var app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/sign_up', function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var data = {
        "name": name,
        "email": email,
        "password": password
    }
    db.collection('details').insertOne(data, function (err, collection) {
        if (err) {
            console.log("User not registered");
            throw err;
        }
        console.log(name);
        console.log("Record inserted successfully");
    });
    //res.redirect('homepage.html');
    res.sendFile(__dirname + "/public/LoginSignup.html");
})
app.post('/login', async function (req, res) {                            //ASYNC bcoz finding for a document in the database requires time, wasted an hour figuring this out
    var name = req.body.name;
    var password = req.body.password;
    var cnt= await db.collection("details").countDocuments({name, password},{limit:1});            //This step takes time as it returns a promise, so using await here.
    if (cnt > 0) {
        //User found in database
        console.log("User logged in successfully");
        //res.redirect('homepage.html');
        res.sendFile(__dirname + "/public/homepage.html");
    }
    else {
        //User not registered yet, but trying to login
        //window.alert("Please register first");
        console.log("user trying login without registering");
        res.sendFile(__dirname + "/public/LoginSignup.html");
    }
})

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/LoginSignup.html");
}).listen(27017);
console.log("server running at port 27017");
module.exports = app