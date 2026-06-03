/**
 * email.ts — ProSource Email Service
 *
 * Uses the official Resend Node.js SDK (HTTP API) instead of Nodemailer SMTP.
 * This gives proper error messages, delivery receipts, and sandbox awareness.
 *
 * SANDBOX MODE (onboarding@resend.dev sender):
 *   Resend only allows sending TO your own registered email.
 *   In this mode, we forward ALL emails to the admin inbox, clearly labelled.
 *   Once you verify your domain on resend.com/domains, set:
 *     EMAIL_FROM=hello@yourdomain.com
 *   and remove EMAIL_SANDBOX_MODE=true from your .env.
 *   After that, customers will receive emails directly.
 */

import { Resend } from 'resend';
import { ILead } from '../models/Lead';

const resend = new Resend(process.env.RESEND_API_KEY || process.env.EMAIL_PASS);

const FROM = process.env.EMAIL_FROM || 'onboarding@resend.dev';
const ADMIN_EMAIL = process.env.EMAIL_TO || '';

// Detect sandbox mode: if using Resend's onboarding domain we CANNOT send to external addresses
const IS_SANDBOX = FROM.endsWith('@resend.dev') || FROM.endsWith('@resend.com') || !process.env.EMAIL_DOMAIN_VERIFIED;

