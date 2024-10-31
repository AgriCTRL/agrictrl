// Create a new file: src/utils/emailService.ts
import nodemailer from 'nodemailer';

// Configure transport
const transporter = nodemailer.createTransport({
  service: 'gmail',  // or configure your own SMTP
  auth: {
    user: 'mampustijobert@gmail.com',
    pass: 'REZERO@aerox155' // Use App Password if using Gmail
  }
});

export const sendVerificationEmail = async (to: string, code: string) => {
  try {
    const mailOptions = {
      from: 'mampustijobert@gmail.com',
      to: to,
      subject: 'Password Reset Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Password Reset Verification</h2>
          <p>Your verification code is:</p>
          <h1 style="letter-spacing: 5px; font-size: 32px; background-color: #f4f4f4; padding: 10px; text-align: center;">
            ${code}
          </h1>
          <p>This code will expire shortly. Please do not share this code with anyone.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send verification email');
  }
};
