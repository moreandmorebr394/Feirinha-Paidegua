// checkout.js - Sacola / Finalização da Venda

let cupomDesconto = 0;

// Pega todos os produtos da página
let produtos = document.querySelectorAll(".linha-produto, .item-produto");

// Botões de aumentar e diminuir quantidade
let botoesQtd = document.querySelectorAll(".btn-qtd");

for (let i = 0; i < botoesQtd.length; i++) {
  botoesQtd[i].addEventListener("click", function () {
    let item = this.closest(".linha-produto, .item-produto");
    let qtdSpan = item.querySelector(".qtd-valor");
    let qtd = parseInt(qtdSpan.textContent);

    if (this.getAttribute("aria-label") === "Aumentar quantidade") {
      qtd = qtd + 1;
    } else {
      if (qtd > 1) {
        qtd = qtd - 1;
      }
    }

    qtdSpan.textContent = qtd;
    calcularTotal();
  });
}

// Checkbox de selecionar produto
let checkboxes = document.querySelectorAll(".check-item");
for (let i = 0; i < checkboxes.length; i++) {
  checkboxes[i].addEventListener("change", calcularTotal);
}

// Calcula e atualiza o total da sacola
function calcularTotal() {
  let total = 0;

  for (let i = 0; i < produtos.length; i++) {
    let item = produtos[i];
    let checkbox = item.querySelector(".check-item");

    if (checkbox.checked) {
      let precoTexto = item.querySelector(".preco-produto").textContent;
      let preco = parseFloat(precoTexto.replace("R$", "").replace(".", "").replace(",", ".").trim());
      let qtd = parseInt(item.querySelector(".qtd-valor").textContent);
      total = total + (preco * qtd);
    }
  }

  let totalFormatado = "R$ " + total.toFixed(2).replace(".", ",");

  // Atualiza o total onde ele aparecer na página
  let totaisDestaque = document.querySelectorAll(".footer-final .preco-destaque, .linha-total-itens .preco-destaque");
  for (let i = 0; i < totaisDestaque.length; i++) {
    totaisDestaque[i].textContent = totalFormatado;
  }

  let totalFooter = document.querySelector(".total-footer");
  if (totalFooter) {
    totalFooter.textContent = "Total " + totalFormatado;
  }
}

// Botão de finalizar compra
let btnFinalizar = document.querySelector(".btn-fazer-pedido");
if (btnFinalizar) {
  btnFinalizar.addEventListener("click", function () {
    alert("Pedido finalizado com sucesso!");
  });
}

// Calcula o total assim que a página carrega
calcularTotal();