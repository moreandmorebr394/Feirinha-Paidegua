/* Carrossel do banner */
const slides = document.querySelectorAll(".banner-slide");
const bolinhas = document.querySelectorAll(".bolinha");

let indiceAtual = 0;

function mostrarSlide(indice) {
    slides.forEach(slide => slide.classList.remove("ativo"));
    bolinhas.forEach(bolinha => bolinha.classList.remove("ativo"));

    slides[indice].classList.add("ativo");
    bolinhas[indice].classList.add("ativo");

    indiceAtual = indice;
}

function proximoSlider() {
    let proximo = (indiceAtual + 1) % slides.length;
    mostrarSlide(proximo);
}

bolinhas.forEach((bolinha, indice) => {
    bolinha.addEventListener('click', () => mostrarSlide(indice));
});

setInterval(proximoSlider, 5000);

/* Botão de favoritar nos cards de produto */
const botoesFavoritar = document.querySelectorAll('.botao-favoritar');

botoesFavoritar.forEach(botao => {
    botao.addEventListener('click', () => {
        botao.classList.toggle('favoritado');
    });
});