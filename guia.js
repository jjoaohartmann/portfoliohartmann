/* ==========================================================================
   GUIA — Scripts da página de apresentação
   Navegação rápida, cronômetro de 10 minutos e atalhos de teclado.
   (Menu, barra de progresso de leitura e transições vêm do script.js)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', function () {

    var nav = document.querySelector('.guia-nav');
    if (!nav) return;

    var lista = nav.querySelector('.guia-nav-lista');
    var chips = Array.prototype.slice.call(lista.querySelectorAll('a'));
    var secoes = chips.map(function (c) { return document.querySelector(c.getAttribute('href')); });

    /* =========================================
       TEMPOS PLANEJADOS (vêm do data-tempo, em segundos, de cada atalho)
       ========================================= */
    var inicios = [], fins = [], TOTAL = 0;
    chips.forEach(function (c) {
        inicios.push(TOTAL);
        TOTAL += parseInt(c.dataset.tempo, 10) || 0;
        fins.push(TOTAL);
    });

    function fmt(seg) {
        seg = Math.max(0, Math.floor(seg));
        var m = Math.floor(seg / 60), s = seg % 60;
        return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    }

    /* =========================================
       ALTURA DA BARRA (usada no scroll-margin das seções)
       ========================================= */
    function medirNav() {
        document.documentElement.style.setProperty('--guia-alt', nav.offsetHeight + 'px');
    }
    medirNav();
    window.addEventListener('resize', medirNav, { passive: true });
    window.addEventListener('load', medirNav);

    /* =========================================
       CRONÔMETRO
       ========================================= */
    var elTempo = document.getElementById('guiaTempo');
    var elTotal = document.getElementById('guiaTotal');
    var elStatus = document.getElementById('guiaStatus');
    var elFill = document.getElementById('guiaFill');
    var timerBox = nav.querySelector('.guia-timer');
    var btnPlay = document.getElementById('guiaPlay');
    var btnReset = document.getElementById('guiaReset');
    var progresso = nav.querySelector('.guia-progresso');

    elTotal.textContent = '/ ' + fmt(TOTAL);

    // Marcas nas divisas de cada seção
    fins.slice(0, -1).forEach(function (f) {
        var marca = document.createElement('span');
        marca.className = 'guia-timer-marca';
        marca.style.left = (f / TOTAL * 100) + '%';
        progresso.appendChild(marca);
    });

    var CHAVE = 'guiaCronometro';
    var estado = { acumulado: 0, inicio: null };   // inicio = instante em que começou a rodar
    try {
        var salvo = JSON.parse(localStorage.getItem(CHAVE));
        if (salvo && typeof salvo.acumulado === 'number') {
            estado = salvo;
            // Se ficou "rodando" por mais de 4 h, é sobra de outro dia: zera
            if (estado.inicio && Date.now() - estado.inicio > 4 * 3600 * 1000) {
                estado = { acumulado: 0, inicio: null };
            }
        }
    } catch (e) { /* sem localStorage: segue sem persistir */ }

    function salvar() {
        try { localStorage.setItem(CHAVE, JSON.stringify(estado)); } catch (e) { }
    }

    function decorrido() {
        return (estado.acumulado + (estado.inicio ? Date.now() - estado.inicio : 0)) / 1000;
    }

    var ativo = -1;
    var intervalo = null;

    function atualizarTimer() {
        var s = decorrido();
        var i = Math.max(ativo, 0);
        var rodando = !!estado.inicio;
        var classe = '', texto;

        elTempo.textContent = fmt(s);
        elFill.style.width = Math.min(100, s / TOTAL * 100) + '%';

        if (s < 1 && !rodando) {
            texto = 'Pronto para começar';
        } else if (s > TOTAL) {
            classe = 'estourou';
            texto = '+' + fmt(s - TOTAL) + ' além dos 10 min';
        } else if (s > fins[i] + 5) {
            classe = 'atrasado';
            texto = '+' + fmt(s - fins[i]) + ' de atraso';
        } else if (s < inicios[i] - 5) {
            classe = 'adiantado';
            texto = fmt(inicios[i] - s) + ' adiantado';
        } else {
            texto = 'Restam ' + fmt(fins[i] - s) + ' na seção';
        }
        if (!rodando && s >= 1) texto = 'Pausado · ' + texto.charAt(0).toLowerCase() + texto.slice(1);

        elStatus.textContent = texto;
        timerBox.classList.remove('adiantado', 'atrasado', 'estourou');
        if (classe) timerBox.classList.add(classe);
    }

    // Mantém a tela acesa durante a apresentação (quando o navegador permite)
    var travaTela = null;
    function travar() {
        if ('wakeLock' in navigator) {
            navigator.wakeLock.request('screen').then(function (l) { travaTela = l; }).catch(function () { });
        }
    }
    function liberar() {
        if (travaTela) { travaTela.release().catch(function () { }); travaTela = null; }
    }
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible' && estado.inicio) travar();
    });

    function desenharBotao() {
        var rodando = !!estado.inicio;
        btnPlay.textContent = rodando ? '⏸' : '▶';
        btnPlay.setAttribute('aria-label', rodando ? 'Pausar cronômetro' : 'Iniciar cronômetro');
        btnPlay.setAttribute('title', rodando ? 'Pausar (T)' : 'Iniciar (T)');
    }

    function iniciar() {
        if (estado.inicio) return;
        estado.inicio = Date.now();
        intervalo = setInterval(atualizarTimer, 250);
        travar();
        salvar(); desenharBotao(); atualizarTimer();
    }

    function pausar() {
        if (!estado.inicio) return;
        estado.acumulado += Date.now() - estado.inicio;
        estado.inicio = null;
        clearInterval(intervalo); intervalo = null;
        liberar();
        salvar(); desenharBotao(); atualizarTimer();
    }

    function alternar() { estado.inicio ? pausar() : iniciar(); }

    function zerar() {
        // Evita zerar sem querer no meio da fala
        if (decorrido() > 5 && !window.confirm('Zerar o cronômetro?')) return;
        pausar();
        estado = { acumulado: 0, inicio: null };
        salvar(); desenharBotao(); atualizarTimer();
    }

    btnPlay.addEventListener('click', alternar);
    btnReset.addEventListener('click', zerar);

    /* =========================================
       NAVEGAÇÃO RÁPIDA — destaca a seção atual
       ========================================= */
    function centralizarChip(chip) {
        var alvo = chip.offsetLeft - (lista.clientWidth - chip.offsetWidth) / 2;
        lista.scrollTo({ left: Math.max(0, alvo), behavior: 'smooth' });
    }

    function atualizarAtivo() {
        var limite = nav.getBoundingClientRect().bottom + 40;
        var idx = -1;
        for (var i = 0; i < secoes.length; i++) {
            if (secoes[i].getBoundingClientRect().top <= limite) idx = i;
        }
        // No fim da página, a última seção fica ativa
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
            idx = secoes.length - 1;
        }
        if (idx === ativo) return;

        ativo = idx;
        chips.forEach(function (c, i) {
            c.classList.toggle('ativo', i === ativo);
            if (i === ativo) c.setAttribute('aria-current', 'true');
            else c.removeAttribute('aria-current');
        });
        if (ativo >= 0) centralizarChip(chips[ativo]);
        atualizarTimer();
    }

    var ticking = false;
    window.addEventListener('scroll', function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () { atualizarAtivo(); ticking = false; });
    }, { passive: true });

    function irPara(i) {
        i = Math.max(0, Math.min(secoes.length - 1, i));
        secoes[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /* =========================================
       ATALHOS DE TECLADO  ( ←  →  troca de seção · T cronômetro )
       ========================================= */
    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        var t = e.target;
        if (t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable)) return;

        if (e.key === 'ArrowRight') { e.preventDefault(); irPara(ativo + 1); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); irPara(ativo - 1); }
        else if (e.key === 't' || e.key === 'T') { e.preventDefault(); alternar(); }
    });

    /* =========================================
       ANIMAÇÃO DE ENTRADA (mesma .reveal do site)
       ========================================= */
    var reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if ('IntersectionObserver' in window && !reduzir) {
        var alvos = document.querySelectorAll(
            '.guia-area-topo, .guia-sobre-layout, .guia-card, .guia-marco, .guia-aprendizados, .guia-final'
        );
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el = entry.target;
                el.classList.add('visivel');
                obs.unobserve(el);
                // Terminada a entrada, devolve ao elemento o hover/transição originais
                setTimeout(function () {
                    el.classList.remove('reveal', 'visivel');
                    el.style.transitionDelay = '';
                }, 900);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        alvos.forEach(function (el) {
            var irmaos = Array.prototype.slice.call(el.parentElement.children).filter(function (n) {
                return n.className === el.className;
            });
            el.classList.add('reveal');
            el.style.transitionDelay = (irmaos.indexOf(el) * 0.1) + 's';
            obs.observe(el);
        });
    }

    /* =========================================
       ESTADO INICIAL
       ========================================= */
    desenharBotao();
    if (estado.inicio) {            // recarregou a página com o cronômetro rodando
        intervalo = setInterval(atualizarTimer, 250);
        travar();
    }
    atualizarAtivo();
    atualizarTimer();
});
