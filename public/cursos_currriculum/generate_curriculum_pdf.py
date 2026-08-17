import os
import subprocess

HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <title>Miguel Virgílio - Curriculum Vitae & Catálogo Formativo para Entidades Formadoras</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 0;
    }
    
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    body {
      margin: 0;
      padding: 0;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      background-color: #f8fafc;
      font-size: 8.5pt;
      line-height: 1.4;
    }

    .page {
      width: 210mm;
      height: 297mm;
      max-height: 297mm;
      padding: 14mm 16mm 12mm 16mm;
      position: relative;
      background: #ffffff;
      page-break-after: always;
      page-break-inside: avoid;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
    }

    .page:last-child {
      page-break-after: auto;
    }

    /* Top Accent Line */
    .top-bar {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 5px;
      background: linear-gradient(90deg, #0f172a 0%, #1e293b 50%, #475569 100%);
    }

    /* Header */
    .header {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 10px;
      margin-bottom: 12px;
    }

    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .profile-photo {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #0f172a;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.15);
      flex-shrink: 0;
    }

    .brand-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 18pt;
      font-weight: 700;
      letter-spacing: 2px;
      color: #0f172a;
      text-transform: uppercase;
      margin: 0 0 2px 0;
      line-height: 1.1;
    }

    .brand-subtitle {
      font-size: 9pt;
      font-weight: 700;
      color: #334155;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin: 0;
    }

    .badge-dossier {
      background: #0f172a;
      color: #ffffff;
      font-size: 7.5pt;
      font-weight: 700;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      padding: 6px 12px;
      border-radius: 4px;
      text-align: right;
      line-height: 1.3;
    }

    .contact-grid {
      display: grid;
      grid-template-columns: 1.2fr 0.9fr 1.1fr 1.1fr;
      gap: 8px;
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid #e2e8f0;
      font-size: 7.5pt;
      color: #334155;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .contact-item svg {
      width: 12px;
      height: 12px;
      flex-shrink: 0;
      fill: #475569;
    }

    .contact-item a {
      color: #0f172a;
      text-decoration: none;
      font-weight: 600;
    }

    /* Section Styling */
    .section {
      margin-bottom: 11px;
    }

    .section-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 9pt;
      font-weight: 700;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin: 0 0 6px 0;
      padding-bottom: 3px;
      border-bottom: 1.5px solid #cbd5e1;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .section-title .tag {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 6.8pt;
      font-weight: 600;
      color: #64748b;
      text-transform: none;
      letter-spacing: 0;
    }

    /* Summary Box */
    .summary-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 3.5px solid #0f172a;
      padding: 8px 10px;
      border-radius: 0 4px 4px 0;
      margin-bottom: 10px;
      font-size: 8pt;
      line-height: 1.45;
      color: #334155;
    }

    .summary-card strong {
      color: #0f172a;
    }

    /* Pillars */
    .pillars-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin-bottom: 11px;
    }

    .pillar-box {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      padding: 7px 9px;
    }

    .pillar-box h4 {
      margin: 0 0 2px 0;
      font-size: 7.8pt;
      font-weight: 700;
      color: #0f172a;
    }

    .pillar-box p {
      margin: 0;
      font-size: 7pt;
      color: #64748b;
      line-height: 1.35;
    }

    /* Layout Columns */
    .layout-main-side {
      display: grid;
      grid-template-columns: 1.25fr 0.75fr;
      gap: 14px;
    }

    /* Timeline Items */
    .timeline-item {
      position: relative;
      padding-left: 11px;
      border-left: 2px solid #cbd5e1;
      margin-bottom: 8px;
    }

    .timeline-item::before {
      content: '';
      position: absolute;
      left: -5px;
      top: 3px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #0f172a;
    }

    .timeline-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 1px;
    }

    .role-title {
      font-size: 8.2pt;
      font-weight: 700;
      color: #0f172a;
    }

    .period-badge {
      font-size: 6.8pt;
      font-weight: 700;
      color: #334155;
      background: #e2e8f0;
      padding: 1px 5px;
      border-radius: 3px;
    }

    .company-name {
      font-size: 7.5pt;
      font-weight: 600;
      color: #475569;
      margin-bottom: 2px;
    }

    .timeline-desc {
      font-size: 7.2pt;
      color: #475569;
      line-height: 1.35;
      margin: 0;
    }

    /* Skills Badges */
    .skills-group {
      margin-bottom: 7px;
    }

    .skills-label {
      font-size: 7.2pt;
      font-weight: 700;
      color: #334155;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      margin-bottom: 3px;
      display: block;
    }

    .tags-container {
      display: flex;
      flex-wrap: wrap;
      gap: 3.5px;
    }

    .tag-pill {
      font-size: 6.8pt;
      font-weight: 600;
      background: #f1f5f9;
      color: #0f172a;
      border: 1px solid #cbd5e1;
      padding: 1.5px 5.5px;
      border-radius: 3px;
    }

    /* Pedagogy List */
    .pedagogy-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .pedagogy-item {
      display: flex;
      gap: 5px;
      font-size: 7.2pt;
      color: #334155;
      line-height: 1.3;
    }

    .pedagogy-item strong {
      color: #0f172a;
    }

    /* ==================== PAGE 2 STYLES ==================== */
    .catalog-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 10px;
    }

    .catalog-col {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .course-category {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 5px;
      overflow: hidden;
    }

    .category-header {
      background: #0f172a;
      color: #ffffff;
      font-size: 7.5pt;
      font-weight: 700;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      padding: 5px 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .category-header span.count {
      font-size: 6.5pt;
      color: #cbd5e1;
      font-weight: 500;
    }

    .category-body {
      padding: 5px 7px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .course-item {
      display: flex;
      gap: 5px;
      padding: 3.5px 0;
      border-bottom: 1px dashed #e2e8f0;
      align-items: flex-start;
    }

    .course-item:last-child {
      border-bottom: none;
    }

    .course-num {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 7pt;
      font-weight: 700;
      color: #0f172a;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      padding: 1px 4px;
      border-radius: 2px;
      line-height: 1.2;
      flex-shrink: 0;
    }

    .course-content {
      flex: 1;
    }

    .course-name {
      font-size: 7.5pt;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.2;
      margin-bottom: 1px;
    }

    .course-desc {
      font-size: 6.8pt;
      color: #64748b;
      line-height: 1.25;
    }

    /* Modalidades Box Page 2 */
    .partnership-box {
      background: #f8fafc;
      border: 1.5px solid #0f172a;
      border-radius: 5px;
      padding: 8px 10px;
      margin-bottom: 10px;
    }

    .partnership-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-top: 6px;
    }

    .partnership-col h5 {
      margin: 0 0 2px 0;
      font-size: 7.2pt;
      font-weight: 700;
      color: #0f172a;
      text-transform: uppercase;
    }

    .partnership-col p {
      margin: 0;
      font-size: 6.8pt;
      color: #475569;
      line-height: 1.3;
    }

    /* Footer */
    .page-footer {
      border-top: 1px solid #cbd5e1;
      padding-top: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 7pt;
      color: #64748b;
    }

    .footer-links a {
      color: #0f172a;
      text-decoration: none;
      font-weight: 600;
      margin-left: 6px;
    }
  </style>
</head>
<body>

  <!-- ==================== PÁGINA 1: PERFIL DO FORMADOR, EXPERIÊNCIA & METODOLOGIA ==================== -->
  <div class="page">
    <div class="top-bar"></div>

    <div>
      <!-- Header Principal -->
      <header class="header">
        <div class="header-top">
          <div style="display: flex; align-items: center; gap: 14px;">
            <img src="__PROFILE_IMG_B64__" alt="Miguel Virgílio" class="profile-photo">
            <div>
              <h1 class="brand-title">Miguel Virgílio</h1>
              <p class="brand-subtitle">Formador Profissional · IA · 3D · Tempo Real · Produção Digital</p>
            </div>
          </div>
          <div class="badge-dossier">
            Dossiê Pedagógico<br><span style="font-weight:400;opacity:0.9">Entidades de Formação</span>
          </div>
        </div>

        <div class="contact-grid">
          <div class="contact-item">
            <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            <span>Alcobaça / Leiria / Lisboa / Coimbra (Disponibilidade Nacional)</span>
          </div>
          <div class="contact-item">
            <svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
            <span><strong>(+351) 933 628 268</strong></span>
          </div>
          <div class="contact-item">
            <svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
            <a href="mailto:vfxmiguel@gmail.com">vfxmiguel@gmail.com</a>
          </div>
          <div class="contact-item">
            <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
            <a href="https://mvirgilstudio.com">mvirgilstudio.com</a>
          </div>
        </div>
      </header>

      <!-- Resumo Executivo / Posicionamento -->
      <div class="summary-card">
        <strong>Perfil Pedagógico & Proposta de Valor:</strong> Formador profissional e especialista em tecnologias digitais avançadas. Experiência técnica nos setores de artes gráficas, pós-produção audiovisual (VFX), computação gráfica 3D e desenvolvimento de soluções com Inteligência Artificial.
      </div>

      <!-- Pilares Pedagógicos -->
      <div class="pillars-grid">
        <div class="pillar-box">
          <h4>⚡ 1. Problemas Reais</h4>
          <p>Casos de estudo e desafios práticos baseados nas necessidades concretas do mercado industrial e corporativo atual.</p>
        </div>
        <div class="pillar-box">
          <h4>🔄 2. Processo Completo</h4>
          <p>Visão integrada de todo o pipeline de produção: diagnóstico, conceção, desenvolvimento, render e deployment.</p>
        </div>
        <div class="pillar-box">
          <h4>🎯 3. Aplicação Prática</h4>
          <p>Metodologia <em>Project-Based Learning</em>, permitindo aos formandos construir portfólio funcional durante a formação.</p>
        </div>
      </div>

      <!-- Layout 2 Colunas: Experiência Profissional & Competências/Habilitações -->
      <div class="layout-main-side">
        
        <!-- Coluna Esquerda: Experiência Profissional & Atividade Pedagógica -->
        <div>
          <div class="section">
            <div class="section-title">
              <span>Experiência Profissional & Pedagógica</span>
              <span class="tag">Trajetória na Indústria e Formação</span>
            </div>

            <div class="timeline-item">
              <div class="timeline-header">
                <span class="role-title">3D Developer & Designer, 3D Generalist, Vfx Freelancer</span>
                <span class="period-badge">2016 – Presente (2026)</span>
              </div>
              <div class="company-name">MVirgil Studio · 3D & Soluções Digitais</div>
              <p class="timeline-desc">
                Desenvolvimento de aplicações personalizadas com IA generativa, configuradores interativos 3D, 3D, efeitos visuais, composição vídeo e consultoria técnica para empresas e profissionais.
              </p>
            </div>

            <div class="timeline-item">
              <div class="timeline-header">
                <span class="role-title">Compositor Digital & Artista 3D / VFX</span>
                <span class="period-badge">2016 – 2024</span>
              </div>
              <div class="company-name">Íngreme – Post Production (Lisboa)</div>
              <p class="timeline-desc">
                8 anos em pós-produção audiovisual de alto nível para cinema, séries de televisão e publicidade de grandes marcas nacionais e internacionais. Composição digital avançada (Foundry Nuke), modelação/animação 3D, CGI photoreal, camera tracking e integração de efeitos visuais complexos.
              </p>
            </div>

            <div class="timeline-item">
              <div class="timeline-header">
                <span class="role-title">Formador do Curso de Multimédia</span>
                <span class="period-badge">2016</span>
              </div>
              <div class="company-name">Cencal – Centro de Formação Profissional para a Indústria Cerâmica (Caldas da Rainha)</div>
              <p class="timeline-desc">
                Planeamento e ministração do curso modular de Multimédia: animação digital, edição de vídeo, ferramentas gráficas e preparação de projetos práticos para inserção no mercado de trabalho.
              </p>
            </div>

            <div class="timeline-item">
              <div class="timeline-header">
                <span class="role-title">Formador de Artes Gráficas</span>
                <span class="period-badge">2016</span>
              </div>
              <div class="company-name">CPJ – Centro Protocolar de Formação Profissional para o Sector da Justiça</div>
              <p class="timeline-desc">
                Formação qualificante em paginação profissional, pré-impressão técnica, controlo colorimétrico e gestão de processos de artes gráficas.
              </p>
            </div>

            <div class="timeline-item" style="margin-bottom: 0;">
              <div class="timeline-header">
                <span class="role-title">Técnico de Composição Gráfica, Pré-Impressão & 3D</span>
                <span class="period-badge">1996 – 2015</span>
              </div>
              <div class="company-name">Tipografia Alcobacense, Lda. (19 anos de percurso contínuo)</div>
              <p class="timeline-desc">
                Composição gráfica avançada, imposição digital, modelação 3D para packaging, gestão técnica de sistemas de impressão offset e digital e garantia de qualidade de produção.
              </p>
            </div>

          </div>
        </div>

        <!-- Coluna Direita: Habilitações, Ferramentas & Competências Pedagógicas -->
        <div>
          
          <!-- Habilitações Académicas & Idiomas -->
          <div class="section">
            <div class="section-title">
              <span>Habilitações & Idiomas</span>
            </div>
            <div style="font-size: 7.8pt; margin-bottom: 5px;">
              <div style="font-weight: 700; color: #0f172a;">Licenciatura em Gestão de Empresas</div>
              <div style="color: #64748b; font-size: 7pt;">1996 – 2002 · Formação Superior de Base em Gestão de Empresas</div>
            </div>
            <div style="font-size: 7.2pt; color: #334155; line-height: 1.35;">
              <strong>Idiomas:</strong><br>
              • <strong>Português:</strong> Língua materna<br>
              • <strong>Inglês:</strong> Fluente / Proficiência profissional (Compreensão, Conversação e Escrita técnica)
            </div>
          </div>

          <!-- Competências Tecnológicas -->
          <div class="section">
            <div class="section-title">
              <span>Ferramentas & Tecnologias</span>
            </div>

            <div class="skills-group">
              <span class="skills-label">Inteligência Artificial & Dev</span>
              <div class="tags-container">
                <span class="tag-pill">APIs LLM / IA</span>
                <span class="tag-pill">AI Agents</span>
                <span class="tag-pill">Full-Stack Web/IA</span>
              </div>
            </div>

            <div class="skills-group">
              <span class="skills-label">3D & Tempo Real</span>
              <div class="tags-container">
                <span class="tag-pill">Unreal Engine 5</span>
                <span class="tag-pill">Blueprints</span>
                <span class="tag-pill">Maya</span>
                <span class="tag-pill">Houdini FX</span>
                <span class="tag-pill">Blender</span>
                <span class="tag-pill">3ds Max</span>
              </div>
            </div>

            <div class="skills-group">
              <span class="skills-label">VFX & Pós-Produção</span>
              <div class="tags-container">
                <span class="tag-pill">Foundry Nuke</span>
                <span class="tag-pill">After Effects</span>
                <span class="tag-pill">Premiere Pro</span>
                <span class="tag-pill">Photoshop</span>
                <span class="tag-pill">Illustrator</span>
                <span class="tag-pill">InDesign</span>
                <span class="tag-pill">DaVinci Resolve</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>

    <!-- Footer Página 1 -->
    <footer class="page-footer">
      <div>Miguel Virgílio · Dossiê de Formador Profissional (2026)</div>
      <div class="footer-links">
        Página 1 de 2 · <a href="https://mvirgilstudio.com">mvirgilstudio.com</a>
      </div>
    </footer>
  </div>

  <!-- ==================== PÁGINA 2: CATÁLOGO COMPLETO DE 14 CURSOS & MODALIDADES ==================== -->
  <div class="page">
    <div class="top-bar"></div>

    <div>
      <!-- Header Página 2 -->
      <header class="header" style="padding-bottom: 8px; margin-bottom: 10px;">
        <div class="header-top" style="align-items: center;">
          <div>
            <h2 class="brand-title" style="font-size: 12.5pt; margin: 0; display: inline-block;">Miguel Virgílio</h2>
            <span style="font-size: 8.5pt; font-weight: 600; color: #475569; letter-spacing: 0.3px; margin-left: 8px;">| Catálogo Modular de Formações para Entidades Formadoras</span>
          </div>
          <div style="font-size: 7.5pt; color: #334155; font-weight: 600; text-align: right; white-space: nowrap;">
            (+351) 933 628 268 · vfxmiguel@gmail.com
          </div>
        </div>
      </header>

      <div class="section" style="margin-bottom: 6px;">
        <div class="section-title" style="margin-bottom: 6px;">
          <span>Módulos de Formação Prática para Integração Curricular</span>
          <span class="tag">Adaptáveis a UFCDs, Cursos de Especialização Tecnológica, Bootcamps</span>
        </div>
      </div>

      <!-- Grid de 4 Categorias de Cursos (2x2) -->
      <div class="catalog-grid">
        
        <!-- Coluna 1: IA & Tempo Real -->
        <div class="catalog-col">
          
          <!-- Categoria 1: IA -->
          <div class="course-category">
            <div class="category-header">
              <span>1. Inteligência Artificial para Empresas</span>
            </div>
            <div class="category-body">
              <div class="course-item">
                <div class="course-num">01</div>
                <div class="course-content">
                  <div class="course-name">AI para Soluções Empresariais</div>
                  <div class="course-desc">Implementação estratégica de LLMs, agentes inteligentes e automação nos processos de negócio.</div>
                </div>
              </div>
              <div class="course-item">
                <div class="course-num">02</div>
                <div class="course-content">
                  <div class="course-name">Desenvolvimento de Aplicações com IA</div>
                  <div class="course-desc">Integração de APIs de IA, prototipagem ágil de software e desenvolvimento full-stack assistido por IA.</div>
                </div>
              </div>
              <div class="course-item">
                <div class="course-num">03</div>
                <div class="course-content">
                  <div class="course-name">Automação Empresarial com Inteligência Artificial</div>
                  <div class="course-desc">Workflows automatizados (Make/n8n/Python), pipelines de dados e ganhos de produtividade operacional.</div>
                </div>
              </div>
              <div class="course-item">
                <div class="course-num">04</div>
                <div class="course-content">
                  <div class="course-name">IA para Marketing Digital e Comunicação</div>
                  <div class="course-desc">Geração multimodal de conteúdo, assets visuais, copywriting avançado e campanhas orientadas a dados.</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Categoria 2: Tempo Real -->
          <div class="course-category">
            <div class="category-header">
              <span>2. Visualização 3D em Tempo Real (Unreal Engine)</span>
            </div>
            <div class="category-body">
              <div class="course-item">
                <div class="course-num">05</div>
                <div class="course-content">
                  <div class="course-name">Unreal Engine para ArchViz</div>
                  <div class="course-desc">Visualização arquitetónica fotorrealista em tempo real, iluminação global Lumen e materiais Nanite.</div>
                </div>
              </div>
              <div class="course-item">
                <div class="course-num">06</div>
                <div class="course-content">
                  <div class="course-name">Unreal Engine para Apresentação de Produto</div>
                  <div class="course-desc">Criação de showrooms virtuais interativos, iluminação cinemática de estúdio e animação técnica.</div>
                </div>
              </div>
              <div class="course-item">
                <div class="course-num">07</div>
                <div class="course-content">
                  <div class="course-name">Configuradores Interativos com Unreal Engine</div>
                  <div class="course-desc">Programação visual em Blueprints, interfaces UMG, troca de materiais em tempo real e exportação standalone/pixel streaming.</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Coluna 2: VFX & Produção 3D -->
        <div class="catalog-col">
          
          <!-- Categoria 3: VFX -->
          <div class="course-category">
            <div class="category-header">
              <span>3. Efeitos Visuais (VFX) & Produção Digital</span>
            </div>
            <div class="category-body">
              <div class="course-item">
                <div class="course-num">08</div>
                <div class="course-content">
                  <div class="course-name">Efeitos Visuais para Produção Digital</div>
                  <div class="course-desc">Pipelines de VFX para publicidade e cinema, integração de assets 3D em filmagens live-action.</div>
                </div>
              </div>
              <div class="course-item">
                <div class="course-num">09</div>
                <div class="course-content">
                  <div class="course-name">Composição Digital Avançada</div>
                  <div class="course-desc">Keying, rotoscopia, multipass CGI compositing e gestão de cor ACES (Foundry Nuke & After Effects).</div>
                </div>
              </div>
              <div class="course-item">
                <div class="course-num">10</div>
                <div class="course-content">
                  <div class="course-name">Motion Graphics</div>
                  <div class="course-desc">Animação gráfica publicitária, broadcast design, tipografia cinética e identidade visual dinâmica.</div>
                </div>
              </div>
              <div class="course-item">
                <div class="course-num">11</div>
                <div class="course-content">
                  <div class="course-name">Tracking e Matchmoving</div>
                  <div class="course-desc">Reconstrução espacial 3D de câmara, tracking planar e calibração ótica para pós-produção.</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Categoria 4: 3D Pipeline -->
          <div class="course-category">
            <div class="category-header">
              <span>4. Produção 3D & Procedural Design</span>
            </div>
            <div class="category-body">
              <div class="course-item">
                <div class="course-num">12</div>
                <div class="course-content">
                  <div class="course-name">Pipeline de Produção 3D</div>
                  <div class="course-desc">Fluxo profissional de modelação orgânica e hard-surface, UV unwrapping, texturização PBR e shading.</div>
                </div>
              </div>
              <div class="course-item">
                <div class="course-num">13</div>
                <div class="course-content">
                  <div class="course-name">Procedural Design com Houdini</div>
                  <div class="course-desc">Modelação paramétrica baseada em nós de geometria, geração algorítmica e preparação de dados 3D.</div>
                </div>
              </div>
              <div class="course-item">
                <div class="course-num">14</div>
                <div class="course-content">
                  <div class="course-name">Visualização de Produto & Packshots 3D</div>
                  <div class="course-desc">Iluminação de produto em estúdio digital, texturas photoreal e renders de alta resolução para catálogos comerciais.</div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      <!-- Bloco de Modalidades & Condições de Parceria Pedagógica -->
      <div class="partnership-box">
        <div style="font-family:'Space Grotesk',sans-serif;font-size:8pt;font-weight:700;color:#0f172a;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #cbd5e1;padding-bottom:3px;">
          Modalidades de Colaboração & Integração Pedagógica
        </div>
        <div class="partnership-grid">
          <div class="partnership-col">
            <h5>Formatos Flexíveis</h5>
            <p>Formação <strong>Presencial</strong>, em regime <strong>B-Learning</strong> ou <strong>E-Learning síncrono</strong> com turmas dedicadas.</p>
          </div>
          <div class="partnership-col">
            <h5>Materiais Didáticos</h5>
            <p>Disponibilização de <strong>manuais, guiões práticos, ficheiros de projeto</strong> e acompanhamento técnico contínuo.</p>
          </div>
          <div class="partnership-col">
            <h5>Adaptação à Entidade</h5>
            <p>Adequação total dos conteúdos ao <strong>público-alvo, nível de entrada</strong> e objetivos estratégicos da escola.</p>
          </div>
        </div>
      </div>

      <!-- Banner de Contacto / Reunião -->
      <div style="background:#0f172a;color:#ffffff;border-radius:5px;padding:8px 12px;display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div style="font-family:'Space Grotesk',sans-serif;font-size:8.5pt;font-weight:700;letter-spacing:0.5px;">Vamos enriquecer a oferta formativa da sua instituição?</div>
          <div style="font-size:7pt;color:#94a3b8;margin-top:1px;">Agende uma reunião técnica ou solicite a proposta pedagógica detalhada para a sua entidade.</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:7.5pt;font-weight:700;color:#ffffff;">vfxmiguel@gmail.com</div>
          <div style="font-size:7.2pt;color:#cbd5e1;">(+351) 933 628 268 · mvirgilstudio.com</div>
        </div>
      </div>

    </div>

    <!-- Footer Página 2 -->
    <footer class="page-footer">
      <div>Miguel Virgílio · Formador Profissional em IA, 3D e Produção Digital · &copy; 2026</div>
      <div class="footer-links">
        Página 2 de 2 · <a href="https://mvirgilstudio.com">mvirgilstudio.com</a>
      </div>
    </footer>
  </div>

</body>
</html>
"""

def generate_pdf():
    import base64
    script_dir = os.path.dirname(os.path.abspath(__file__))
    html_path = os.path.join(script_dir, "curriculum_formador_centros.html")
    pdf_path = os.path.join(script_dir, "Miguel_Virgilio_Curriculum_Formador_2026.pdf")
    img_path = os.path.join(script_dir, "mvs_profile.png")
    
    img_b64 = ""
    if os.path.exists(img_path):
        with open(img_path, "rb") as img_f:
            img_b64 = "data:image/png;base64," + base64.b64encode(img_f.read()).decode("utf-8")
    
    rendered_html = HTML_TEMPLATE.replace("__PROFILE_IMG_B64__", img_b64)
    
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(rendered_html)
    print(f"HTML saved to {html_path}")

    chrome = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    cmd = [
        chrome,
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        f"--print-to-pdf={pdf_path}",
        "--no-pdf-header-footer",
        html_path
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    print("Chrome exit code:", res.returncode)
    if os.path.exists(pdf_path):
        print(f"PDF generated successfully: {pdf_path} ({os.path.getsize(pdf_path)} bytes)")
    else:
        print("Error: PDF was not generated. Stderr:", res.stderr)

if __name__ == "__main__":
    generate_pdf()
