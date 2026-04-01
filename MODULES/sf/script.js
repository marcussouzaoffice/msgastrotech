const CARDAPIO_VERSAO = "2026-03-30-smoked-menu-v1";
const CARDAPIO_PADRAO = [
  { nome: "Arroz carreteiro", preco: 35, tipo: "fixo", unidade: "500g" },
  { nome: "Brisket", preco: 150, tipo: "kg", unidade: "KG" },
  { nome: "Sholder", preco: 150, tipo: "kg", unidade: "KG" },
  { nome: "Costela", preco: 99, tipo: "kg", unidade: "KG" },
  { nome: "Maminha", preco: 99, tipo: "kg", unidade: "KG" },
  { nome: "Linguiça", preco: 99, tipo: "kg", unidade: "KG" },
  { nome: "Vinagrete de Abacaxi", preco: 30, tipo: "kg", unidade: "KG" },
  { nome: "Salada de Batata (Maionese)", preco: 45, tipo: "kg", unidade: "KG" },
  { nome: "Batata Rústica", preco: 45, tipo: "kg", unidade: "KG" },
  { nome: "Farofa de Bacon", preco: 10, tipo: "fixo", unidade: "POTE" },
  { nome: "Salpicão", preco: 70, tipo: "kg", unidade: "kg" },
];

function normalizarProduto(produto) {
  return {
    nome: produto.nome || "Produto",
    preco: Number(produto.preco || 0),
    tipo: produto.tipo === "kg" ? "kg" : "fixo",
    unidade: produto.unidade || (produto.tipo === "kg" ? "KG" : "UN")
  };
}

function obterCardapioInicial() {
  const versaoSalva = localStorage.getItem("cardapioVersao");
  const cardapioSalvo = JSON.parse(localStorage.getItem("cardapio"));

  if (versaoSalva !== CARDAPIO_VERSAO || !Array.isArray(cardapioSalvo) || cardapioSalvo.length === 0) {
    localStorage.setItem("cardapio", JSON.stringify(CARDAPIO_PADRAO));
    localStorage.setItem("cardapioVersao", CARDAPIO_VERSAO);
    return CARDAPIO_PADRAO.map(normalizarProduto);
  }

  return cardapioSalvo.map(normalizarProduto);
}

let cardapio = obterCardapioInicial();
let pedido = [];

function formatarMoeda(valor) {
  return Number(valor || 0).toFixed(2).replace(".", ",");
}

function formatarPrecoProduto(produto) {
  if (produto.tipo === "kg") {
    return `R$ ${formatarMoeda(produto.preco)} / KG`;
  }

  if (produto.unidade && produto.unidade !== "UN") {
    return `R$ ${formatarMoeda(produto.preco)} / ${produto.unidade}`;
  }

  return `R$ ${formatarMoeda(produto.preco)}`;
}

function formatarPeso(gramas) {
  const peso = Number(gramas || 0);
  if (!peso) return "0g";
  return `${peso}g`;
}

function calcularSubtotalItem(item) {
  if (item.tipo === "kg") {
    return Number(item.preco || 0) * (Number(item.pesoGramas || 0) / 1000);
  }

  return Number(item.preco || 0) * Number(item.qtd || 0);
}

function descreverQuantidadeItem(item) {
  if (item.tipo === "kg") {
    return formatarPeso(item.pesoGramas);
  }

  return `${item.qtd}x`;
}

function atualizarCamposProduto() {
  const produtoSelect = document.getElementById("produto");
  const blocoQtd = document.getElementById("blocoQtd");
  const blocoPeso = document.getElementById("blocoPeso");
  const textoAjuda = document.getElementById("produtoAjuda");
  const pesoInput = document.getElementById("pesoGramas");
  const qtdInput = document.getElementById("qtd");

  if (!produtoSelect) return;

  const produto = cardapio[Number(produtoSelect.value)];
  if (!produto) return;

  const ehPorKg = produto.tipo === "kg";

  if (blocoQtd) blocoQtd.classList.toggle("hidden", ehPorKg);
  if (blocoPeso) blocoPeso.classList.toggle("hidden", !ehPorKg);

  if (textoAjuda) {
    textoAjuda.textContent = ehPorKg
      ? `Produto por peso: ${formatarPrecoProduto(produto)}. Informe o peso em gramas.`
      : `Produto por unidade: ${formatarPrecoProduto(produto)}.`;
  }

  if (ehPorKg && pesoInput && (!pesoInput.value || Number(pesoInput.value) <= 0)) {
    pesoInput.value = 100;
  }

  if (!ehPorKg && qtdInput && (!qtdInput.value || Number(qtdInput.value) <= 0)) {
    qtdInput.value = 1;
  }
}

