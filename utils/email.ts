import crypto from "crypto";
import { Resend } from "resend";

// Generate email verification token
export function generateEmailToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// Email verification implementation using Resend
export async function sendVerificationEmail(
  email: string,
  token: string
): Promise<void> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const verificationUrl = `${baseUrl}/verify-email?token=${token}`;
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  // Check if API key is configured
  if (!resendApiKey) {
    // Fallback to console log in development
    console.log("⚠️ RESEND_API_KEY not configured. Email verification link:", verificationUrl);
    console.log("Send to:", email);
    return;
  }

  try {
    const resend = new Resend(resendApiKey);

    const emailHtml = `
      <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #0ea5e9; text-align: center; margin-bottom: 20px;">تایید ایمیل</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #333; margin-bottom: 15px;">
            سلام،
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #333; margin-bottom: 20px;">
            برای تکمیل ثبت نام در سایت Real State، لطفا روی دکمه زیر کلیک کنید:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="display: inline-block; padding: 12px 30px; background-color: #0ea5e9; 
                      color: white; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
              تایید ایمیل
            </a>
          </div>
          <p style="font-size: 14px; line-height: 1.6; color: #666; margin-top: 20px;">
            یا لینک زیر را در مرورگر خود کپی کنید:
          </p>
          <p style="font-size: 12px; word-break: break-all; color: #999; background-color: #f9f9f9; padding: 10px; border-radius: 5px; margin: 10px 0;">
            ${verificationUrl}
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #666; margin-top: 20px;">
            این لینک تا 6 ساعت معتبر است.
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #666; margin-top: 10px;">
            اگر شما این ایمیل را درخواست نکرده‌اید، لطفا آن را نادیده بگیرید.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">
            این ایمیل به صورت خودکار ارسال شده است. لطفا به آن پاسخ ندهید.
          </p>
        </div>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "تایید ایمیل - Real State",
      html: emailHtml,
    });

    if (error) {
      console.error("Error sending verification email via Resend:", error);
      // Fallback to console log
      console.log("Email verification link:", verificationUrl);
      console.log("Send to:", email);
      throw error;
    }

    console.log("✅ Verification email sent successfully via Resend:", data);
  } catch (error) {
    console.error("Failed to send verification email:", error);
    // Fallback to console log in case of error
    console.log("Email verification link:", verificationUrl);
    console.log("Send to:", email);
    throw error;
  }
}

