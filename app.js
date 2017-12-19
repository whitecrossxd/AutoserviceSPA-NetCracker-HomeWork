var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.post('/getResource', function (req, res, next) {
    console.log("Your request:" + JSON.stringify(req.body));
    res.setHeader('Content-Type', 'application/json');
    res.send(req.body);
    // Use at least Nodemailer v4.1.0
    const nodemailer = require('nodemailer');

    // Generate SMTP service account from ethereal.email
    nodemailer.createTestAccount((err, account) => {
        if (err) {
            console.error('Failed to create a testing account. ' + err.message);
            return process.exit(1);
        }

        console.log('Credentials obtained, sending message...');

        // Create a SMTP transporter object
        let transporter = nodemailer.createTransport({
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
                user: account.user,
                pass: account.pass
            }
        });

        // Message object
        let message = {
            from: 'Sender Name <sender@example.com>',
            to: 'whitecrossxd@gmail.com',
            subject: 'Nodemailer is unicode friendly ✔',
            text: req.body.name,
            html: '<p><b>Hello</b> '+req.body.name+'</p>'
        };

        transporter.sendMail(message, (err, info) => {
            if (err) {
                console.log('Error occurred. ' + err.message);
                return process.exit(1);
            }

            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
    });
    next();
});
// App states
app.get('/main', function(req,res){
    res.sendfile(__dirname + '/public/index.html');
});
app.get('/about', function(req,res){
    res.sendfile(__dirname + '/public/index.html');
});
app.get('/clientForm', function(req,res){
    res.sendfile(__dirname + '/public/index.html');
});
app.get('/works', function(req,res){
    res.sendfile(__dirname + '/public/index.html');
});
app.get('/partners', function(req,res){
    res.sendfile(__dirname + '/public/index.html');
});

app.listen(8080, function () {
    console.log('Listening on port 8080...');
});

module.exports = app;