// ─────────────────────────────────────────────────────────────
// Core send helper — individual, isolated, with full logging
// ─────────────────────────────────────────────────────────────
async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  label: string; // for logging only
}): Promise<boolean> {
  const { to, subject, html, label } = opts;

  // In sandbox, redirect customer emails to admin inbox with a wrapper
  const actualTo = IS_SANDBOX ? ADMIN_EMAIL : to;
  const actualSubject = IS_SANDBOX && to !== ADMIN_EMAIL
    ? `[SANDBOX — For: ${to}] ${subject}`
    : subject;

  if (IS_SANDBOX && to !== ADMIN_EMAIL) {
    console.warn(
      `[Email][${label}] SANDBOX MODE: Redirecting customer email to admin inbox.\n` +
      `  Original recipient : ${to}\n` +
      `  Actual recipient   : ${actualTo}\n` +
      `  Subject            : ${actualSubject}\n` +
      `  → To send directly to customers, verify your domain at resend.com/domains`
    );
  }

  console.log(`[Email][${label}] Sending → ${actualTo} | Subject: "${actualSubject}"`);

  try {
    const { data, error } = await resend.emails.send({
      from: `ProSource Enterprise <${FROM}>`,
      to: actualTo,
      subject: actualSubject,
      html,
    });

    if (error) {
      console.error(`[Email][${label}] ❌ Resend API error:`, JSON.stringify(error, null, 2));
      return false;
    }

    console.log(`[Email][${label}] ✅ Delivered. Resend ID: ${data?.id}`);
    return true;
  } catch (err) {
    console.error(`[Email][${label}] ❌ Unexpected error:`, err instanceof Error ? err.message : err);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────
// Customer confirmation — thank-you email
// ─────────────────────────────────────────────────────────────
export const sendContactConfirmation = async (lead: ILead): Promise<void> => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Enquiry Received - ProSource Enterprise</title>
    </head>
    <body style="margin:0;padding:0;background:#f0f0f0;font-family:Inter,-apple-system,Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f0f0;padding:40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0"
              style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">

              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg,#3D3D3D 0%,#578E7E 100%);padding:40px;text-align:center;">
                  <div style="width:48px;height:48px;background:rgba(255,255,255,0.15);border-radius:8px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
                    <span style="color:#ffffff;font-weight:800;font-size:18px;letter-spacing:-0.5px;">PS</span>
                  </div>
                  <h1 style="color:#ffffff;margin:0 0 6px;font-size:24px;font-weight:700;letter-spacing:-0.5px;">ProSource Enterprise</h1>
                  <p style="color:rgba(255,255,255,0.65);margin:0;font-size:13px;">B2B Procurement Partner</p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:40px 48px;">
                  <h2 style="color:#3D3D3D;margin:0 0 12px;font-size:22px;font-weight:700;">
                    Thank You, ${lead.name}! 🎉
                  </h2>
                  <p style="color:#5a5a5a;line-height:1.7;margin:0 0 24px;font-size:15px;">
                    We've successfully received your procurement enquiry. Our specialists will review your
                    requirements and get back to you with a tailored proposal within
                    <strong style="color:#578E7E;">1–2 business days</strong>.
                  </p>

                  <!-- Summary card -->
                  <div style="background:#F5ECD5;border-left:4px solid #578E7E;padding:24px;border-radius:8px;margin:0 0 28px;">
                    <h3 style="color:#3D3D3D;margin:0 0 16px;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">
                      Your Enquiry Summary
                    </h3>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color:#8a8a8a;font-size:13px;font-weight:600;width:90px;padding:5px 0;">Name</td>
                        <td style="color:#3D3D3D;font-size:13px;padding:5px 0;">${lead.name}</td>
                      </tr>
                      <tr>
                        <td style="color:#8a8a8a;font-size:13px;font-weight:600;padding:5px 0;">Company</td>
                        <td style="color:#3D3D3D;font-size:13px;padding:5px 0;">${lead.company}</td>
                      </tr>
                      <tr>
                        <td style="color:#8a8a8a;font-size:13px;font-weight:600;padding:5px 0;">Email</td>
                        <td style="color:#578E7E;font-size:13px;padding:5px 0;">${lead.email}</td>
                      </tr>
                      <tr>
                        <td style="color:#8a8a8a;font-size:13px;font-weight:600;padding:5px 0;">Phone</td>
                        <td style="color:#3D3D3D;font-size:13px;padding:5px 0;">${lead.phone}</td>
                      </tr>
                    </table>
                  </div>

                  <!-- What happens next -->
                  <h3 style="color:#3D3D3D;margin:0 0 14px;font-size:14px;font-weight:700;">What Happens Next?</h3>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    ${['Our procurement specialists review your requirements', 'We source pricing from our verified supplier network', 'You receive a detailed proposal within 1–2 business days'].map((step, i) => `
                    <tr>
                      <td style="padding:8px 0;vertical-align:top;">
                        <div style="display:inline-block;width:24px;height:24px;background:#578E7E;border-radius:50%;text-align:center;line-height:24px;color:#fff;font-size:11px;font-weight:700;margin-right:12px;">${i + 1}</div>
                        <span style="color:#5a5a5a;font-size:13px;line-height:1.6;">${step}</span>
                      </td>
                    </tr>`).join('')}
                  </table>

                  <p style="color:#8a8a8a;font-size:13px;margin:32px 0 0;line-height:1.6;">
                    Have an urgent requirement? Call us at
                    <a href="tel:+911140001000" style="color:#578E7E;font-weight:600;">+91 114 000 1000</a>
                    <br><br>
                    Best regards,<br>
                    <strong style="color:#3D3D3D;">The ProSource Procurement Team</strong>
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#f8f8f8;padding:20px 48px;border-top:1px solid #eee;">
                  <p style="color:#aaa;font-size:11px;margin:0;text-align:center;line-height:1.6;">
                    © ${new Date().getFullYear()} ProSource Enterprise. All rights reserved.<br>
                    12th Floor, Tower B, DLF Cyber City, Gurugram, Haryana – 122002
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await sendEmail({
    to: lead.email,
    subject: `✅ Enquiry Received — ProSource Enterprise`,
    html,
    label: 'CustomerConfirmation',
  });
};

// ─────────────────────────────────────────────────────────────
// Admin notification email
// ─────────────────────────────────────────────────────────────
export const sendAdminNotification = async (lead: ILead): Promise<void> => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Lead — ProSource</title>
    </head>
    <body style="margin:0;padding:0;background:#f0f0f0;font-family:Inter,-apple-system,Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f0f0;padding:40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0"
              style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">

              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg,#2d5a4e,#578E7E);padding:28px 40px;text-align:center;">
                  <h1 style="color:#ffffff;margin:0 0 4px;font-size:20px;font-weight:700;">🔔 New Lead Received</h1>
                  <p style="color:rgba(255,255,255,0.7);margin:0;font-size:12px;">
                    ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' })} IST
                  </p>
                </td>
              </tr>

              <!-- Lead Details -->
              <tr>
                <td style="padding:36px 40px;">
                  <table width="100%" cellpadding="10" cellspacing="0"
                    style="border:1px solid #F5ECD5;border-radius:8px;overflow:hidden;">
                    ${[
                      ['Name', lead.name],
                      ['Company', lead.company],
                      ['Email', `<a href="mailto:${lead.email}" style="color:#578E7E;">${lead.email}</a>`],
                      ['Phone', `<a href="tel:${lead.phone}" style="color:#578E7E;">${lead.phone}</a>`],
                    ].map(([k, v], i) => `
                    <tr style="background:${i % 2 === 0 ? '#fff' : '#fafaf8'};">
                      <td style="color:#8a8a8a;font-weight:600;font-size:12px;width:100px;text-transform:uppercase;letter-spacing:0.4px;">${k}</td>
                      <td style="color:#3D3D3D;font-size:13px;">${v}</td>
                    </tr>`).join('')}
                    <tr style="background:#FFFAEC;">
                      <td style="color:#8a8a8a;font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:0.4px;vertical-align:top;">Message</td>
                      <td style="color:#3D3D3D;font-size:13px;line-height:1.6;white-space:pre-wrap;">${lead.message}</td>
                    </tr>
                  </table>

                  <div style="margin-top:28px;text-align:center;">
                    <a href="mailto:${lead.email}?subject=Re: Your ProSource Procurement Enquiry&body=Dear ${lead.name},%0A%0AThank you for your enquiry."
                      style="display:inline-block;background:#578E7E;color:#fff;padding:13px 32px;border-radius:8px;
                             text-decoration:none;font-weight:600;font-size:14px;letter-spacing:0.3px;">
                      Reply to ${lead.name}
                    </a>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#f8f8f8;padding:16px 40px;border-top:1px solid #eee;">
                  <p style="color:#aaa;font-size:11px;margin:0;text-align:center;">
                    ProSource Enterprise Internal Notification — Do not forward
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `🔔 New Lead: ${lead.name} — ${lead.company}`,
    html,
    label: 'AdminNotification',
  });
};

export default resend;
