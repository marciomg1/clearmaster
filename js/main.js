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
      const durationAnos = 3500;
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
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      }
    });
  });

});
