---
name: send-archviz-email-pt
description: Send the MVs Archviz Portuguese marketing email (email_pt.html) to a specified recipient email address via Resend API. Use when the user asks to send the archviz email, portfolio email, or marketing email to someone.
---

# Send Archviz Email

Sends the MVs Archviz HTML email template to a recipient using the Resend API.

## When to Use

Use this skill when the user asks to:
- Send the archviz email / portfolio email / marketing email to an email address
- Send `email_pt.html` or `email_en.html` to someone

## Prerequisites

- Node.js installed on the system
- The `resend` npm package is already installed in the project dependencies

## How to Execute

1. The user provides a **destination email address** (required) and optionally a **language** (`pt` or `en`, defaults to `pt`).
2. Run the `send_to.js` script from the `archviz_email2` directory, passing the email as the first argument.

### Command

```powershell
node send_to.js <RECIPIENT_EMAIL> [LANGUAGE]
```

**Working directory:** `c:\Users\corsair\Desktop\_web_page\public\archviz_email2`

### Examples

```powershell
# Send Portuguese email (default)
node send_to.js client@example.com

# Send English email
node send_to.js client@example.com en
```

## What Happens

- The script loads `email_pt.html` (or `email_en.html`) from the same directory
- Applies deliverability optimizations (strips scripts, IDs, boosts small fonts)
- Sends via Resend API from `MVs Archviz <hello@mvirgilstudio.com>`
- Replies go to `mvirgilstudio@gmail.com`

## Configuration Details

| Setting    | Value                                                                              |
|------------|------------------------------------------------------------------------------------|
| From       | MVs Archviz \<hello@mvirgilstudio.com\>                                            |
| Reply-To   | mvirgilstudio@gmail.com                                                            |
| Subject PT | Parceria Técnica: Maquetes Interativas para Apresentações de Arquitectura          |
| Subject EN | architectural visualization services                                               |

## Files Reference

| File            | Purpose                              |
|-----------------|--------------------------------------|
| `send_to.js`    | CLI sender script (use this one)     |
| `send_email.js` | Original configurable sender script  |
| `email_pt.html` | Portuguese HTML email template       |
| `email_en.html` | English HTML email template          |
