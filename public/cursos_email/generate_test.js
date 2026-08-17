import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templateFile = 'email_pt.html';
const htmlPath = path.join(__dirname, templateFile);

let html = fs.readFileSync(htmlPath, 'utf8');

const introText = `<!-- Personal Message -->
                <table border="0" cellpadding="0" cellspacing="0" width="600" class="email-container"
                    style="background-color: #1a1c1c; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.25); border: 1px solid #333333; margin-bottom: 20px;">
                    <tr>
                        <td class="mobile-padding" style="padding: 26px 30px; font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.6; color: #dedede;">
                            Olá! O meu nome é Miguel Virgílio. Sou especialista em tecnologias digitais avançadas com mais de 25 anos de experiência técnica em artes gráficas, pós-produção audiovisual (VFX), computação gráfica 3D e soluções com Inteligência Artificial. Capacito formandos através de metodologias ativas e orientadas a projetos reais, dotando a sua instituição de cursos práticos, modulares e diretamente alinhados com as exigências do mercado.
                        </td>
                    </tr>
                </table>`;

if (html.includes('<!-- Main Container -->')) {
  html = html.replace('<!-- Main Container -->', `${introText}\n  <!-- Main Container -->`);
} else {
  html = html.replace('<table class="wrap"', `${introText}\n<table class="wrap"`);
}

html = html.replace(/src="assets\//g, 'src="https://mvirgilstudio.com/cursos_email/assets/');
html = html.replace(/src="\/cursos_email\//g, 'src="https://mvirgilstudio.com/cursos_email/');
html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
html = html.replace(/\s+id="[^"]*"/gi, '');
html = html.replace(/font-size:\s*(9|10|11)px/gi, 'font-size: 12px');

fs.writeFileSync(path.join(__dirname, 'test_email_output.html'), html);
console.log('✅ Generated test_email_output.html');
