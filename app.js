var express = require("express");
var bodyParser = require("body-parser");

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shivarth');  // replace 'your-database-name' with your database name
var db = mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function (callback) {
    console.log("connection succeeded");
})

var app = express()

app.use(bodyParser.json());
app.use(express.static('public'));  // serve static files from 'public' directory
app.use(bodyParser.urlencoded({
    extended: true
}));
app.post('/sign_up', function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var pass = req.body.password;
    var phone = req.body.phone;

    var data = {
        "name": name,
        "email": email,
        "password": pass,
        "phone": phone
    }

    db.collection('details').insertOne(data, function (err, collection) {
        if (err) {
            console.error("Error inserting record: ", err);
            return res.status(500).json({ message: "Signup failed. Please try again." });
        }
        console.log("Record inserted Successfully");
        return res.status(200).json({ message: "Signup successful!" });
    });
});

app.post('/login', function (req, res) {
    var email = req.body.email;
    var pass = req.body.password;

    db.collection('details').findOne({ email: email, password: pass }, function (err, user) {
        if (err) throw err;
        if (user) {
            return res.redirect('login_success.html');
        } else {
            return res.redirect('login.html');  // or send an error message
        }
    });
});

app.get('/', function (req, res) {
    res.set({
        'Access-control-Allow-Origin': '*'
    });
    return res.redirect('index.html');
}).listen(3000)

console.log("server listening at port 3000");
