import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplate.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });
  } catch (error) {
    console.error(`Error sending verification`, error);

    throw new Error(`Error sending verification email: ${error}`);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "f5167911-281c-4ef2-991a-c9433a7bac54",
      template_variables: {
        company_info_name: "Sowalnk Company",
        name: name,
      },
    });
  } catch (error) {
    console.error(`Error sending welcome email`, error);

    throw new Error(`Error sending welcome email: ${error}`);
  }
};

export const sendEmail = async (email, name, message) => {
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: [{ email: process.env.MAILTAP_SEND_TO }],
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 10px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4CAF50; text-align: center;">New Contact Form Submission</h2>
          <div style="background-color: #fff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <p style="font-size: 16px; margin: 10px 0;"><strong style="color: #4CAF50;">Name:</strong> ${name}</p>
            <p style="font-size: 16px; margin: 10px 0;"><strong style="color: #4CAF50;">Email:</strong> ${email}</p>
            <p style="font-size: 16px; margin: 10px 0;"><strong style="color: #4CAF50;">Message:</strong> ${message}</p>
          </div>
          <hr style="border: 0; height: 1px; background: #ddd;">
      <p style="text-align: center; color: #666; font-size: 14px;">This message was sent via your website contact form.</p>
        </div>
      `,
    });
    console.log("Email sent successfully", response);
  } catch (error) {
    console.error(`Error in sending email`, error);

    throw new Error(`Error in sending email: ${error}`);
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset",
    });
  } catch (error) {
    console.error(`Error sending password reset email`, error);

    throw new Error(`Error sending password reset email: ${error}`);
  }
};

export const sendResetSuccessEmail = async (email) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset",
    });

    console.log("Password reset email sent successfully", response);
  } catch (error) {
    console.error(`Error sending password reset success email`, error);

    throw new Error(`Error sending password reset success email: ${error}`);
  }
};
