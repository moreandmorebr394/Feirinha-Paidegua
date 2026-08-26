/* ==========================================================
   checkout.js — Feirinha Pai'Egua
   JavaScript da finalização de venda
   Funciona tanto em sacola.html quanto em finalizacao.html
   (o script detecta sozinho o que existe em cada página)
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ------------------------------------------------------
     1. CUPONS DISPONÍVEIS
     ------------------------------------------------------ */
  const cupons = {
    "PAIEGUA10": 0.10,
    "PAIEGUA20": 0.20
  };
  let cupomAtivo = null;

  /* ------------------------------------------------------
     2. HELPERS DE FORMATAÇÃO / CONVERSÃO DE MOEDA
     ------------------------------------------------------ */
  // "R$ 39,00" -> 39.00
  function parsePreco(texto) {
    if (!texto) return 0;
    const limpo = texto.replace(/[^\d,]/g, "").replace(",", ".");
    return parseFloat(limpo) || 0;
  }

  // 39 -> "R$ 39,00"
  function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  /* ------------------------------------------------------
     3. ITENS DA SACOLA (funciona com .linha-produto OU .item-produto)
     ------------------------------------------------------ */
  const itens = document.querySelectorAll(".linha-produto, .item-produto");

  // Guarda o preço unitário de cada item (lido do próprio HTML) pra não
  // precisar mexer no markup adicionando data-preco em cada produto
  itens.forEach((item) => {
    const precoEl = item.querySelector(".preco-produto");
    if (precoEl) {
      item.dataset.precoUnitario = parsePreco(precoEl.textContent);
    }
  });

  /* Stepper de quantidade (+ / −) — identificado pelo aria-label */
  itens.forEach((item) => {
    const botoes = item.querySelectorAll(".btn-qtd");
    const qtdValorEl = item.querySelector(".qtd-valor");

    botoes.forEach((botao) => {
      botao.addEventListener("click", () => {
        let qtd = parseInt(qtdValorEl.textContent, 10) || 1;
        const aumentando = botao.getAttribute("aria-label") === "Aumentar quantidade";

        qtd = aumentando ? qtd + 1 : Math.max(1, qtd - 1);

        qtdValorEl.textContent = qtd;
        atualizarTotais();
      });
    });
  });

  /* Seleção de item (checkbox)  */
  document.querySelectorAll(".check-item").forEach((checkbox) => {
    checkbox.addEventListener("change", atualizarTotais);
  });

  /* ------------------------------------------------------
     4. CÁLCULO DO SUBTOTAL / TOTAL
     ------------------------------------------------------ */
  function calcularResumo() {
    let subtotal = 0;
    let totalItensQtd = 0;

    itens.forEach((item) => {
      const checkbox = item.querySelector(".check-item");
      const selecionado = checkbox ? checkbox.checked : true;
      if (!selecionado) return;

      const precoUnitario = parseFloat(item.dataset.precoUnitario) || 0;
      const qtd = parseInt(item.querySelector(".qtd-valor")?.textContent, 10) || 1;

      subtotal += precoUnitario * qtd;
      totalItensQtd += qtd;
    });

    const desconto = cupomAtivo ? subtotal * cupomAtivo : 0;
    const total = subtotal - desconto;

    return { subtotal, total, totalItensQtd };
  }

  /* ------------------------------------------------------
     5. ATUALIZA TODOS OS LUGARES QUE MOSTRAM VALORES NA PÁGINA
     ------------------------------------------------------ */
  function atualizarTotais() {
    const { subtotal, total, totalItensQtd } = calcularResumo();

    // "Total de X Itens" + valor (bloco de produtos - finalizacao.html)
    document.querySelectorAll(".linha-total-itens").forEach((linha) => {
      const label = linha.querySelector("span:first-child");
      const preco = linha.querySelector(".preco-destaque");
      if (label) label.textContent = `Total de ${totalItensQtd} Itens`;
      if (preco) preco.textContent = formatarMoeda(subtotal);
    });

    // Total no footer-final (sacola.html)
    document.querySelectorAll(".footer-final .linha-total .preco-destaque").forEach((el) => {
      el.textContent = formatarMoeda(total);
    });

    // Bloco "Detalhes de Pagamento" (finalizacao.html)
    document.querySelectorAll(".bloco-resumo .linha-resumo").forEach((linha) => {
      const label = linha.querySelector("span:first-child")?.textContent.trim();
      const preco = linha.querySelector(".preco-destaque");
      if (!preco) return;
      if (label === "Total dos Produtos") preco.textContent = formatarMoeda(subtotal);
      if (label === "Total de Pedidos") preco.textContent = formatarMoeda(total);
    });

    // Barra fixa inferior (finalizacao.html)
    document.querySelectorAll(".footer-fixo .total-footer").forEach((el) => {
      el.textContent = `Total ${formatarMoeda(total)}`;
    });

    // Contador no cabeçalho da sacola: "(7)" -> quantidade selecionada
    const contagem = document.querySelector(".contagem");
    if (contagem) contagem.textContent = `(${totalItensQtd})`;
  }

  /* ------------------------------------------------------
     6. CUPOM DE DESCONTO ( #cupom-desconto da sacola)
     ------------------------------------------------------ */
  const inputCupom = document.getElementById("cupom-desconto");
  const msgDesconto = document.querySelector(".msg-desconto");

  if (inputCupom) {
    const aplicarCupom = () => {
      const codigo = inputCupom.value.trim().toUpperCase();
      if (!codigo) return;

      if (cupons[codigo]) {
        cupomAtivo = cupons[codigo];
        if (msgDesconto) {
          msgDesconto.textContent = `Cupom "${codigo}" aplicado: ${cupons[codigo] * 100}% de desconto!`;
          msgDesconto.style.color = "#2E7D32";
        }
      } else {
        cupomAtivo = null;
        if (msgDesconto) {
          msgDesconto.textContent = "Cupom inválido.";
          msgDesconto.style.color = "#D94336";
        }
      }
      atualizarTotais();
    };

    // aplica cupom
    inputCupom.addEventListener("keydown", (e) => {
      if (e.key === "Enter") aplicarCupom();
    });
    inputCupom.addEventListener("blur", aplicarCupom);
  }

  /* ------------------------------------------------------
     7. BOTÃO "FINALIZAR COMPRA" / "FAZER PEDIDO"
     ------------------------------------------------------ */
  document.querySelectorAll(".btn-fazer-pedido").forEach((botao) => {
    botao.addEventListener("click", () => {
      const { subtotal, total, totalItensQtd } = calcularResumo();

      if (totalItensQtd === 0) {
        alert("Selecione pelo menos um produto para finalizar o pedido.");
        return;
      }

      // Forma de pagamento na página de finalização
      const radiosPagamento = document.querySelectorAll('input[name="pagamento"]');
      let pagamento = null;

      if (radiosPagamento.length > 0) {
        const selecionado = document.querySelector('input[name="pagamento"]:checked');
        if (!selecionado) {
          alert("Escolha uma forma de pagamento.");
          return;
        }
        pagamento = selecionado.value;
      }

      const itensDoPedido = [];
      itens.forEach((item) => {
        const checkbox = item.querySelector(".check-item");
        if (checkbox && !checkbox.checked) return;

        itensDoPedido.push({
          nome: item.querySelector(".nome-produto")?.textContent.trim(),
          quantidade: parseInt(item.querySelector(".qtd-valor")?.textContent, 10) || 1,
          precoUnitario: parseFloat(item.dataset.precoUnitario) || 0
        });
      });

      const pedido = { itens: itensDoPedido, subtotal, desconto: cupomAtivo || 0, total, pagamento };
      console.log("Pedido finalizado:", pedido);


      alert(`Pedido enviado com sucesso!\nTotal: ${formatarMoeda(total)}`);
    });
  });

  /* ------------------------------------------------------
     8. BOTÕES "ADICIONAR" DA SEÇÃO DE SUGESTÕES
     ------------------------------------------------------ */
  document.querySelectorAll(".sugestao-btn").forEach((botao) => {
    botao.addEventListener("click", () => {
      botao.textContent = "Adicionado ✓";
      botao.disabled = true;
      botao.style.backgroundColor = "#2E7D32";
    });
  });

  /* ------------------------------------------------------
     9. INICIALIZAÇÃO
     ------------------------------------------------------ */
  atualizarTotais();

});


