const nodemailer = require("nodemailer");

const sendMailToUser = async (email, userName, password) => {
  console.log(email, userName, password, " maills");

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_SMTP,
      port: process.env.MAIL_PORT,
      auth: {
        user: "gayathri.dhamodharan@colanonline.com",
        pass: process.env.MAIL_APP_KEY,
      },
    });
    transporter.verify((error, success) => {
      if (error) {
        console.log(`SMTP Connection Failed:, ${error.message}`);
      } else {
        console.log("SMTP Connection Established");
      }
    });
    const mailOptions = {
      from: "sriganesan.k@colanonline.com",
      to: email,
      subject: "Welcome To Our Smart HR ",
      text: `Hello ${userName},\n\nWelcome to  Smart HR! Here are your login credentials:\n\nUserMail: ${email}\nPassword: ${password}\n\nPlease keep this information secure.`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Mail sent successfully to ${email}`);
  } catch (error) {
    console.log(error.message, "catchsss");
  }
};

module.exports = {
  sendMailToUser,
};