// =========================
// CARDÁPIO / PEDIDOS
// =========================
function carregar() {
  const select = document.getElementById("produto");
  if (!select) return;

  select.innerHTML = "";

  cardapio.forEach((p, i) => {
    select.innerHTML += `<option value="${i}">${p.nome} - ${formatarPrecoProduto(p)}</option>`;
  });

  atualizarCamposProduto();
}

function addItem() {
  const produtoSelect = document.getElementById("produto");
  const qtdInput = document.getElementById("qtd");
  const opcaoInput = document.getElementById("opcao");
  const pesoInput = document.getElementById("pesoGramas");

  if (!produtoSelect || !opcaoInput) return;

  const i = Number(produtoSelect.value);
  const opcao = opcaoInput.value.trim();
  const produto = cardapio[i];

  if (!produto) return;

  if (produto.tipo === "kg") {
    const pesoGramas = Number(pesoInput?.value || 0);

    if (isNaN(pesoGramas) || pesoGramas <= 0) {
      alert("Digite um peso válido em gramas.");
      return;
    }

    pedido.push({
      ...produto,
      qtd: 1,
      pesoGramas,
      opcao
    });

    if (pesoInput) pesoInput.value = 100;
  } else {
    const qtd = parseInt(qtdInput?.value, 10);

    if (isNaN(qtd) || qtd <= 0) {
      alert("Digite uma quantidade válida.");
      return;
    }

    pedido.push({
      ...produto,
      qtd,
      opcao
    });

    if (qtdInput) qtdInput.value = 1;
  }

  opcaoInput.value = "";

  render();
}

function removerItemPedido(indice) {
  pedido.splice(indice, 1);
  render();
}

function calcularTotal() {
  return pedido.reduce((total, item) => total + calcularSubtotalItem(item), 0);
}

function render() {
  const lista = document.getElementById("lista");
  const totalDiv = document.getElementById("total");

  if (!lista) return;

  lista.innerHTML = "";

  if (pedido.length === 0) {
    lista.innerHTML = `<div class="item item-vazio">Nenhum item adicionado ainda.</div>`;
  } else {
    pedido.forEach((p, index) => {
      const subtotal = calcularSubtotalItem(p);
      const detalheQuantidade = p.tipo === "kg"
        ? `${formatarPeso(p.pesoGramas)} • ${formatarPrecoProduto(p)}`
        : `${p.qtd}x • ${formatarPrecoProduto(p)}`;

      lista.innerHTML += `
        <div class="item item-pedido-card">
          <div class="item-pedido-conteudo">
            <div class="item-pedido-topo">
              <strong>${p.nome}</strong>
              <button type="button" class="icon-btn btn-danger" onclick="removerItemPedido(${index})" title="Excluir item">🗑️</button>
            </div>
            <div class="item-pedido-meta">${detalheQuantidade}</div>
            ${p.opcao ? `<small>↳ ${p.opcao}</small>` : ""}
            <div class="item-pedido-preco">R$ ${formatarMoeda(subtotal)}</div>
          </div>
        </div>
      `;
    });
  }

  if (totalDiv) {
    totalDiv.innerText = "Total: R$ " + formatarMoeda(calcularTotal());
  }
}

// =========================
// NUMERAÇÃO
// =========================
function gerarNumeroPedido() {
  const hoje = new Date().toLocaleDateString();
  const dataSalva = localStorage.getItem("dataPedido");
  let numero = localStorage.getItem("numeroPedido");

  if (dataSalva !== hoje) {
    numero = 1;
    localStorage.setItem("dataPedido", hoje);
  } else {
    numero = numero ? parseInt(numero, 10) + 1 : 1;
  }

  localStorage.setItem("numeroPedido", numero);
  return numero;
}

