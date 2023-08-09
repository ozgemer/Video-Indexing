const nodemailer = require('nodemailer');

async function sendMailToClient(clientMail, userName, vidName){
  const transporter  = nodemailer.createTransport({
    host: "smtp.gmail.com", // SMTP server address (usually mail.your-domain.com)
    port: 465, // Port for SMTP (usually 465)
    secure: true, // Usually true if connecting to port 465
    auth: {
      user: process.env.VIP_MAIL_USR, 
      pass: process.env.VIP_MAIL_PSW 
      // ⚠️ For better security, use environment variables set on the server for these values when deploying
    },
  });

  let info = await transporter .sendMail({
    from: process.env.VIP_MAIL_USR,
    to: clientMail,
    subject: "Your video is been uploaded!",
    text: `Hi ${userName},\n\nYour upload of ${vidName} is finished\n\nThank you,\n\nVIP team`, // plain text body
  });

  console.log('Email sent')
}

module.exports = { sendMailToClient};
