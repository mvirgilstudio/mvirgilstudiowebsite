/**
 * Miguel Virgílio Formador — Configurable Cursos Email Sender via Resend
 * 
 * Usage:
 *   node send_email.js [resend_option]
 * 
 * Options:
 *   node send_email.js "resend 1"
 *   node send_email.js "resend 2"
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

// Load environment variables from root .env if present
const envPath = path.resolve(__dirname, '../../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = (match[2] || '').trim().replace(/^['"]|['"]$/g, '');
      if (!process.env[key]) process.env[key] = value;
    }
  }
}

const RESEND_KEYS = {
  '1': process.env.RESEND_API_KEY_1 || process.env.RESEND_API_KEY || '',
  '2': process.env.RESEND_API_KEY_2 || ''
};

const resendArg = process.argv.find(arg => arg.toLowerCase().includes('resend') || arg === '1' || arg === '2');
const API_KEY_CHOICE = resendArg ? (resendArg.includes('2') || resendArg === '2' ? '2' : '1') : '1';
const API_KEY = RESEND_KEYS[API_KEY_CHOICE];
const KEY_LABEL = API_KEY_CHOICE === '2' ? 'resend 2' : 'resend 1';

const FROM_NAME = 'Miguel Virgílio';
const FROM_EMAIL = 'hello@mvirgilstudio.com';
const REPLY_TO = 'mvirgilstudio@gmail.com';

const RECIPIENTS = [
  'winmiguelazio@gmail.com'
];

const LANGUAGE = 'pt';
const SUBJECT = LANGUAGE === 'pt'
  ? 'Formador profissional em IA, 3D e produção digital'
  : 'Professional training in AI, 3D and digital production';

// ═══════════════════════════════════════════
//  SEND LOGIC
// ═══════════════════════════════════════════

async function sendEmail() {
  const resend = new Resend(API_KEY);

  const templateFile = LANGUAGE === 'pt' ? 'email_pt.html' : 'email_en.html';
  const htmlPath = path.join(__dirname, templateFile);

  if (!fs.existsSync(htmlPath)) {
    console.error(`❌ Template not found: ${htmlPath}`);
    process.exit(1);
  }

  let html = fs.readFileSync(htmlPath, 'utf8');

  // Insert intro message card if not already present in the HTML template
  if (!html.includes('<!-- Personal Message -->')) {
    const introText = LANGUAGE === 'pt'
      ? `<!-- Personal Message -->
                <table border="0" cellpadding="0" cellspacing="0" width="600" class="email-container"
                    style="background-color: #1a1c1c; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.25); border: 1px solid #333333; margin-bottom: 20px;">
                    <tr>
                        <td class="mobile-padding" style="padding: 26px 30px; font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.6; color: #dedede;">
                            Olá! O meu nome é Miguel Virgílio. Sou especialista em tecnologias digitais avançadas com mais de 25 anos de experiência técnica em artes gráficas, pós-produção audiovisual (VFX), computação gráfica 3D e soluções com Inteligência Artificial. Capacito formandos através de metodologias ativas e orientadas a projetos reais, dotando a sua instituição de cursos práticos, modulares e diretamente alinhados com as exigências do mercado.
                        </td>
                    </tr>
                </table>`
      : `<!-- Personal Message -->
                <table border="0" cellpadding="0" cellspacing="0" width="600" class="email-container"
                    style="background-color: #1a1c1c; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.25); border: 1px solid #333333; margin-bottom: 20px;">
                    <tr>
                        <td class="mobile-padding" style="padding: 26px 30px; font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.6; color: #dedede;">
                            Hello! My name is Miguel Virgílio. I am a specialist in advanced digital technologies with over 25 years of technical expertise across graphic arts, VFX post-production, 3D computer graphics, and Artificial Intelligence solutions. I empower students through project-based learning and hands-on methodologies, strengthening your institution's portfolio with practical, modular courses tailored to current industry demands.
                        </td>
                    </tr>
                </table>`;

    if (html.includes('<!-- Main Container -->')) {
      html = html.replace('<!-- Main Container -->', `${introText}\n  <!-- Main Container -->`);
    } else {
      html = html.replace('<table class="wrap"', `${introText}\n<table class="wrap"`);
    }
  }

  html = html.replace(/src="assets\//g, 'src="https://mvirgilstudio.com/cursos_email/assets/');
  html = html.replace(/src="\/cursos_email\//g, 'src="https://mvirgilstudio.com/cursos_email/');
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  html = html.replace(/\s+id="[^"]*"/gi, '');
  html = html.replace(/font-size:\s*(9|10|11)px/gi, 'font-size: 12px');

  // Load PDF Attachment
  const attachmentPath = path.resolve(__dirname, '../cursos_currriculum/Miguel_Virgilio_Curriculum_Formador_2026.pdf');
  const attachments = [];
  if (fs.existsSync(attachmentPath)) {
    attachments.push({
      filename: 'Miguel_Virgilio_Curriculum_Formador_2026.pdf',
      content: fs.readFileSync(attachmentPath),
    });
  }

  console.log(`🔑 Resend API Key: ${KEY_LABEL}`);
  console.log(`📧 Sending ${LANGUAGE.toUpperCase()} email from ${FROM_NAME} <${FROM_EMAIL}>`);
  console.log(`📝 Subject: ${SUBJECT}`);
  console.log(`📎 Template: ${templateFile}`);
  if (attachments.length > 0) {
    console.log(`📎 Attachment: ${attachments[0].filename} (${(fs.statSync(attachmentPath).size / 1024).toFixed(1)} KB)`);
  }
  console.log('');

  for (let i = 0; i < RECIPIENTS.length; i++) {
    const recipient = RECIPIENTS[i];
    console.log(`📨 Sending email ${i + 1}/${RECIPIENTS.length} to: ${recipient}...`);
    let fromAddress = `${FROM_NAME} <${FROM_EMAIL}>`;
    try {
      const emailPayload = {
        from: fromAddress,
        to: [recipient],
        reply_to: REPLY_TO,
        subject: SUBJECT,
        html: html,
        attachments: attachments.length > 0 ? attachments : undefined,
      };
      let res = await resend.emails.send(emailPayload);

      if (res.error && (res.error.statusCode === 403 || res.error.message?.includes('domain is not verified') || res.error.message?.includes('from address'))) {
        console.warn(`⚠️ Custom domain unverified, retrying with onboarding@resend.dev...`);
        fromAddress = `${FROM_NAME} <onboarding@resend.dev>`;
        emailPayload.from = fromAddress;
        res = await resend.emails.send(emailPayload);
      }

      const { data, error } = res;

      if (error) {
        console.error(`❌ Failed to send to ${recipient}:`, error);
      } else {
        console.log(`✅ Email sent successfully to ${recipient}!`);
        console.log(`📋 Message ID: ${data.id}`);
      }
    } catch (err) {
      console.error(`❌ Error sending to ${recipient}:`, err.message);
    }

    if (i < RECIPIENTS.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

sendEmail();
