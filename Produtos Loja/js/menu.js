const botaoCategoria = document.querySelector('.botao-categoria');
const categoria = document.querySelector('.categoria');

botaoCategoria.addEventListener('click', function (event) {

    // Impede o clique de ser interpretado como clique fora
    event.stopPropagation();

    if (window.innerWidth <= 768) {
        categoria.classList.toggle('menu-aberto');
    }

});


// Fecha o menu quando clicar fora dele
document.addEventListener('click', function (event) {

    if (window.innerWidth <= 768) {

        // Se o clique não aconteceu dentro do menu
        if (!categoria.contains(event.target)) {
            categoria.classList.remove('menu-aberto');
        }

    }

});