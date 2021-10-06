require("dotenv").config();

const nodemailer = require("nodemailer");

/**
 * Composing and sending email
 * @param {string} email - email address which the email is sent to 
 * @param {string} code  - verification code
 */
exports.sendEmail = async (email, code) => {
  try {
    const smtpEndpoint = process.env.SMTP_SERVER;
    const port = process.env.SMTP_PORT;
    const senderAddress = process.env.SENDER_EMAIL_ADDRESS;

    var toAddress = email;

    const smtpUsername = "apikey";
    const smtpPassword = process.env.SG_APIKEY;

    var subject = "Verify your email";

    // The body of the email to be sent
    var body_html = `<!DOCTYPE> 
    <html>
      <body>
        <p>Your authentication code is : </p> <b>${code}</b>
      </body>
    </html>`;

    // Creating the SMTP transport.
    let transporter = nodemailer.createTransport({
      host: smtpEndpoint,
      port: port,
      secure: true, // true for 465, false for other ports
      auth: {
        user: smtpUsername,
        pass: smtpPassword,
      },
    });

    // Defining email object
    let mailObject = {
      from: senderAddress,
      to: toAddress,
      subject: subject,
      html: body_html,
    };

    // Sending email
    let info = await transporter.sendMail(mailObject);

    return { error: false };

  } catch (error) {
    console.error("send-email-error", error);

    return {
      error: true,
      message: "Cannot send email",
    };
  }
};