// =========================
// IMPRESSÃO
// =========================
function abrirImpressao(conteudo) {
  const win = window.open("", "", "width=380,height=700");

  if (!win) {
    alert("O navegador bloqueou a janela de impressão.");
    return;
  }

  win.document.write(`
    <html>
      <head>
        <title>Impressão</title>
        <style>
          body {
            margin: 0;
            padding: 8px;
            font-family: monospace;
            font-size: 12px;
          }
        </style>
      </head>
      <body onload="window.print(); window.close();">
        ${conteudo}
      </body>
    </html>
  `);

  win.document.close();
}

function montarLinhasCupom(dadosPedido) {
  return `
    <div style="text-align:left; font-size:12px;">
      ${dadosPedido.itens.map((i) => `
        <div style="margin-bottom:8px;">
          <div style="display:flex; justify-content:space-between; gap:8px;">
            <span>${descreverQuantidadeItem(i)} ${i.nome}</span>
            <span>R$ ${formatarMoeda(calcularSubtotalItem(i))}</span>
          </div>
          ${i.tipo === "kg" ? `<div style="font-size:10px;">↳ ${formatarPrecoProduto(i)}</div>` : ""}
          ${i.opcao ? `<div style="font-size:10px;">↳ ${i.opcao}</div>` : ""}
        </div>
      `).join("")}
    </div>
  `;
}

function montarCupomCliente(dadosPedido) {
  const logoPath = `${window.location.origin}/logoschetini.jpeg`;
  const itensCliente = montarLinhasCupom(dadosPedido);

  return `
    <div style="font-family: monospace; width: 58mm; text-align:center; margin:0 auto;">
      <img src="${logoPath}" style="width:90px;" alt="Logo Schetini">
      <br>
      -------------------------
      <div style="font-size:20px; font-weight:bold;">
        Pedido Nº ${dadosPedido.numeroPedido}
      </div>
      -------------------------
      <div style="font-size:12px;">
        Cliente: ${dadosPedido.cliente || "Não informado"}<br>
        ${dadosPedido.data}
      </div>
      <br>
      ${itensCliente}
      <br>
      -------------------------
      <div style="font-size:14px; font-weight:bold;">
        Total: R$ ${formatarMoeda(dadosPedido.total)}
      </div>
      <br>
      <div style="font-size:12px;">
        "Tudo posso naquele que me fortalece."<br>
        - Filipenses 4:13
      </div>
      <br>
      -------------------------
      <div style="font-size:12px;">
        Obrigado pela preferência!
      </div>
      <br><br><br>
    </div>
  `;
}

function montarCupomCozinha(dadosPedido) {
  const logoPath = `${window.location.origin}/logoschetini.jpeg`;
  const itensCliente = montarLinhasCupom(dadosPedido);

  return `
    <div style="font-family: monospace; width: 58mm; text-align:center; margin:0 auto;">
      <img src="${logoPath}" style="width:90px;" alt="Logo Schetini">
      <br>
      -------------------------
      <div style="font-size:20px; font-weight:bold;">
        Pedido Nº ${dadosPedido.numeroPedido}
      </div>
      -------------------------
      <div style="font-size:12px;">
        Cliente: ${dadosPedido.cliente || "Não informado"}<br>
        ${dadosPedido.data}
      </div>
      <br>
      ${itensCliente}
      <br>
      -------------------------
      <div style="font-size:14px; font-weight:bold;">
        Total: R$ ${formatarMoeda(dadosPedido.total)}
      </div>
      <br>
      <div style="font-size:12px;">
        "Tudo posso naquele que me fortalece."<br>
        - Filipenses 4:13
      </div>
      <br>
      -------------------------
      <div style="font-size:12px;">
        Obrigado pela preferência!
      </div>
      <br><br><br>
    </div>
  `;
}

