const nodemailer = require("nodemailer");

const config = {
    host: "smtp.gmail.com",
    port: 465,
    secure:true,
    auth:{
        user: "vmh.nodemailer@gmail.com",
        pass: process.env.MAILER_PASSWORD,
    }
}

const transport = nodemailer.createTransport(config);

module.exports = transport;