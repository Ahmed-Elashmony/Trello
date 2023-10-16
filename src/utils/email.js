import nodemailer from "nodemailer";

const sendEmail = async ({
  from = process.env.EMAIL,
  to,
  cc,
  bcc,
  subject,
  html,
  attachments = [],
}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: `"Ahmed Ali" <${from}>`, // sender address
    to,
    cc,
    bcc,
    subject,
    html,
    attachments,
  });
};

export default sendEmail;