function imprimir() {
  const clienteInput = document.getElementById("cliente");
  const cliente = clienteInput ? clienteInput.value.trim() || "Não informado" : "Não informado";

  if (pedido.length === 0) {
    alert("Adicione pelo menos um item antes de imprimir.");
    return;
  }

  const dadosPedido = {
    numeroPedido: gerarNumeroPedido(),
    cliente,
    data: new Date().toLocaleString(),
    itens: pedido.map((item) => ({ ...item })),
    total: calcularTotal()
  };

  abrirImpressao(montarCupomCliente(dadosPedido));

  setTimeout(() => {
    abrirImpressao(montarCupomCozinha(dadosPedido));
  }, 800);

  salvarPedido(dadosPedido);

  pedido = [];
  render();

  if (clienteInput) clienteInput.value = "";
}

// =========================
// HISTÓRICO
// =========================
function salvarPedido(dadosPedido) {
  const historico = JSON.parse(localStorage.getItem("historico")) || [];
  historico.push(dadosPedido);
  localStorage.setItem("historico", JSON.stringify(historico));
}

function renderizarHistorico(listaHistorico) {
  const div = document.getElementById("historico");
  if (!div) return;

  div.innerHTML = "";

  const historicoOrdenado = [...listaHistorico].reverse();

  if (historicoOrdenado.length === 0) {
    div.innerHTML = `<div class="historico-vazio">Nenhum pedido encontrado.</div>`;
    return;
  }

  div.classList.add("historico-grid");

  historicoOrdenado.forEach((p, index) => {
    div.innerHTML += `
      <div class="historico-card">
        <div class="historico-topo">
          <div>
            <strong>Pedido Nº ${p.numeroPedido || "-"}</strong><br>
            <span>${p.data}</span>
            <div class="historico-cliente">Cliente: ${p.cliente || "Não informado"}</div>
          </div>
          <div class="historico-total">R$ ${formatarMoeda(p.total)}</div>
        </div>

        <div class="historico-itens">
          ${(p.itens || []).map(i => `
            <div class="historico-item-linha">
              <span>${descreverQuantidadeItem(i)} ${i.nome}</span>
              <span>R$ ${formatarMoeda(calcularSubtotalItem(i))}</span>
            </div>
            ${i.tipo === "kg" ? `<div class="historico-obs">↳ ${formatarPrecoProduto(i)}</div>` : ""}
            ${i.opcao ? `<div class="historico-obs">↳ ${i.opcao}</div>` : ""}
          `).join("")}
        </div>

        <div class="historico-acoes">
          <button onclick="reimprimirPedido(${historicoOrdenado.length - 1 - index})">🖨️ Reimprimir Cliente</button>
          <button onclick="reimprimirCozinha(${historicoOrdenado.length - 1 - index})">🍔 Reimprimir Cozinha</button>
          <button class="btn-danger" onclick="excluirPedidoHistorico(${historicoOrdenado.length - 1 - index})">🗑️ Excluir Pedido</button>
        </div>
      </div>
    `;
  });
}

function carregarHistorico() {
  const historico = JSON.parse(localStorage.getItem("historico")) || [];
  renderizarHistorico(historico);
}

function buscarHistorico() {
  const termo = document.getElementById("buscaHistorico")?.value.toLowerCase().trim() || "";
  const historico = JSON.parse(localStorage.getItem("historico")) || [];

  if (!termo) {
    renderizarHistorico(historico);
    return;
  }

  const filtrado = historico.filter((p) => {
    const numero = String(p.numeroPedido || "").toLowerCase();
    const cliente = String(p.cliente || "").toLowerCase();
    const itens = (p.itens || []).map(i => `${i.nome} ${i.opcao || ""}`).join(" ").toLowerCase();

    return numero.includes(termo) || cliente.includes(termo) || itens.includes(termo);
  });

  renderizarHistorico(filtrado);
}

function reimprimirPedido(indiceOriginal) {
  const historico = JSON.parse(localStorage.getItem("historico")) || [];
  const pedidoSalvo = historico[indiceOriginal];
  if (!pedidoSalvo) return;

  abrirImpressao(montarCupomCliente(pedidoSalvo));
}

