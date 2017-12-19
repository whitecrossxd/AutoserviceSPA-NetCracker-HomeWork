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
    nodemailer.createTestAccount((err, account) => {
        
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: account.user, // generated ethereal user
                    pass: account.pass  // generated ethereal password
                }
            });
        
            // setup email data with unicode symbols
            let mailOptions = {
                from: '"Fred Foo 👻" <foo@blurdybloop.com>', // sender address
                to: 'whitecrossxd@gmail.com', // list of receivers
                subject: 'Hello ✔', // Subject line
                text: req.body.name, // plain text body
                html: '<b>Hello world?</b>' // html body
            };
        
            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        
                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
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