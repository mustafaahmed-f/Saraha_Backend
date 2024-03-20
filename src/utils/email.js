import nodemailer from "nodemailer";

async function sendEmail({
  fromPREFIX = "SARAHA",
  from = process.env.EMAIL,
  to,
  cc,
  bcc,
  subject,
  text,
  html,
  attachments = [],
} = {}) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: `"${fromPREFIX}" <${from}>`, // sender address
    to, // list of receivers
    bcc,
    cc,
    subject, // Subject line
    text, // plain text body
    html, // html body
    attachments,
  });
  console.log(info);
}

export default sendEmail;
