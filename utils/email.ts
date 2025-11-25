import crypto from "crypto";

// Generate email verification token
export function generateEmailToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// Real email verification implementation (commented for demo)
// Uncomment when deploying to Vercel and configure your email service
export async function sendVerificationEmail(
  email: string,
  token: string
): Promise<void> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const verificationUrl = `${baseUrl}/verify-email?token=${token}`;

  // For development/demo - logs the verification link
  console.log("Email verification link:", verificationUrl);
  console.log("Send to:", email);

  /* 
  // REAL EMAIL IMPLEMENTATION - Uncomment when deploying to Vercel
  
  // Option 1: Using Nodemailer with SMTP (Gmail, Outlook, etc.)
  const nodemailer = require('nodemailer');
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  
  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'noreply@yourdomain.com',
    to: email,
    subject: 'تایید ایمیل - Real State',
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
          <h2 style="color: #0ea5e9; text-align: center;">تایید ایمیل</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            سلام،
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            برای تکمیل ثبت نام در سایت Real State، لطفا روی دکمه زیر کلیک کنید:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="display: inline-block; padding: 12px 30px; background-color: #0ea5e9; 
                      color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
              تایید ایمیل
            </a>
          </div>
          <p style="font-size: 14px; line-height: 1.6; color: #666;">
            یا لینک زیر را در مرورگر خود کپی کنید:
          </p>
          <p style="font-size: 12px; word-break: break-all; color: #999;">
            ${verificationUrl}
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #666; margin-top: 20px;">
            این لینک تا 24 ساعت معتبر است.
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #666;">
            اگر شما این ایمیل را درخواست نکرده‌اید، لطفا آن را نادیده بگیرید.
          </p>
        </div>
      </div>
    `,
  });

  // Option 2: Using Resend (Recommended for Vercel)
  // npm install resend
  // import { Resend } from 'resend';
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // 
  // await resend.emails.send({
  //   from: 'onboarding@resend.dev',
  //   to: email,
  //   subject: 'تایید ایمیل - Real State',
  //   html: `...same HTML as above...`
  // });

  // Option 3: Using SendGrid
  // npm install @sendgrid/mail
  // import sgMail from '@sendgrid/mail';
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
  // 
  // await sgMail.send({
  //   to: email,
  //   from: process.env.SENDGRID_FROM_EMAIL!,
  //   subject: 'تایید ایمیل - Real State',
  //   html: `...same HTML as above...`
  // });
  */
}

