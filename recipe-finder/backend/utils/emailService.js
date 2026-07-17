const nodemailer = require("nodemailer");

// Cached ethereal test account credentials to avoid re-generating on every login
let cachedTestAccount = null;

const getTransporter = async () => {
  // Use SMTP configuration if provided
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Fallback: Use Ethereal test account
  if (!cachedTestAccount) {
    try {
      console.log("[Email Service] Creating Ethereal test account...");
      cachedTestAccount = await nodemailer.createTestAccount();
      console.log(`[Email Service] Ethereal test account created: User = ${cachedTestAccount.user}`);
    } catch (err) {
      console.error("[Email Service] Failed to create Ethereal test account:", err.message);
      throw err;
    }
  }

  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: cachedTestAccount.user,
      pass: cachedTestAccount.pass,
    },
  });
};

const sendLoginEmail = async (userEmail, userName, isFirstTime = false) => {
  try {
    const transporter = await getTransporter();
    const fromAddress = process.env.SMTP_FROM || '"Recipe Finder" <no-reply@recipefinder.com>';

    const subject = isFirstTime 
      ? "Welcome to Recipe Finder!" 
      : "Welcome back to Recipe Finder!";

    const label = isFirstTime ? "Welcome Aboard" : "Login Notification";

    const messageIntro = isFirstTime
      ? "Thank you for creating an account with Recipe Finder today! We are absolutely thrilled to have you join our global community of food lovers and home chefs."
      : "We detected a new sign-in to your Recipe Finder account. If this was you, you're all set to discover some amazing new dishes today!";

    const info = await transporter.sendMail({
      from: fromAddress,
      to: userEmail,
      subject: subject,
      text: `Hello ${userName},\n\n${messageIntro}\n\nReady to prepare a delicious meal? Browse world cuisines, check out exact ingredients lists, and cook step-by-step with guided instructions.\n\nHappy Cooking,\nThe Recipe Finder Team`,
      html: `
        <div style="font-family: 'Outfit', 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; border: 1px solid #edd9c8; border-radius: 20px; background-color: #fcf8f5; color: #2b201a;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #c1440e; margin-top: 12px; margin-bottom: 4px; font-weight: 800; letter-spacing: -0.02em;">Recipe Finder</h2>
            <p style="color: #7f7066; font-size: 0.9rem; margin: 0; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700;">${label}</p>
          </div>
          
          <div style="background-color: #ffffff; border: 1px solid rgba(237, 217, 200, 0.6); border-radius: 16px; padding: 24px; box-shadow: 0 4px 12px rgba(43, 32, 26, 0.02);">
            <p style="margin-top: 0; font-size: 1.05rem; line-height: 1.6;">Hello <strong>${userName}</strong>,</p>
            <p style="line-height: 1.6; color: #4e3f35;">${messageIntro}</p>
            <p style="line-height: 1.6; color: #4e3f35;">Browse our expanded list of world cuisines (including Italian, Indian, Spanish, Japanese, Thai, and more), select your favorite dish, and cook with ease using our checklist step guide.</p>
            
            <div style="margin: 28px 0; text-align: center;">
              <a href="http://localhost:5173" style="background-color: #c1440e; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block; box-shadow: 0 4px 12px rgba(193, 68, 14, 0.2); transition: all 0.2s ease;">Start Cooking Now</a>
            </div>
          </div>

          <div style="text-align: center; margin-top: 24px;">
            <p style="margin: 0; color: #7f7066; font-size: 0.9rem; line-height: 1.5;">Happy Cooking,<br><strong>The Recipe Finder Team</strong></p>
            <hr style="border: 0; border-top: 1px solid rgba(237, 217, 200, 0.4); margin: 20px 0;" />
            <p style="font-size: 0.75rem; color: #a5968d; margin: 0;">This is an automated notification. If you did not log in to your account, please secure your account immediately or contact support.</p>
          </div>
        </div>
      `,
    });

    console.log(`[Email Sent] Message ID: ${info.messageId}`);
    if (!process.env.SMTP_HOST) {
      console.log(`[Email Preview] URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
    return true;
  } catch (error) {
    console.error("[Email Error] Failed to send login email:", error.message);
    return false;
  }
};

const sendOtpEmail = async (userEmail, userName, otp) => {
  try {
    const transporter = await getTransporter();
    const fromAddress = process.env.SMTP_FROM || '"Recipe Finder" <no-reply@recipefinder.com>';

    const info = await transporter.sendMail({
      from: fromAddress,
      to: userEmail,
      subject: "Verify your Recipe Finder email",
      text: `Hello ${userName},\n\nYour registration OTP code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nHappy Cooking,\nThe Recipe Finder Team`,
      html: `
        <div style="font-family: 'Outfit', 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; border: 1px solid #edd9c8; border-radius: 20px; background-color: #fcf8f5; color: #2b201a;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #c1440e; margin-top: 12px; margin-bottom: 4px; font-weight: 800; letter-spacing: -0.02em;">Recipe Finder</h2>
            <p style="color: #7f7066; font-size: 0.9rem; margin: 0; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700;">Email Verification Required</p>
          </div>
          
          <div style="background-color: #ffffff; border: 1px solid rgba(237, 217, 200, 0.6); border-radius: 16px; padding: 32px 24px; box-shadow: 0 4px 12px rgba(43, 32, 26, 0.02); text-align: center;">
            <p style="margin-top: 0; font-size: 1.05rem; line-height: 1.6; text-align: left;">Hello <strong>${userName}</strong>,</p>
            <p style="line-height: 1.6; color: #4e3f35; text-align: left;">Thank you for starting your registration with Recipe Finder. To complete your sign-up, please verify your email address by entering the 6-digit verification code below:</p>
            
            <div style="margin: 28px auto; padding: 16px 24px; background-color: #fcf8f5; border: 1px dashed #c1440e; border-radius: 12px; display: inline-block; letter-spacing: 0.25em; font-size: 2.2rem; font-weight: 800; color: #c1440e; font-family: monospace;">
              ${otp}
            </div>
            
            <p style="margin: 0; font-size: 0.85rem; color: #7f7066;">This verification code is valid for <strong>10 minutes</strong>. Do not share this code with anyone.</p>
          </div>

          <div style="text-align: center; margin-top: 24px;">
            <p style="margin: 0; color: #7f7066; font-size: 0.9rem; line-height: 1.5;">Happy Cooking,<br><strong>The Recipe Finder Team</strong></p>
            <hr style="border: 0; border-top: 1px solid rgba(237, 217, 200, 0.4); margin: 20px 0;" />
            <p style="font-size: 0.75rem; color: #a5968d; margin: 0;">This email was sent to verify your identity. If you did not initiate this request, you can safely ignore this email.</p>
          </div>
        </div>
      `,
    });

    console.log(`[OTP Email Sent] Message ID: ${info.messageId}`);
    if (!process.env.SMTP_HOST) {
      console.log(`[OTP Email Preview] URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
    return true;
  } catch (error) {
    console.error("[OTP Email Error] Failed to send OTP email:", error.message);
    return false;
  }
};

module.exports = {
  sendLoginEmail,
  sendOtpEmail,
};
