/* ==========================================================================
   PORTFÓLIO JOÃO HARTMANN — SCRIPTS
   ========================================================================== */

/* =========================================
   MENU DROPDOWN (Desktop)
   ========================================= */
function toggleMenu(event) {
    event.preventDefault();
    document.getElementById("meuDropdown").classList.toggle("mostrar");
}

window.onclick = function (event) {
    if (!event.target.matches('.dropbtn') && !event.target.matches('.seta')) {
        var dropdowns = document.getElementsByClassName("dropdown-conteudo");
        for (var i = 0; i < dropdowns.length; i++) {
            dropdowns[i].classList.remove('mostrar');
        }
    }
}

/* =========================================
   MENU HAMBÚRGUER (Mobile)
   ========================================= */
document.addEventListener('DOMContentLoaded', function () {

    const navbar = document.querySelector('.nav-bar');
    const topic = document.querySelector('.topic');

    if (navbar && topic && !document.querySelector('.hamburger')) {
        const hamburger = document.createElement('button');
        hamburger.classList.add('hamburger');
        hamburger.setAttribute('aria-label', 'Abrir menu');
        hamburger.innerHTML = '<span></span><span></span><span></span>';
        navbar.insertBefore(hamburger, topic);

        hamburger.addEventListener('click', function (e) {
            e.stopPropagation();
            hamburger.classList.toggle('ativo');
            topic.classList.toggle('aberto');
            document.body.style.overflow = topic.classList.contains('aberto') ? 'hidden' : '';
        });

        topic.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                if (window.innerWidth <= 768) {
                    hamburger.classList.remove('ativo');
                    topic.classList.remove('aberto');
                    document.body.style.overflow = '';
                }
            });
        });
    }

    /* =========================================
       ABAS TRIMESTRAIS
       ========================================= */
    var primeiraAba = document.querySelector('.aba-conteudo');
    if (primeiraAba && primeiraAba.style.display !== 'block') {
        primeiraAba.style.display = 'block';
    }

    /* =========================================
       SCROLL REVEAL
       ========================================= */
    const elementosReveal = document.querySelectorAll(
        '.sobre-layout, .projeto-card, .premium-cert-item, .modern-card, .atividade-card, .secao > *, .capa-interna, .skill-card, .card-info, .formulario-wrapper'
    );

    elementosReveal.forEach(function (el, i) {
        el.classList.add('reveal');
        el.style.transitionDelay = (i * 0.07) + 's';
    });

    const observadorReveal = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visivel');
                observadorReveal.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    elementosReveal.forEach(function (el) { observadorReveal.observe(el); });

    /* =========================================
       SKILL BARS — Animação ao entrar na tela
       ========================================= */
    const skillFills = document.querySelectorAll('.skill-fill');
    if (skillFills.length > 0) {
        const skillObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var target = entry.target.dataset.pct;
                    entry.target.style.width = target + '%';
                    skillObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });
        skillFills.forEach(function (el) { skillObserver.observe(el); });
    }

    /* =========================================
       MODAL DE IMAGEM (Certificados)
       ========================================= */
    const modal = document.getElementById('imageModal');
    if (modal) {
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && modal.classList.contains('active')) {
                closeImageModal();
            }
        });
    }

    /* =========================================
       NAVBAR — Efeito ao rolar
       ========================================= */
    const navBar = document.querySelector('.nav-bar');
    if (navBar) {
        window.addEventListener('scroll', function () {
            navBar.style.background = window.scrollY > 30
                ? 'rgba(8, 8, 24, 0.97)'
                : '';
        }, { passive: true });
    }

    /* =========================================
       BARRA DE PROGRESSO DE LEITURA
       ========================================= */
    var progressBar = document.createElement('div');
    progressBar.classList.add('progress-bar');
    document.body.prepend(progressBar);

    window.addEventListener('scroll', function () {
        var scrollTop = window.scrollY;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = pct + '%';
    }, { passive: true });

    /* =========================================
       LOADING SCREEN
       ========================================= */
    var loadingEl = document.getElementById('loading-screen');
    if (loadingEl) {
        window.addEventListener('load', function () {
            setTimeout(function () {
                loadingEl.classList.add('oculto');
                setTimeout(function () { loadingEl.remove(); }, 700);
            }, 950);
        });
    }

    /* =========================================
       CURSOR PERSONALIZADO — TECH / RADAR
       ========================================= */
    if (window.matchMedia('(pointer: fine)').matches) {
        document.body.classList.add('cursor-custom');

        var dot = document.createElement('div');
        var ring = document.createElement('div');
        dot.className = 'cursor-dot';
        ring.className = 'cursor-ring';
        document.body.appendChild(dot);
        document.body.appendChild(ring);

        var mouseX = 0, mouseY = 0;
        var ringX = 0, ringY = 0;

        document.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.left = mouseX + 'px';
            dot.style.top = mouseY + 'px';
        });

        // Anel com lag suave (efeito radar)
        function animateRing() {
            ringX += (mouseX - ringX) * 0.10;
            ringY += (mouseY - ringY) * 0.10;
            ring.style.left = ringX + 'px';
            ring.style.top = ringY + 'px';
            requestAnimationFrame(animateRing);
        }
        animateRing();

        // Atualiza hover em elementos interativos dinamicamente
        function bindCursorHover() {
            var interativos = 'a, button, [onclick], input, textarea, select, label, .badge, .btn, .cert-view-btn, .aba-btn, .modern-card, .card-info, .botao-enviar, .tool-badge, .skill-tag-badge, .erro-btn, .skill-card';
            document.querySelectorAll(interativos).forEach(function (el) {
                if (el._cursorBound) return;
                el._cursorBound = true;
                el.addEventListener('mouseenter', function () {
                    dot.classList.add('hover');
                    ring.classList.add('hover');
                });
                el.addEventListener('mouseleave', function () {
                    dot.classList.remove('hover');
                    ring.classList.remove('hover');
                });
            });
        }
        bindCursorHover();

        // Click feedback — pulso de luz
        document.addEventListener('mousedown', function () { dot.classList.add('click'); });
        document.addEventListener('mouseup', function () { dot.classList.remove('click'); });

        // Esconde fora da janela
        document.addEventListener('mouseleave', function () {
            dot.style.opacity = '0'; ring.style.opacity = '0';
        });
        document.addEventListener('mouseenter', function () {
            dot.style.opacity = '1'; ring.style.opacity = '1';
        });
    }

    /* =========================================
       PARTÍCULAS NO HERO (index.html)
       ========================================= */
    var heroCanvas = document.getElementById('hero-particles');
    if (heroCanvas) {
        var ctx = heroCanvas.getContext('2d');
        var particles = [];
        var NUM = 55;

        function resizeCanvas() {
            heroCanvas.width = heroCanvas.offsetWidth;
            heroCanvas.height = heroCanvas.offsetHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas, { passive: true });

        for (var i = 0; i < NUM; i++) {
            particles.push({
                x: Math.random() * heroCanvas.width,
                y: Math.random() * heroCanvas.height,
                r: Math.random() * 1.8 + 0.4,
                dx: (Math.random() - 0.5) * 0.35,
                dy: (Math.random() - 0.5) * 0.35,
                opacity: Math.random() * 0.5 + 0.1
            });
        }

        function drawParticles() {
            ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
            particles.forEach(function (p) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(129, 140, 248, ' + p.opacity + ')';
                ctx.fill();

                p.x += p.dx;
                p.y += p.dy;

                if (p.x < 0 || p.x > heroCanvas.width) p.dx *= -1;
                if (p.y < 0 || p.y > heroCanvas.height) p.dy *= -1;
            });

            // Linhas de conexão
            for (var a = 0; a < particles.length; a++) {
                for (var b = a + 1; b < particles.length; b++) {
                    var dist = Math.hypot(particles[a].x - particles[b].x, particles[a].y - particles[b].y);
                    if (dist < 110) {
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.strokeStyle = 'rgba(79, 70, 229, ' + (0.12 * (1 - dist / 110)) + ')';
                        ctx.lineWidth = 0.7;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(drawParticles);
        }
        drawParticles();
    }

    /* =========================================
       TRANSIÇÃO ENTRE PÁGINAS
       ========================================= */
    var overlay = document.createElement('div');
    overlay.classList.add('page-transition-overlay');
    document.body.appendChild(overlay);

    document.querySelectorAll('a[href]').forEach(function (link) {
        var href = link.getAttribute('href');
        // Só ativa em links internos que não sejam âncoras, downloads ou externos
        if (href && !href.startsWith('#') && !href.startsWith('http') &&
            !href.startsWith('mailto') && !href.startsWith('tel') &&
            !link.hasAttribute('download') && !link.getAttribute('target')) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                overlay.classList.add('saindo');
                setTimeout(function () { window.location.href = href; }, 300);
            });
        }
    });

    // Entrada — remove overlay ao carregar
    setTimeout(function () { overlay.classList.remove('saindo'); }, 50);

}); // fim DOMContentLoaded

