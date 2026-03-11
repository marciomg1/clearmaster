document.addEventListener('DOMContentLoaded', function () {

  // ============ MENU MOBILE ============
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // ============ HEADER SCROLL ============
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.background = window.scrollY > 60
        ? 'rgba(10,15,30,0.97)'
        : 'rgba(10,15,30,0.88)';
    });
  }

  // ============ NAV LINK ATIVO ============
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.getAttribute('id');
    });
    navLinks.forEach(l => {
      l.classList.remove('active');
      if (l.getAttribute('href') === '#' + current) l.classList.add('active');
    });
  });

  // ============ FAQ ACCORDION ============
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const answer = question.nextElementSibling;
      const isActive = question.classList.contains('active');
      document.querySelectorAll('.faq-question').forEach(q => {
        q.classList.remove('active');
        q.nextElementSibling.classList.remove('active');
      });
      if (!isActive) {
        question.classList.add('active');
        answer.classList.add('active');
      }
    });
  });

  // ============ LIGHTBOX GALERIA ============
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const galleryItems = document.querySelectorAll('.gallery-item');
  let currentIndex = 0;

  const galleryData = [];
  galleryItems.forEach((item, i) => {
    const img = item.querySelector('img');
    const title = item.querySelector('.gallery-overlay h3');
    const desc = item.querySelector('.gallery-overlay p');
    galleryData.push({
      src: img ? img.src : '',
      caption: (title ? title.textContent : '') + (desc ? ' — ' + desc.textContent : '')
    });
    item.addEventListener('click', () => openLightbox(i));
  });

  function openLightbox(index) {
    if (!lightbox) return;
    currentIndex = index;
    lightboxImg.src = galleryData[index].src;
    lightboxCaption.textContent = galleryData[index].caption;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (lightbox) {
    document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

    document.getElementById('lightbox-prev').addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
      lightboxImg.src = galleryData[currentIndex].src;
      lightboxCaption.textContent = galleryData[currentIndex].caption;
    });
    document.getElementById('lightbox-next').addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % galleryData.length;
      lightboxImg.src = galleryData[currentIndex].src;
      lightboxCaption.textContent = galleryData[currentIndex].caption;
    });

    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') document.getElementById('lightbox-prev').click();
      if (e.key === 'ArrowRight') document.getElementById('lightbox-next').click();
    });
  }

  // ============ CONTADOR HERO STATS ============
  function animateHeroStats() {
    const heroStats = document.querySelectorAll('.hero-stat-number[data-target]');
    heroStats.forEach(el => {
      const target = parseInt(el.dataset.target);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      let start = 0;

      // ⬇️ VELOCIDADE DOS MILHARES (5.000)
      const durationMilhares = 2500;
      const intervalMilhares = 16;

      // ⬇️ VELOCIDADE DOS ANOS (10)
      const durationAnos = 3000;
      const intervalAnos = 200;

      // ⬇️ VELOCIDADE DA PORCENTAGEM (100%)
      const durationPorcentagem = 2500;
      const intervalPorcentagem = 60;

      let duration, interval;
      if (suffix.includes('anos')) {
        duration = durationAnos;
        interval = intervalAnos;
      } else if (suffix.includes('%')) {
        duration = durationPorcentagem;
        interval = intervalPorcentagem;
      } else {
        duration = durationMilhares;
        interval = intervalMilhares;
      }

      const step = Math.max(1, Math.ceil(target / (duration / interval)));
      const timer = setInterval(() => {
        start += step;
        if (start >= target) {
          start = target;
          clearInterval(timer);
        }
        const formatted = target >= 1000
          ? start.toLocaleString('pt-BR')
          : start;
        el.textContent = prefix + formatted + suffix;
      }, interval);
    });
  }

  // Dispara quando o hero fica visível
  const heroStatsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateHeroStats();
        heroStatsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) heroStatsObserver.observe(heroStats);


  function animateCounter(el, target, suffix) {
    let start = 0;
    const duration = 1800;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { start = target; clearInterval(timer); }
      el.textContent = start.toLocaleString('pt-BR') + suffix;
    }, 16);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counters = entry.target.querySelectorAll('.stat-number[data-target]');
        counters.forEach(counter => {
          const target = parseInt(counter.dataset.target);
          const suffix = counter.dataset.suffix || '';
          animateCounter(counter, target, suffix);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const statsGrid = document.querySelector('.stats-grid');
  if (statsGrid) statsObserver.observe(statsGrid);

  // ============ FORMULÁRIO → WHATSAPP ============
  const form = document.getElementById('contato-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const nome = document.getElementById('nome');
      const telefone = document.getElementById('telefone');
      const email = document.getElementById('email');
      const servico = document.getElementById('servico');
      const mensagem = document.getElementById('mensagem');
      let valid = true;

      [nome, telefone, email, mensagem].forEach(field => removeError(field));

      if (!nome.value.trim()) { showError(nome, 'Informe seu nome'); valid = false; }
      if (!telefone.value.trim()) { showError(telefone, 'Informe seu telefone'); valid = false; }
      if (!email.value.trim()) {
        showError(email, 'Informe seu e-mail'); valid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        showError(email, 'E-mail inválido'); valid = false;
      }
      if (!mensagem.value.trim()) { showError(mensagem, 'Escreva sua mensagem'); valid = false; }

      if (valid) {
        const servicoTexto = servico.options[servico.selectedIndex].text;
        const msg =
          `Olá! Vim pelo site da ClearMaster 👋\n\n` +
          `*Nome:* ${nome.value.trim()}\n` +
          `*Telefone:* ${telefone.value.trim()}\n` +
          `*E-mail:* ${email.value.trim()}\n` +
          `*Serviço:* ${servicoTexto !== 'Selecione o serviço' ? servicoTexto : 'Não informado'}\n` +
          `*Mensagem:* ${mensagem.value.trim()}`;

        const encoded = encodeURIComponent(msg);
        window.open(`https://wa.me/5535992469549?text=${encoded}`, '_blank');

        const successDiv = document.createElement('div');
        successDiv.style.cssText = 'background:rgba(37,211,102,0.1);border:1px solid rgba(37,211,102,0.3);color:#4ade80;padding:16px 20px;border-radius:10px;text-align:center;font-family:Syne,sans-serif;font-weight:600;margin-top:12px;';
        successDiv.innerHTML = '<i class="fab fa-whatsapp" style="margin-right:8px"></i>Redirecionando para o WhatsApp!';
        form.appendChild(successDiv);
        setTimeout(() => successDiv.remove(), 5000);
        form.reset();
      }
    });
  }

  function showError(input, msg) {
    const group = input.parentElement;
    removeError(input);
    const err = document.createElement('span');
    err.className = 'field-error';
    err.style.cssText = 'color:#f87171;font-size:0.8rem;margin-top:4px;display:block;';
    err.textContent = msg;
    group.appendChild(err);
    input.style.borderColor = '#f87171';
  }

  function removeError(input) {
    const group = input.parentElement;
    const err = group.querySelector('.field-error');
    if (err) err.remove();
    input.style.borderColor = '';
  }

  // ============ ANIMAÇÃO SCROLL ============
  const animateObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('animated'), i * 80);
        animateObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-on-scroll').forEach(el => animateObserver.observe(el));

  // ============ SCROLL SUAVE ============
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = document.querySelector('.header').offsetHeight;
        const extra = this.getAttribute('href') === '#orcamento' ? 40 : 0;
        window.scrollTo({ top: target.offsetTop - offset - extra, behavior: 'smooth' });
      }
    });
  });

});

  // ============ CALCULADORA DE ORÇAMENTO ============
  const precos = {
    sofa: [
      { label: 'Sofá 2 e 3 lugares', preco: 180 },
      { label: 'Sofá 2 e 3 lugares com almofada solta', preco: 210 },
      { label: 'Sofá retrátil até 2,30m (sem almofadas)', preco: 170 },
      { label: 'Sofá retrátil até 2,80m (sem almofadas)', preco: 190 },
    ],
    colchao: [
      { label: 'Colchão Solteiro', preco: 110 },
      { label: 'Colchão Casal', preco: 180 },
      { label: 'Colchão Queen', preco: 195 },
      { label: 'Colchão King', preco: 210 },
    ],
    impermeabilizacao: []
  };

  let calcServico = null;
  let calcModelo = null;
  let calcCidade = '';
  let calcTaxa = 0;

  window.escolherCidade = function(cidade, taxa) {
    calcCidade = cidade;
    calcTaxa = taxa;
    document.querySelectorAll('#passo3-cidades .calc-opcao').forEach(o => o.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    setTimeout(() => mostrarResultado(), 300);
  };

  window.escolherServico = function(servico) {
    calcServico = servico;
    const passo2 = document.getElementById('passo2-opcoes');
    const titulo = document.getElementById('passo2-titulo');

    if (servico === 'impermeabilizacao') {
      irParaPasso('passo-resultado');
      mostrarAvaliacaoImpermeabilizacao();
      return;
    }

    titulo.textContent = servico === 'sofa' ? 'Qual o modelo do sofá?' : 'Qual o tamanho do colchão?';
    passo2.innerHTML = '';
    precos[servico].forEach((item, i) => {
      const div = document.createElement('div');
      div.className = 'calc-opcao';
      div.innerHTML = `<i class="fas fa-${servico === 'sofa' ? 'couch' : 'bed'}"></i><span>${item.label}</span>`;
      div.onclick = () => escolherModelo(i, div);
      passo2.appendChild(div);
    });

    // Outros modelos
    const outro = document.createElement('div');
    outro.className = 'calc-opcao';
    outro.innerHTML = `<i class="fas fa-question-circle"></i><span>Outros modelos</span>`;
    outro.onclick = () => escolherModelo(-1, outro);
    passo2.appendChild(outro);

    irParaPasso('passo-2');
  };

  window.escolherModelo = function(index, el) {
    document.querySelectorAll('#passo2-opcoes .calc-opcao').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
    calcModelo = index;
    irParaPasso('passo-3');
  };

  window.mostrarResultado = function() {
    const content = document.getElementById('calc-resultado-content');

    // Cidade: consultar WhatsApp
    if (calcTaxa === -1) {
      const nomeServico0 = calcServico === 'sofa' ? 'Sofá' : 'Colchão';
      const nomeModelo0 = calcModelo === -1 ? 'Outros modelos (foto a enviar)' : precos[calcServico][calcModelo].label;
      const msgWpp0 = `Olá ClearMaster! 👋\n\nGostaria de um orçamento para:\n*Serviço:* Higienização de ${nomeServico0}\n*Modelo:* ${nomeModelo0}\n*Cidade:* ${calcCidade}\n\nPoderia me informar o valor do deslocamento?`;
      content.innerHTML = `
        <div class="calc-resultado-avaliacao">
          <i class="fas fa-map-marker-alt"></i>
          <p><strong style="color:var(--texto-branco)">Cidade não listada</strong><br><br>
          Para cidades fora da nossa área padrão, o valor do deslocamento é calculado individualmente. Fale conosco pelo WhatsApp!</p>
        </div>
        <a href="https://wa.me/5535992469549?text=${encodeURIComponent(msgWpp0)}" target="_blank" class="btn btn-whatsapp">
          <i class="fab fa-whatsapp"></i> Consultar pelo WhatsApp
        </a>
      `;
      irParaPasso('passo-resultado');
      return;
    }

    // Outros modelos
    if (calcModelo === -1) {
      const nomeServico1 = calcServico === 'sofa' ? 'Sofá' : 'Colchão';
      const msgWpp1 = `Olá ClearMaster! 👋\n\nGostaria de um orçamento para higienização de ${nomeServico1}.\n*Cidade:* ${calcCidade}\n\nMeu modelo não estava na lista, vou enviar uma foto para avaliação!`;
      content.innerHTML = `
        <div class="calc-resultado-avaliacao">
          <i class="fas fa-camera"></i>
          <p><strong style="color:var(--texto-branco)">Modelo não listado</strong><br><br>
          Para modelos fora do padrão, o orçamento é feito por foto. Envie uma foto do seu ${nomeServico1.toLowerCase()} pelo WhatsApp e passamos o valor rapidinho!</p>
        </div>
        <a href="https://wa.me/5535992469549?text=${encodeURIComponent(msgWpp1)}" target="_blank" class="btn btn-whatsapp">
          <i class="fab fa-whatsapp"></i> Enviar foto pelo WhatsApp
        </a>
      `;
      irParaPasso('passo-resultado');
      return;
    }

    const item = precos[calcServico][calcModelo];
    const preco = item.preco;
    const totalEstimado = calcTaxa > 0 ? preco + calcTaxa : preco;
    const nomeServico = calcServico === 'sofa' ? 'Sofá' : 'Colchão';

    const msgWpp =
      `Olá ClearMaster! 👋\n\n` +
      `Fiz o orçamento pelo site e gostaria de confirmar:\n\n` +
      `*Serviço:* Higienização de ${nomeServico}\n` +
      `*Modelo:* ${item.label}\n` +
      `*Valor do serviço:* R$ ${preco},00\n` +
      `*Cidade:* ${calcCidade}\n` +
      (calcTaxa > 0 ? `*Deslocamento:* R$ ${calcTaxa},00\n*Total estimado:* R$ ${totalEstimado},00\n` : `*Deslocamento:* Sem taxa\n`) +
      `\nPoderia confirmar o agendamento?`;

    content.innerHTML = `
      <div class="calc-resultado-servico">Higienização de ${nomeServico}</div>
      <div class="calc-resultado-preco">R$ ${preco},00</div>
      <div class="calc-resultado-detalhe">${item.label}</div>
      <div class="calc-resultado-detalhe">📍 ${calcCidade}</div>
      ${calcTaxa > 0
        ? `<div class="calc-resultado-taxa"><i class="fas fa-car"></i> + R$ ${calcTaxa},00 deslocamento → Total estimado: R$ ${totalEstimado},00</div>`
        : `<div class="calc-resultado-taxa" style="color:#4ade80;border-color:rgba(74,222,128,0.3);background:rgba(74,222,128,0.07)"><i class="fas fa-check"></i> Sem taxa de deslocamento</div>`
      }
      <p style="font-size:0.82rem;color:var(--texto-muted);margin:0 0 16px;">⚠️ Valor estimado. O preço final será confirmado pelo WhatsApp.</p>
      <a href="https://wa.me/5535992469549?text=${encodeURIComponent(msgWpp)}" target="_blank" class="btn btn-whatsapp">
        <i class="fab fa-whatsapp"></i> Confirmar pelo WhatsApp
      </a>
    `;
    irParaPasso('passo-resultado');
  };

  function mostrarAvaliacaoImpermeabilizacao() {
    const msgWpp = `Olá ClearMaster! 👋\n\nGostaria de um orçamento para *impermeabilização*.\nVou enviar uma foto para avaliação!`;
    const content = document.getElementById('calc-resultado-content');
    content.innerHTML = `
      <div class="calc-resultado-avaliacao">
        <i class="fas fa-camera"></i>
        <p><strong style="color:var(--texto-branco)">Impermeabilização precisa de avaliação por foto</strong><br><br>
        O valor varia conforme o tipo de tecido e tamanho do estofado. Envie uma foto pelo WhatsApp e te passamos o orçamento rapidinho!</p>
      </div>
      <a href="https://wa.me/5535992469549?text=${encodeURIComponent(msgWpp)}" target="_blank" class="btn btn-whatsapp">
        <i class="fab fa-whatsapp"></i> Enviar foto pelo WhatsApp
      </a>
    `;
  }

  function irParaPasso(id) {
    document.querySelectorAll('#orcamento .calc-step').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }

  window.voltarPasso = function(num) {
    irParaPasso('passo-' + num);
  };

  window.reiniciarCalc = function() {
    calcServico = null; calcModelo = null; calcCidade = ''; calcTaxa = 0;
    document.querySelectorAll('#orcamento .calc-opcao').forEach(o => o.classList.remove('selected'));
    irParaPasso('passo-1');
  };


  // ============ CALCULADORA NO CONTATO ============
  let cServico = null, cModelo = null, cCidade = '', cTaxa = 0;

  window.cIrPasso = function(id) {
    document.querySelectorAll('#contato .calc-step').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  };

  window.cEscolherServico = function(servico) {
    cServico = servico;
    if (servico === 'impermeabilizacao') {
      document.getElementById('c-foto-titulo').textContent = 'Impermeabilização — informe sua cidade e envie uma foto';
      document.getElementById('c-foto-upload-area').style.display = 'none';
      document.querySelectorAll('#c-foto-cidades .calc-opcao').forEach(o => o.classList.remove('selected'));
      cIrPasso('c-passo-foto');
      return;
    }
    const titulo = document.getElementById('c-passo2-titulo');
    const opcoes = document.getElementById('c-passo2-opcoes');
    titulo.textContent = servico === 'sofa' ? 'Qual o modelo do sofá?' : 'Qual o tamanho do colchão?';
    opcoes.innerHTML = '';
    precos[servico].forEach((item, i) => {
      const div = document.createElement('div');
      div.className = 'calc-opcao';
      div.innerHTML = `<i class="fas fa-${servico === 'sofa' ? 'couch' : 'bed'}"></i><span>${item.label}</span>`;
      div.onclick = () => { cModelo = i; cIrPasso('c-passo-3'); };
      opcoes.appendChild(div);
    });
    // Outros modelos
    const outro = document.createElement('div');
    outro.className = 'calc-opcao';
    outro.innerHTML = `<i class="fas fa-question-circle"></i><span>Outros modelos</span>`;
    outro.onclick = () => {
      cModelo = -1;
      document.getElementById('c-foto-titulo').textContent = 'Outros modelos — informe sua cidade e envie uma foto';
      document.getElementById('c-foto-upload-area').style.display = 'none';
      document.querySelectorAll('#c-foto-cidades .calc-opcao').forEach(o => o.classList.remove('selected'));
      cIrPasso('c-passo-foto');
    };
    opcoes.appendChild(outro);
    cIrPasso('c-passo-2');
  };

  window.cEscolherCidade = function(cidade, taxa, el) {
    cCidade = cidade; cTaxa = taxa;
    document.querySelectorAll('#c-passo3-cidades .calc-opcao').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
    setTimeout(() => cMostrarResultado(), 300);
  };

  function cMostrarResultado() {
    const content = document.getElementById('c-resultado-content');

    if (cTaxa === -1) {
      const msgWpp = `Olá ClearMaster! 👋\n\nGostaria de um orçamento:\n*Serviço:* Higienização de ${cServico === 'sofa' ? 'Sofá' : 'Colchão'}\n*Modelo:* ${precos[cServico][cModelo].label}\n*Cidade:* ${cCidade}\n\nPoderia me informar o valor do deslocamento?`;
      content.innerHTML = `
        <div class="calc-resultado-avaliacao">
          <i class="fas fa-map-marker-alt"></i>
          <p><strong style="color:var(--texto-branco)">Cidade não listada</strong><br><br>
          Para sua cidade o valor do deslocamento é calculado individualmente. Fale conosco!</p>
        </div>
        <a href="https://wa.me/5535992469549?text=${encodeURIComponent(msgWpp)}" target="_blank" class="btn btn-whatsapp" style="width:100%;justify-content:center;">
          <i class="fab fa-whatsapp"></i> Consultar pelo WhatsApp
        </a>`;
      cIrPasso('c-passo-resultado');
      return;
    }

    const item = precos[cServico][cModelo];
    const preco = item.preco;
    const total = cTaxa > 0 ? preco + cTaxa : preco;
    const msgWpp =
      `Olá ClearMaster! 👋\n\nFiz o orçamento pelo site:\n\n` +
      `*Serviço:* Higienização de ${cServico === 'sofa' ? 'Sofá' : 'Colchão'}\n` +
      `*Modelo:* ${item.label}\n*Valor:* R$ ${preco},00\n*Cidade:* ${cCidade}\n` +
      (cTaxa > 0 ? `*Deslocamento:* R$ ${cTaxa},00\n*Total estimado:* R$ ${total},00\n` : `*Deslocamento:* Sem taxa\n`) +
      `\nPoderia confirmar o agendamento?`;

    content.innerHTML = `
      <div class="calc-resultado-servico">Higienização de ${cServico === 'sofa' ? 'Sofá' : 'Colchão'}</div>
      <div class="calc-resultado-preco">R$ ${preco},00</div>
      <div class="calc-resultado-detalhe">${item.label}</div>
      <div class="calc-resultado-detalhe">📍 ${cCidade}</div>
      ${cTaxa > 0
        ? `<div class="calc-resultado-taxa"><i class="fas fa-car"></i> + R$ ${cTaxa},00 deslocamento → Total: R$ ${total},00</div>`
        : `<div class="calc-resultado-taxa" style="color:#4ade80;border-color:rgba(74,222,128,0.3);background:rgba(74,222,128,0.07)"><i class="fas fa-check"></i> Sem taxa de deslocamento</div>`
      }
      <p style="font-size:0.82rem;color:var(--texto-muted);margin:0 0 16px;">⚠️ Valor estimado. Confirme pelo WhatsApp.</p>
      <a href="https://wa.me/5535992469549?text=${encodeURIComponent(msgWpp)}" target="_blank" class="btn btn-whatsapp" style="width:100%;justify-content:center;">
        <i class="fab fa-whatsapp"></i> Confirmar pelo WhatsApp
      </a>`;
    cIrPasso('c-passo-resultado');
  }

  window.cSelecionarCidadeFoto = function(cidade, taxa, el) {
    cCidade = cidade; cTaxa = taxa;
    document.querySelectorAll('#c-foto-cidades .calc-opcao').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
    document.getElementById('c-foto-upload-area').style.display = 'block';
  };

  window.cFotoSelecionada = function(input) {
    const nome = input.files[0] ? input.files[0].name : 'Clique para escolher uma foto';
    document.getElementById('c-foto-nome').textContent = nome;
  };

  window.cEnviarFotoWhatsApp = function() {
    const nomeServico = cServico === 'impermeabilizacao' ? 'Impermeabilização' : `Higienização de ${cServico === 'sofa' ? 'Sofá' : 'Colchão'} (modelo não listado)`;
    const taxaInfo = cTaxa === -1 ? 'Outra cidade (consultar deslocamento)' : cTaxa === 0 ? 'Sem taxa de deslocamento' : `Deslocamento: R$ ${cTaxa},00`;
    const msg = `Olá ClearMaster! 👋\n\nGostaria de um orçamento para:\n*Serviço:* ${nomeServico}\n*Cidade:* ${cCidade}\n*${taxaInfo}*\n\nVou enviar uma foto para avaliação!`;
    const input = document.getElementById('c-input-foto');

    if (input.files[0]) {
      // Abre WhatsApp e instrui a anexar a foto
      const wppUrl = `https://wa.me/5535992469549?text=${encodeURIComponent(msg + '\n\n📎 *Foto em anexo*')}`;
      window.open(wppUrl, '_blank');
      // Tenta compartilhar a foto via Web Share API (funciona no celular)
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [input.files[0]] })) {
        navigator.share({ files: [input.files[0]], title: 'Foto para orçamento ClearMaster' });
      }
    } else {
      const wppUrl = `https://wa.me/5535992469549?text=${encodeURIComponent(msg)}`;
      window.open(wppUrl, '_blank');
    }
  };

  window.cReiniciar = function() {
    cServico = null; cModelo = null; cCidade = ''; cTaxa = 0;
    document.querySelectorAll('#contato .calc-opcao').forEach(o => o.classList.remove('selected'));
    cIrPasso('c-passo-1');
  };


  // ============ AVALIAÇÕES GOOGLE — CARROSSEL ============
  (function() {
    const reviews = [
      {
        author: 'Elaine Maria',
        foto: 'https://lh3.googleusercontent.com/a-/ALV-UjUVXwgtYpMH7cAlYIj0pqfRzSLaTcOWuXAa_UzSXh1e9uTLTXAJ=s128-c0x00000000-cc-rp-mo',
        texto: 'Minha experiência com essa empresa sempre ótima. Os serviços prestados são de ótima qualidade, profissionais responsáveis e o valor cobrado é um valor justo. Recomendo!',
        nota: 5
      },
      {
        author: 'Gisele de Medeiros Melo',
        foto: 'https://lh3.googleusercontent.com/a-/ALV-UjWW5TR8fXqPRnPlwWnRWa9JdJ3qVwzYALBhQ-QhvRKxtj-UOziU=s128-c0x00000000-cc-rp-mo-ba3',
        texto: 'Fui muito bem atendida!!! Meu sofá ficou como novo 😀.',
        nota: 5
      },
      {
        author: 'Strawberry',
        foto: 'https://lh3.googleusercontent.com/a-/ALV-UjV-pWewvzk-qoMdORXSpBTn2mGUKeS4enysYiD11MDeHglcCyYb=s128-c0x00000000-cc-rp-mo',
        texto: 'Atendimento incrível, além de oferecer ótimos serviços. Recomendo!',
        nota: 5
      },
      {
        author: 'Eu Ela e o Douglas',
        foto: 'https://lh3.googleusercontent.com/a-/ALV-UjVpypCM0jCBJV-qq6b771Na1IUXHXHlQ7JSwVzokD_Y-zO9mRg=s128-c0x00000000-cc-rp-mo',
        texto: 'Show! Equipe especializada. Fomos muito bem atendidos. Serviço de primeira!',
        nota: 5
      },
      {
        author: 'Ilydio Araújo Júnior',
        foto: 'https://lh3.googleusercontent.com/a/ACg8ocKMDcsqhzK7Gw001JNFScRpP6DaVM4w158Rlou-xs5pJ1oWUQ=s128-c0x00000000-cc-rp-mo',
        texto: 'Solicitei uma limpeza e higienização em um jogo de sofá ficou perfeito, recomendo 100%',
        nota: 5
      },
      {
        author: 'Ana Paula',
        foto: null,
        texto: 'Fiquei impressionada com o resultado da higienização do meu sofá. Parecia que eu tinha comprado um novo! A impermeabilização realmente funciona — meu filho derramou suco e foi só limpar com um pano, sem manchas.',
        nota: 5
      },
      {
        author: 'Carlos Eduardo',
        foto: null,
        texto: 'Meu colchão tinha manchas antigas que eu achava que não sairiam mais. A equipe da ClearMaster fez um trabalho incrível. Agora durmo muito melhor, principalmente porque tenho rinite alérgica.',
        nota: 5
      },
      {
        author: 'Mariana Silva',
        foto: null,
        texto: 'Contratei a impermeabilização para o sofá da sala. Depois de alguns meses, posso dizer que valeu cada centavo! As crianças já derramaram refrigerante várias vezes e nunca manchou. Recomendo demais!',
        nota: 5
      }
    ];

    document.getElementById('google-nota').textContent = '4.9 ⭐ (23 avaliações)';

    function cardHTML(r) {
      const stars = '★'.repeat(r.nota) + '☆'.repeat(5 - r.nota);
      const foto = r.foto
        ? `<img src="${r.foto}" alt="${r.author}" style="width:44px;height:44px;border-radius:50%;object-fit:cover;">`
        : `<div class="depoimento-avatar">${r.author[0].toUpperCase()}</div>`;
      return `
        <div class="depoimento-card">
          <span class="quote-icon">"</span>
          <p class="depoimento-texto">${r.texto}</p>
          <div class="depoimento-autor">
            ${foto}
            <div class="depoimento-autor-info">
              <h4>${r.author}</h4>
              <div class="estrelas" style="color:var(--dourado)">${stars}</div>
            </div>
          </div>
        </div>`;
    }

    // Monta carrossel
    const track = document.getElementById('google-reviews-track');
    track.style.cssText = 'display:flex; gap:24px; transition: transform 0.7s cubic-bezier(.4,0,.2,1); will-change: transform;';

    const wrapper = track.parentElement;
    wrapper.style.cssText = 'overflow:hidden; position:relative;';

    track.innerHTML = reviews.map(cardHTML).join('');

    // Dots de navegação
    const dotsWrap = document.createElement('div');
    dotsWrap.style.cssText = 'display:flex;justify-content:center;gap:8px;margin-top:20px;';
    wrapper.parentElement.insertBefore(dotsWrap, wrapper.nextSibling);

    let atual = 0;
    let visiveis = window.innerWidth < 768 ? 1 : window.innerWidth < 1100 ? 2 : 3;
    const total = reviews.length;
    const maxIndex = total - visiveis;

    function atualizarDots() {
      dotsWrap.innerHTML = '';
      for (let i = 0; i <= maxIndex; i++) {
        const d = document.createElement('div');
        d.style.cssText = `width:${i===atual?'24px':'8px'};height:8px;border-radius:4px;background:${i===atual?'var(--dourado)':'rgba(201,168,76,0.3)'};transition:all 0.3s;cursor:pointer;`;
        d.onclick = () => { atual = i; mover(); };
        dotsWrap.appendChild(d);
      }
    }

    function mover() {
      if (atual > maxIndex) atual = 0;
      if (atual < 0) atual = maxIndex;
      const cardW = track.children[0] ? track.children[0].offsetWidth + 24 : 0;
      track.style.transform = `translateX(-${atual * cardW}px)`;
      atualizarDots();
    }

    // Botões prev/next
    ['←','→'].forEach((txt, i) => {
      const btn = document.createElement('button');
      btn.textContent = txt;
      btn.style.cssText = `position:absolute;top:50%;transform:translateY(-50%);${i===0?'left:-16px':'right:-16px'};z-index:10;width:36px;height:36px;border-radius:50%;background:var(--dourado);color:var(--azul-escuro);border:none;font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.3);`;
      btn.onclick = () => { atual += i === 0 ? -1 : 1; mover(); };
      wrapper.style.position = 'relative';
      wrapper.appendChild(btn);
    });

    atualizarDots();

    // Auto-play a cada 4 segundos
    let timer = setInterval(() => { atual++; mover(); }, 4000);
    wrapper.addEventListener('mouseenter', () => clearInterval(timer));
    wrapper.addEventListener('mouseleave', () => { timer = setInterval(() => { atual++; mover(); }, 4000); });

    window.addEventListener('resize', () => {
      visiveis = window.innerWidth < 768 ? 1 : window.innerWidth < 1100 ? 2 : 3;
      atual = 0;
      mover();
    });
  })();

