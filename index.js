const express = require("express");
const nodemailer = require("nodemailer"); 
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser'); 
const dotenv = require("dotenv");
const fs = require('fs'); 
const date = require('date-and-time'); 
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const user = process.env.USER;
const password = process.env.PASSWORD;
// enable files upload
app.use(fileUpload({
  createParentPath: true
}));

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


 

// send applicaton data to email
app.post("/application-form", function(req, res) {
  console.log(req.files)
  const name = `${req.body.firstname} ${req.body.lastname}`;
  const email = req.body.email;
  const phone = `(+${req.body.countryCode}) ${req.body.phone}`;  
  const resume = req.files.resume;
  const message = req.body.message;
  const website = req.body.website;
  const role = req.body.role;
  console.log(req.files);
  resume.mv('./uploads/' + req.files.resume);

  const applicationFormTransport = nodemailer.createTransport({
    service: "gmail",
    secure: "false",
    port: "25",
    auth: {
      user: user,
      pass: password
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOption = {     
    to: "skanjarla@zyclyx.com",
    subject: `New Job Application for ${role} from virtech website ${date.format(new Date(), 'DD/MM/YYYY HH:mm A')}`,     
    html:`<p>Dear HR Team, </p>
    <p>Please find the candidate profile and attached resume for ${role} role below</p>
    <table style="border-collapse:collapse">
    <tr style="background-color:#00bdd5;font-size:1.2rem;"><td style="padding:1rem;border-right:1px solid #0D93B8;">Source</td><td style="font-weight:600;padding:1rem;">${website} Website</td></tr>          
    <tr style="background-color:#0d93b833;font-size:1.2rem;"><td style="padding:1rem;border-right:1px solid #00bdd5;">Fullname</td><td style="font-weight:600;padding:1rem;">${name}</td></tr>
    <tr style="background-color:#00bdd5;font-size:1.2rem;"><td style="padding:1rem;border-right:1px solid #0D93B8;">Email</td><td style="font-weight:600;padding:1rem;">${email}</td></tr>
    <tr style="background-color:#0d93b833;font-size:1.2rem;"><td style="padding:1rem;border-right:1px solid #00bdd5;">Phone</td><td style="font-weight:600;padding:1rem;">${phone}</td></tr>
    <tr style="background-color:#00bdd5;font-size:1.2rem;"><td style="padding:1rem;border-right:1px solid #0D93B8;">Position</td><td style="font-weight:600;padding:1rem;">${role}</td></tr>
    <tr style="background-color:#0d93b833;font-size:1.2rem;"><td style="padding:1rem;border-right:1px solid #00bdd5;">Message</td><td style="font-size:0.9rem;padding:1rem;max-width:400px;">${message}</td></tr>
    </table>
    <p>Thank you</p>`,     
    attachments: [
      {
        filename: resume.name,
        content: fs.createReadStream(`./uploads/${resume.name}`)  
      }
    ]
  };

  applicationFormTransport.sendMail(mailOption, (error,info)=> {
    if (error) {       
      console.log("Error"+error);
    } else {
      console.log("Success" + info);
      res.send(info);
    }
  });  
});

// send contact form data to email
app.post("/contact", function(req, res) {
                
  const fullname = req.body.fullname;
  const email = req.body.email;
  const phone = `(+${req.body.countryCode}) ${req.body.phone}`;;   
  const message = req.body.message;
  const website = req.body.website;   
   
 console.log(req.body)
  const applicationFormTransport = nodemailer.createTransport({
    service: "gmail",
    secure: "false",
    port: "25",
    auth: {
      user: user,
      pass: password
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOption = {  
    to: "skanjarla@zyclyx.com",
    subject: "New Job Application",
    subject: `New Enquiry from ${website} website ${date.format(new Date(), 'DD/MM/YYYY HH:mm A')}`,     
    html:`<p>Dear Team, </p>
    <p>Please find the enquiry details from ${website} website contact us form below</p>
    <table style="border-collapse:collapse">
    <tr style="background-color:#00bdd5;font-size:1.2rem;"><td style="padding:1rem;border-right:1px solid #0D93B8;">Source</td><td style="font-weight:600;padding:1rem;">${website} Website</td></tr>          
    <tr style="background-color:#0d93b833;font-size:1.2rem;"><td style="padding:1rem;border-right:1px solid #00bdd5;">Fullname</td><td style="font-weight:600;padding:1rem;">${fullname}</td></tr>
    <tr style="background-color:#00bdd5;font-size:1.2rem;"><td style="padding:1rem;border-right:1px solid #0D93B8;">Email</td><td style="font-weight:600;padding:1rem;">${email}</td></tr>
    <tr style="background-color:#0d93b833;font-size:1.2rem;"><td style="padding:1rem;border-right:1px solid #00bdd5;">Phone</td><td style="font-weight:600;padding:1rem;">${phone}</td></tr>     
    <tr style="background-color:#00bdd5;font-size:1.2rem;"><td style="padding:1rem;border-right:1px solid #0D93B8;">Message</td><td style="font-size:0.9rem;padding:1rem;max-width:400px;">${message}</td></tr>
    </table>
    <p>Thank you</p>`,
  };

  applicationFormTransport.sendMail(mailOption, function(error,info) {
    if (error) {       
      console.log("Error"+error);
    } else {
      console.log("Success" + info);
      res.send(info);
    }
  });
});

app.listen(port, () => console.log(`app listening on port ${port}!`));
