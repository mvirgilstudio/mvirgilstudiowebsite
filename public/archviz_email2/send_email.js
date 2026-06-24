/**
 * MVs Archviz — Email Sender via Resend
 * 
 * Sends full HTML emails from hello@mvirgilstudio.com
 * with images, links, and all styling intact.
 * 
 * Setup:
 *   1. npm install resend
 *   2. Replace YOUR_API_KEY below with your Resend API key
 *   3. Run: node send_email.js
 */

import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// ═══════════════════════════════════════════
//  CONFIGURATION — Edit these values
// ═══════════════════════════════════════════

const API_KEY = 're_gZJjsYD4_HNxtWSpStRadBTc445qbu6G4';  // Get from https://resend.com/api-keys

const FROM_NAME = 'MVs Archviz';
const FROM_EMAIL = 'hello@mvirgilstudio.com';  // Your verified domain email

// Where replies go (your personal Gmail)
const REPLY_TO = 'mvirgilstudio@gmail.com';

// Recipients — add as many as you need
const RECIPIENTS = [
  'ipmiguelazio@gmail.com'
];

// Which template to send: 'en' for English, 'pt' for Portuguese
const LANGUAGE = 'pt';

// Email subject (lowercase recommended for deliverability, automatically chooses based on language)
const SUBJECT = LANGUAGE === 'pt' ? 'serviços de visualização 3d' : 'architectural visualization services';

// ═══════════════════════════════════════════
//  SEND LOGIC — No need to edit below
// ═══════════════════════════════════════════

async function sendEmail() {
  const resend = new Resend(API_KEY);

  // Pick the right template
  const templateFile = LANGUAGE === 'pt' ? 'email_pt.html' : 'email_en.html';
  const htmlPath = path.join(__dirname, templateFile);

  if (!fs.existsSync(htmlPath)) {
    console.error(`❌ Template not found: ${htmlPath}`);
    process.exit(1);
  }

  const rawHtml = fs.readFileSync(htmlPath, 'utf8');
  // Strip any <script> tags for deliverability (spam filters block emails with scripts)
  const html = rawHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  console.log(`📧 Sending ${LANGUAGE.toUpperCase()} email from ${FROM_NAME} <${FROM_EMAIL}>`);
  console.log(`📨 To: ${RECIPIENTS.join(', ')}`);
  console.log(`📝 Subject: ${SUBJECT}`);
  console.log(`📎 Template: ${templateFile}`);
  console.log('');

  try {
    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: RECIPIENTS,
      reply_to: REPLY_TO,
      subject: SUBJECT,
      html: html,
    });

    if (error) {
      console.error('❌ Failed to send:', error);
      return;
    }

    console.log('✅ Email sent successfully!');
    console.log(`📋 Message ID: ${data.id}`);
    console.log('');
    console.log('💡 Check delivery status at: https://resend.com/emails');
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

sendEmail();