function reimprimirCozinha(indiceOriginal) {
  const historico = JSON.parse(localStorage.getItem("historico")) || [];
  const pedidoSalvo = historico[indiceOriginal];
  if (!pedidoSalvo) return;

  abrirImpressao(montarCupomCozinha(pedidoSalvo));
}

function excluirPedidoHistorico(indiceOriginal) {
  const logado = localStorage.getItem("adminLogado");
  if (logado !== "true") {
    alert("Acesso negado.");
    return;
  }

  const historico = JSON.parse(localStorage.getItem("historico")) || [];
  const pedidoSalvo = historico[indiceOriginal];
  if (!pedidoSalvo) return;

  const confirmar = confirm(`Deseja excluir o pedido Nº ${pedidoSalvo.numeroPedido}?`);
  if (!confirmar) return;

  historico.splice(indiceOriginal, 1);
  localStorage.setItem("historico", JSON.stringify(historico));
  carregarHistorico();
}

// =========================
// LOGIN ADMIN
// =========================
function login() {
  const userInput = document.getElementById("user");
  const passInput = document.getElementById("pass");

  if (!userInput || !passInput) return;

  const user = userInput.value.trim();
  const pass = passInput.value.trim();

  if (user === "Hamburgada" && pass === "Schetini1245") {
    localStorage.setItem("adminLogado", "true");

    const loginDiv = document.getElementById("login");
    const painelDiv = document.getElementById("painel");

    if (loginDiv) loginDiv.classList.add("hidden");
    if (painelDiv) painelDiv.classList.remove("hidden");

    carregarAdmin();
    mostrarDashboardAdmin();
    verificarAcessoHistorico();
  } else {
    alert("Login inválido");
  }
}

function logout() {
  localStorage.removeItem("adminLogado");
  location.reload();
}

function verificarLogin() {
  const loginDiv = document.getElementById("login");
  const painelDiv = document.getElementById("painel");

  if (!loginDiv || !painelDiv) return;

  const logado = localStorage.getItem("adminLogado");

  if (logado === "true") {
    loginDiv.classList.add("hidden");
    painelDiv.classList.remove("hidden");
    carregarAdmin();
    mostrarDashboardAdmin();
  } else {
    loginDiv.classList.remove("hidden");
    painelDiv.classList.add("hidden");
  }
}

// =========================
// ADMIN
// =========================
function moverProduto(origem, destino) {
  if (destino < 0 || destino >= cardapio.length) return;

  const [item] = cardapio.splice(origem, 1);
  cardapio.splice(destino, 0, item);

  localStorage.setItem("cardapio", JSON.stringify(cardapio));
  carregarAdmin();
  carregar();
}

function carregarAdmin() {
  const div = document.getElementById("cardapioAdmin");
  if (!div) return;

  div.innerHTML = "";

  cardapio.forEach((item, i) => {
    div.innerHTML += `
      <div class="admin-produto">
        <div class="admin-produto-ordem">
          <span class="ordem-badge">#${i + 1}</span>
          <div class="admin-move-botoes">
            <button type="button" class="move-btn" onclick="moverProduto(${i}, ${i - 1})" ${i === 0 ? "disabled" : ""}>↑</button>
            <button type="button" class="move-btn" onclick="moverProduto(${i}, ${i + 1})" ${i === cardapio.length - 1 ? "disabled" : ""}>↓</button>
          </div>
        </div>

        <input value="${item.nome}" onchange="editarNome(${i}, this.value)">
        <input type="number" step="0.01" value="${item.preco}" onchange="editarPreco(${i}, this.value)">
        <select onchange="editarTipo(${i}, this.value)">
          <option value="fixo" ${item.tipo !== "kg" ? "selected" : ""}>Preço fixo</option>
          <option value="kg" ${item.tipo === "kg" ? "selected" : ""}>Por KG</option>
        </select>
        <input value="${item.unidade || "UN"}" onchange="editarUnidade(${i}, this.value)" placeholder="Unidade (ex.: POTE, 500g, KG)">
        <div class="admin-produto-legenda">${formatarPrecoProduto(item)}</div>
        <button class="btn-danger" onclick="excluirProduto(${i})">Excluir</button>
      </div>
    `;
  });
}

