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
  'winmiguelazio@gmail.com'
];

// Which template to send: 'en' for English, 'pt' for Portuguese
const LANGUAGE = 'pt';

// Email subject (lowercase recommended for deliverability, automatically chooses based on language)
const SUBJECT = LANGUAGE === 'pt' ? 'Parceria Técnica: Maquetes Interativas para Apresentações de Arquitetónicas' : 'architectural visualization services';

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
  
  let html = rawHtml;

  // Insert intro message card above the Main Container
  const introText = LANGUAGE === 'pt'
    ? `<!-- Personal Message -->
                <table border="0" cellpadding="0" cellspacing="0" width="600" class="email-container"
                    style="background-color: #ffffff; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin-bottom: 20px;">
                    <tr>
                        <td class="mobile-padding" style="padding: 32px 32px; font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #1a1a1a;">
                            Olá! Sou Miguel Virgílio.<br>
                            Nós desenvolvemos uma solução de Maquetes Físico-Digitais para apresentações de alto impacto. Deixo um breve resumo visual abaixo.<br>
                            Com os melhores cumprimentos.
                        </td>
                    </tr>
                </table>`
    : `<!-- Personal Message -->
                <table border="0" cellpadding="0" cellspacing="0" width="600" class="email-container"
                    style="background-color: #ffffff; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin-bottom: 20px;">
                    <tr>
                        <td class="mobile-padding" style="padding: 32px 32px; font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #1a1a1a;">
                            Hello! I am Miguel Virgílio.<br>
                            We have developed a Physical-Digital Model solution for high-impact presentations. I leave a brief visual summary below.<br>
                            Best regards.
                        </td>
                    </tr>
                </table>`;

  html = html.replace('<!-- Main Container -->', `${introText}\n                <!-- Main Container -->`);

  // 1. Strip any <script> tags for deliverability (spam filters block emails with scripts)
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // 2. Strip large CSS animation/gallery blocks (causes low text-to-code ratio and spam flags)
  html = html.replace(/\/\* CSS Image Fade Transitions[\s\S]*?(?=\<\/style\>)/i, '');

  // 3. Strip structural "id" attributes from HTML tags to avoid "non-standard HTML elements" warnings in email clients
  html = html.replace(/\s+id="[^"]*"/gi, '');

  // 4. Boost small font sizes (9px, 10px, 11px) to a readable minimum (12px) to fix "HTML Font is bad readable"
  html = html.replace(/font-size:\s*(9|10|11)px/gi, 'font-size: 12px');

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
