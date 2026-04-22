
/* Função para abrir e fechar o menu ao clicar em Matérias */
function toggleMenu(event) {
    event.preventDefault(); /* Evita que a tela pule para o topo */
    document.getElementById("meuDropdown").classList.toggle("mostrar");
}

/* Função extra: Fecha o menu se o usuário clicar em qualquer outro lugar da tela */
window.onclick = function (event) {
    if (!event.target.matches('.dropbtn') && !event.target.matches('.seta')) {
        var dropdowns = document.getElementsByClassName("dropdown-conteudo");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('mostrar')) {
                openDropdown.classList.remove('mostrar');
            }
        }
    }
}

/* =========================================
   Função para alternar entre os Trimestres
   ========================================= */
function abrirTrimestre(evento, idTrimestre) {
    // 1. Esconde todos os conteúdos de trimestre
    let conteudos = document.getElementsByClassName("aba-conteudo");
    for (let i = 0; i < conteudos.length; i++) {
        conteudos[i].style.display = "none";
    }

    // 2. Remove a classe "ativo" de todos os botões
    let botoes = document.getElementsByClassName("aba-btn");
    for (let i = 0; i < botoes.length; i++) {
        botoes[i].className = botoes[i].className.replace(" ativo", "");
    }

    // 3. Mostra o trimestre clicado e marca o botão correspondente como ativo
    document.getElementById(idTrimestre).style.display = "block";
    evento.currentTarget.className += " ativo";
}

/* ==========================================================================
   FUNÇÕES PARA CERTIFICADOS - FLIP CARD E MODAL
   ========================================================================== */

/**
 * Alterna entre frente e verso do certificado (Flip Card)
 * @param {Event} event - Evento do clique
 */
function toggleFlip(event) {
    const flipCard = event.currentTarget;
    flipCard.classList.toggle('flipped');
}

/**
 * Abre o modal com a imagem ampliada do certificado
 * @param {string} imageSrc - Caminho da imagem
 * @param {string} title - Título do certificado
 */
function openImageModal(imageSrc, title) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');

    // Preenche os dados do modal
    modalImage.src = imageSrc;
    modalTitle.textContent = title;

    // Adiciona a classe 'active' para exibir o modal
    modal.classList.add('active');

    // Previne scroll da página enquanto modal está aberto
    document.body.style.overflow = 'hidden';
}

/**
 * Fecha o modal de visualização ampliada
 */
function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('active');

    // Restaura o scroll da página
    document.body.style.overflow = 'auto';
}

/**
 * Fecha o modal se clicar fora da imagem (no overlay)
 */
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('imageModal');
    
    if (modal) {
        // Fechar ao pressionar ESC
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && modal.classList.contains('active')) {
                closeImageModal();
            }
        });
    }
});