function editarNome(i, valor) {
  cardapio[i].nome = valor.trim();
}

function editarPreco(i, valor) {
  const preco = parseFloat(valor);
  if (!isNaN(preco)) {
    cardapio[i].preco = preco;
  }
}

function editarTipo(i, valor) {
  cardapio[i].tipo = valor === "kg" ? "kg" : "fixo";
  if (cardapio[i].tipo === "kg") {
    cardapio[i].unidade = "KG";
  }
  carregarAdmin();
  carregar();
}

function editarUnidade(i, valor) {
  const unidade = valor.trim().toUpperCase();
  cardapio[i].unidade = unidade || (cardapio[i].tipo === "kg" ? "KG" : "UN");
}

function salvarCardapio() {
  const logado = localStorage.getItem("adminLogado");
  if (logado !== "true") {
    alert("Acesso negado! Faça login como administrador.");
    return;
  }

  localStorage.setItem("cardapio", JSON.stringify(cardapio));
  localStorage.setItem("cardapioVersao", CARDAPIO_VERSAO);
  alert("Cardápio salvo com sucesso!");
  carregar();
  carregarAdmin();
}

function adicionarProduto() {
  const logado = localStorage.getItem("adminLogado");
  if (logado !== "true") {
    alert("Acesso negado! Faça login como administrador.");
    return;
  }

  const nomeInput = document.getElementById("novoProdutoNome");
  const precoInput = document.getElementById("novoProdutoPreco");
  const tipoInput = document.getElementById("novoProdutoTipo");
  const unidadeInput = document.getElementById("novoProdutoUnidade");

  if (!nomeInput || !precoInput) return;

  const nome = nomeInput.value.trim();
  const preco = parseFloat(precoInput.value);
  const tipo = tipoInput?.value === "kg" ? "kg" : "fixo";
  const unidade = (unidadeInput?.value || "").trim().toUpperCase() || (tipo === "kg" ? "KG" : "UN");

  if (!nome) {
    alert("Digite o nome do produto.");
    return;
  }

  if (isNaN(preco) || preco <= 0) {
    alert("Digite um preço válido.");
    return;
  }

  cardapio.push({ nome, preco, tipo, unidade });
  localStorage.setItem("cardapio", JSON.stringify(cardapio));
  localStorage.setItem("cardapioVersao", CARDAPIO_VERSAO);

  nomeInput.value = "";
  precoInput.value = "";
  if (tipoInput) tipoInput.value = "fixo";
  if (unidadeInput) unidadeInput.value = "";

  carregarAdmin();
  carregar();

  alert("Produto adicionado com sucesso!");
}

function excluirProduto(i) {
  const logado = localStorage.getItem("adminLogado");
  if (logado !== "true") {
    alert("Acesso negado! Faça login como administrador.");
    return;
  }

  const confirmar = confirm(`Deseja excluir o produto "${cardapio[i].nome}"?`);
  if (!confirmar) return;

  cardapio.splice(i, 1);
  localStorage.setItem("cardapio", JSON.stringify(cardapio));

  carregarAdmin();
  carregar();

  alert("Produto excluído com sucesso!");
}

function zerarHistorico() {
  const logado = localStorage.getItem("adminLogado");
  if (logado !== "true") {
    alert("Acesso negado! Faça login como administrador.");
    return;
  }

  const confirmar = confirm("Tem certeza que deseja apagar todo o histórico de pedidos?");
  if (!confirmar) return;

  localStorage.removeItem("historico");
  carregarHistorico();
  alert("Histórico apagado com sucesso!");
}

function zerarNumeracaoPedido() {
  const logado = localStorage.getItem("adminLogado");
  if (logado !== "true") {
    alert("Acesso negado! Faça login como administrador.");
    return;
  }

  const confirmar = confirm("Deseja zerar a numeração dos pedidos?");
  if (!confirmar) return;

  localStorage.removeItem("numeroPedido");
  localStorage.removeItem("dataPedido");

  alert("Numeração de pedidos zerada com sucesso!");
}

