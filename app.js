const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html")

});

app.post("/", function (req, res) {

    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;

    const data = {

        email_address: email,
        status: "subscribed",
        merge_fields:
        {
            FNAME: firstName,
            LNAME: lastName
        }
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us14.api.mailchimp.com/3.0/lists/462474fec5/members";

    const options = {
        method: "POST",
        auth: "efraim1:cfe0a589d254effd4814943c6bb925ab-us14"
    }

    const request = https.request(url, options, function (response) {

        if (response.statusCode === 200)
        res.sendFile(__dirname + "/success.html");
        else
        res.sendFile(__dirname + "/failure.html");

        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });
    });



    console.log(firstName, lastName, email);

    request.write(jsonData);
    request.end();


    //API mailchimp key cfe0a589d254effd4814943c6bb925ab-us14

    //ID 462474fec5 https://<dc>.api.mailchimp.com/3.0/lists/462474fec5/members
});

app.post("/failure", function(req, res) {
    res.redirect("/");
});



app.listen(process.env.PORT || 3000, function () {
    console.log("server is up on port 3000");
})