/* =========================================
   FUNÇÃO: Alternar Trimestres
   ========================================= */
function abrirTrimestre(evento, idTrimestre) {
    var conteudos = document.getElementsByClassName("aba-conteudo");
    for (var i = 0; i < conteudos.length; i++) {
        conteudos[i].style.display = "none";
    }
    var botoes = document.getElementsByClassName("aba-btn");
    for (var i = 0; i < botoes.length; i++) {
        botoes[i].classList.remove("ativo");
    }
    document.getElementById(idTrimestre).style.display = "block";
    evento.currentTarget.classList.add("ativo");
}

/* =========================================
   FUNÇÕES: Certificados Flip & Modal
   ========================================= */
function toggleFlip(event) {
    event.currentTarget.classList.toggle('flipped');
}

function openImageModal(imageSrc, title) {
    var modal = document.getElementById('imageModal');
    var modalImage = document.getElementById('modalImage');
    var modalTitle = document.getElementById('modalTitle');
    modalImage.src = imageSrc;
    modalTitle.textContent = title;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    var modal = document.getElementById('imageModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

/* =========================================
   VALIDAÇÃO DO FORMULÁRIO DE CONTATO
   ========================================= */
function validarFormulario(event) {
    var nome = document.getElementById('nome') ? document.getElementById('nome').value.trim() : '';
    var email = document.getElementById('email') ? document.getElementById('email').value.trim() : '';
    var assunto = document.getElementById('assunto') ? document.getElementById('assunto').value.trim() : '';
    var mensagem = document.getElementById('mensagem') ? document.getElementById('mensagem').value.trim() : '';

    if (nome.length < 3) { alert('Por favor, insira um nome com pelo menos 3 caracteres.'); event.preventDefault(); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert('Por favor, insira um email válido.'); event.preventDefault(); return false; }
    if (assunto.length < 5) { alert('Por favor, insira um assunto com pelo menos 5 caracteres.'); event.preventDefault(); return false; }
    if (mensagem.length < 10) { alert('Por favor, insira uma mensagem com pelo menos 10 caracteres.'); event.preventDefault(); return false; }
    return true;
}