const nodemailer = require('nodemailer');


const sendEmail = async options  => {
    //1) Create a transporter
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
        }
      });
    //2) Define the eemail options
      const mailOptions = {
          from: 'Alejandro Caputto <alejandro-user-pass@gmail.com>',
          to: options.email,
          subject: options.subject,
          message: options.message,
          text: options.text
        //   to: options.email
      }
    //3) Send the email with nodemailer
   await transport.sendMail(mailOptions);

};

module.exports = sendEmail;