function calcularTotalVendidoHoje() {
  const historico = JSON.parse(localStorage.getItem("historico")) || [];
  const hoje = new Date().toLocaleDateString();

  return historico
    .filter(p => String(p.data || "").includes(hoje))
    .reduce((soma, p) => soma + Number(p.total || 0), 0);
}

function mostrarDashboardAdmin() {
  const dashboard = document.getElementById("dashboardAdmin");
  if (!dashboard) return;

  const logado = localStorage.getItem("adminLogado");
  if (logado !== "true") {
    dashboard.classList.add("hidden");
    return;
  }

  dashboard.classList.remove("hidden");
  const totalHoje = calcularTotalVendidoHoje();
  const quantidadeItens = cardapio.length;

  dashboard.innerHTML = `
    <div class="dashboard-grid">
      <div class="dashboard-card">
        <h3>Total vendido hoje</h3>
        <p>R$ ${formatarMoeda(totalHoje)}</p>
      </div>
      <div class="dashboard-card">
        <h3>Itens no cardápio</h3>
        <p>${quantidadeItens}</p>
      </div>
    </div>
  `;
}

function exportarBackup() {
  const logado = localStorage.getItem("adminLogado");
  if (logado !== "true") {
    alert("Acesso negado.");
    return;
  }

  const dados = {
    historico: JSON.parse(localStorage.getItem("historico")) || [],
    cardapio: JSON.parse(localStorage.getItem("cardapio")) || [],
    numeroPedido: localStorage.getItem("numeroPedido") || "0",
    dataPedido: localStorage.getItem("dataPedido") || ""
  };

  const blob = new Blob([JSON.stringify(dados, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "backup-hamburgada.json";
  a.click();

  URL.revokeObjectURL(url);
}

function importarBackup(event) {
  const logado = localStorage.getItem("adminLogado");
  if (logado !== "true") {
    alert("Acesso negado.");
    return;
  }

  const arquivo = event.target.files[0];
  if (!arquivo) return;

  const leitor = new FileReader();
  leitor.onload = function(e) {
    try {
      const dados = JSON.parse(e.target.result);

      if (dados.historico) localStorage.setItem("historico", JSON.stringify(dados.historico));
      if (dados.cardapio) {
        cardapio = dados.cardapio.map(normalizarProduto);
        localStorage.setItem("cardapio", JSON.stringify(cardapio));
        localStorage.setItem("cardapioVersao", CARDAPIO_VERSAO);
      }
      if (dados.numeroPedido) localStorage.setItem("numeroPedido", dados.numeroPedido);
      if (dados.dataPedido) localStorage.setItem("dataPedido", dados.dataPedido);

      alert("Backup importado com sucesso.");
      location.reload();
    } catch {
      alert("Arquivo de backup inválido.");
    }
  };

  leitor.readAsText(arquivo);
}

// =========================
// FILTRO HISTÓRICO
// =========================
function verificarAcessoHistorico() {
  const filtro = document.getElementById("filtroHistorico");
  if (!filtro) return;

  const logado = localStorage.getItem("adminLogado");
  if (logado === "true") {
    filtro.classList.remove("hidden");
  } else {
    filtro.classList.add("hidden");
  }
}

function converterDataBRParaISO(dataTexto) {
  if (!dataTexto) return null;

  const partes = dataTexto.split(",")[0].split("/");
  if (partes.length !== 3) return null;

  const [dia, mes, ano] = partes;
  return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
}

function filtrarHistoricoPorData() {
  const logado = localStorage.getItem("adminLogado");
  if (logado !== "true") {
    alert("Acesso negado.");
    return;
  }

  const inicio = document.getElementById("dataInicio")?.value;
  const fim = document.getElementById("dataFim")?.value;

  const historico = JSON.parse(localStorage.getItem("historico")) || [];

  const filtrado = historico.filter(p => {
    const dataISO = converterDataBRParaISO(p.data);
    if (!dataISO) return false;
    if (inicio && dataISO < inicio) return false;
    if (fim && dataISO > fim) return false;
    return true;
  });

  renderizarHistorico(filtrado);
}

// =========================
// INICIAR
// =========================
carregar();
render();
carregarHistorico();
