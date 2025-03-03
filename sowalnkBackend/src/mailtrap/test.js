import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secre: true,
  auth: {
    user: process.env.BREVO_EMAIL,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

const sendEmail = async (toEmail, subject, content) => {
  try {
    const info = await transporter.sendMail({
      from: `"sowalnk" <${process.env.BREVO_EMAIL}>`,
      to: toEmail,
      subject,
      text: "hi this is test mail ",
      html: content,
    });

    console.log("Email sent successfully", info);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
sendEmail("ay614838@gmail.com", "welcome email", "<h1>hello</h1>");

export default sendEmail;
