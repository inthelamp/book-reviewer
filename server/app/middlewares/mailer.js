require("dotenv").config();

const nodemailer = require("nodemailer");

module.exports.sendEmail = async (email, code) => {
  try {
    const smtpEndpoint = process.env.SMTP_SERVER;
    const port = process.env.SMTP_PORT;
    const senderAddress = process.env.SENDER_EMAIL_ADDRESS;

    var toAddress = email;

    const smtpUsername = "apikey";
    const smtpPassword = process.env.SG_APIKEY;

    var subject = "Verify your email";

    // The body of the email for recipients
    var body_html = `<!DOCTYPE> 
    <html>
      <body>
        <p>Your authentication code is : </p> <b>${code}</b>
      </body>
    </html>`;

    // Create the SMTP transport.
    let transporter = nodemailer.createTransport({
      host: smtpEndpoint,
      port: port,
      secure: true, // true for 465, false for other ports
      auth: {
        user: smtpUsername,
        pass: smtpPassword,
      },
    });

    // Specify the fields in the email.
    let mailOptions = {
      from: senderAddress,
      to: toAddress,
      subject: subject,
      html: body_html,
    };

    let info = await transporter.sendMail(mailOptions);

    return { error: false };

  } catch (error) {
    console.error("send-email-error", error);

    return {
      error: true,
      message: "Cannot send email",
    };
  }
};
