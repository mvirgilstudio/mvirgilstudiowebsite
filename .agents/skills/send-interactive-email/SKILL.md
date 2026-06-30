---
name: send-interactive-email
description: Send the MVs Interactive Portuguese or English marketing email (email_pt.html or email_en.html) to a specified recipient email address via Resend API. Use when the user asks to send the interactive email, creative coding email, or interactive design email to someone.
---

# Send Interactive Email

Sends the MVs Interactive HTML email template to a recipient using the Resend API.

## When to Use

Use this skill when the user asks to:
- Send the interactive email / creative coding email / interactive design email to an email address
- Send the interactive portfolio / `email_pt.html` / `email_en.html` from `interactive_email` directory to someone

## Prerequisites

- Node.js installed on the system
- The `resend` npm package is already installed in the project dependencies

## How to Execute

1. The user provides a **destination email address** (required) and optionally a **language** (`pt` or `en`, defaults to `pt`).
2. Run the `send_to.js` script from the `interactive_email` directory, passing the email as the first argument.

### Command

```powershell
node send_to.js <RECIPIENT_EMAIL> [LANGUAGE]
```

**Working directory:** `c:\Users\corsair\Desktop\_web_page\public\interactive_email`

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
- Sends via Resend API from `MVs Interactive <hello@mvirgilstudio.com>`
- Replies go to `mvirgilstudio@gmail.com`

## Configuration Details

| Setting    | Value                                                                              |
|------------|------------------------------------------------------------------------------------|
| From       | MVs Interactive \<hello@mvirgilstudio.com\>                                        |
| Reply-To   | mvirgilstudio@gmail.com                                                            |
| Subject PT | Design Interativo: Sistemas 3D & Experiências de IA                                |
| Subject EN | Interactive Design: 3D Systems & AI Experiences                                    |

## Files Reference

| File            | Purpose                              |
|-----------------|--------------------------------------|
| `send_to.js`    | CLI sender script (use this one)     |
| `send_email.js` | Original configurable sender script  |
| `email_pt.html` | Portuguese HTML email template       |
| `email_en.html` | English HTML email template          |
