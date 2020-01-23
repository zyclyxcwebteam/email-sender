const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = 3000;
const user = process.env.USER;
const password = process.env.PASSWORD;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        var file = file.originalname

        cb(null, file)
    }
})

const upload = multer({ storage: storage })


// send applicaton data to email
app.post('/application-form', upload.single('file'), function (req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const subject = req.body.subject;
    const resume = req.file.originalname;
    const message = req.body.message;
    console.log(name, email, phone, resume, subject, message);

    const applicationFormTransport = nodemailer.createTransport({
        service: 'gmail',
        secure: 'false',
        port: '25',
        auth: {
            user: user,
            pass: password
        },
        tls: {
            rejectUnauthorized: false
        },

    });

    const mailOption = {
        // from:'srikanthkanjarla@gmail.com',
        to: 'sandeep.reddy@zyclyx.com',
        subject: 'New Job Application',
        text: 'Name : ' + name + '\n' + 'Email : ' + email + '\n' + 'Phone : ' + phone + '\n' + 'Subject : ' + subject + '\n' + 'Resume : ' + resume + '\n' + 'Message : ' + message + '\n',
        attachments: [{ filename: 'image.png', content: fs.createReadStream(`./uploads/${resume}`) }]
    }

    applicationFormTransport.sendMail(mailOption, function (req, res) {
        if (req) {
            console.log("Message Not Sent :(")
            console.log(req)
        }
        else {
            console.log("Message Sent Succesfully!")
        }
    })
    res.send('Hello World 2!')

})

// send contact form data to email
app.post('/contact', upload.single(''), function (req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const subject = req.body.subject;
    const message = req.body.message;
    console.log(name, email, phone, subject, message);

    const applicationFormTransport = nodemailer.createTransport({
        service: 'gmail',
        secure: 'false',
        port: '25',
        auth: {
            user: user,
            pass: password
        },
        tls: {
            rejectUnauthorized: false
        },

    });

    const mailOption = {         
        from: 'sandeep.reddy@zyclyx.com',
        to: 'sandeep.reddy@zyclyx.com',
        subject: 'New Job Application',
        // text: 'Name : ' + name + '\n' + 'Email : ' + email + '\n' + 'Phone : ' + phone + '\n' + 'Subject : ' + subject + '\n' + 'Message : ' + message + '\n',
        text:`Name : ${name} \n Email : ${email} \n Phone : ${phone} \n Subject : ${subject} \n Message : ${message}`,
        // attachments: [{ filename: 'image.png', content: fs.createReadStream(`./uploads/${resume}`) }]
    }

    applicationFormTransport.sendMail(mailOption, function (req, res) {
        if (req) {
            console.log("Message Not Sent :(")
            console.log(req)
        }
        else {
            console.log("Message Sent Succesfully!")
            //res.send('Contact Msessage Sent Successfully')
        }
    })
    
})


app.listen(port, () => console.log(`app listening on port ${port}!`))