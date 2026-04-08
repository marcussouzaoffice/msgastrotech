/*********************************
 CONTROLE DE TELAS
*********************************/
let telaAtual = 0;
const slider = document.querySelector('.slider');

function nextScreen() {
  telaAtual++;
  slider.style.transform = `translateX(-${telaAtual * 100}vw)`;
}

function irInicio() {
  telaAtual = 0;
  slider.style.transform = `translateX(0)`;
}

function novaReceita() {
  telaAtual = 2;
  slider.style.transform = `translateX(-${telaAtual * 100}vw)`;
}

function voltar() {
  telaAtual--;
  slider.style.transform = `translateX(-${telaAtual * 100}vw)`;
}

/*********************************
 FORMATADORES
*********************************/
function formatarPeso(g) {

  // Se for 1kg ou mais → mostrar em kg com 3 casas
  if (g >= 1000) {
    return (g / 1000).toFixed(3) + " kg";
  }

  // Se for gramas
  if (Number.isInteger(g)) {
    return g + " g"; // remove .0
  }

  return parseFloat(g.toFixed(1)) + " g";
}

function formatarLitros(litros) {

  // Se for número inteiro → sem decimal
  if (Number.isInteger(litros)) {
    return litros + " L";
  }

  // Se tiver decimal real → remove zeros desnecessários
  return parseFloat(litros.toFixed(3)) + " L";
}

/*********************************
 GERAR RECEITA
*********************************/
function gerarReceita() {

  const tipo = document.getElementById("tipoProduto").value;
  const pesoKg = parseFloat(document.getElementById("peso").value);
  const responsavel = document.getElementById("responsavel").value;

  if (!tipo || !pesoKg || pesoKg <= 0) {
    alert("Preencha corretamente.");
    return;
  }

  nextScreen(); // loading

  setTimeout(() => {

    const pesoProteinaG = pesoKg * 1000;
    let totalReceitaG = pesoProteinaG;

    let html = `
      <h3>${tipo.toUpperCase()} (${pesoKg} kg)</h3>
      <table>
        <tr>
          <th>Ingrediente</th>
          <th>Quantidade</th>
        </tr>
    `;

    function addPercentual(nome, percentual) {
      const qtd = pesoProteinaG * (percentual / 100);
      totalReceitaG += qtd;
      html += `<tr><td>${nome}</td><td class="qtd">${formatarPeso(qtd)}</td></tr>`;
    }

    /* =========================
       PANCETA DEFUMADA
    ========================= */
    if (tipo === "panceta") {

      addPercentual("Sal", 2);
      addPercentual("Cura", 0.25);
      addPercentual("Açúcar mascavo", 0.5);
      addPercentual("Pimenta calabresa", 0.1);

      const newCor = (totalReceitaG / 1000) * 2.5;
      totalReceitaG += newCor;

      html += `<tr><td>New Cor</td><td class="qtd">${formatarPeso(newCor)}</td></tr>`;
    }

    /* =========================
       COPA LOMBO DEFUMADA
    ========================= */
    if (tipo === "copa") {

      addPercentual("Sal", 2.5);
      addPercentual("Cura", 0.25);
      addPercentual("Pimenta do reino", 0.2);
      addPercentual("Açúcar demerara", 0.5);
      addPercentual("Salsa desidratada", 0.15);
      addPercentual("Alho em pó", 0.15);

      const newItem = (totalReceitaG / 1000) * 2.5;
      totalReceitaG += newItem;

      html += `<tr><td>New Cor</td><td class="qtd">${formatarPeso(newItem)}</td></tr>`;
    }

    /* =========================
       FRANGO DEFUMADO
    ========================= */
    if (tipo === "frango") {

      addPercentual("Pimenta do reino", 0.4);
      addPercentual("Sal", 4);
      addPercentual("Cura", 0.25);
      addPercentual("Açúcar mascavo", 3);

      // ❌ não entra New Cor
    }

    /* =========================
       RELISH (MANTIDO)
    ========================= */
/* =========================
   RELISH – NOVA REGRA (1kg)
========================= */
if (tipo === "relish") {

  const fator = pesoKg; // 1 receita = 1kg de pepino

  html += `<tr><th colspan="2">ETAPA 1</th></tr>`;

  html += `<tr><td>Sal</td><td class="qtd">${formatarPeso(35 * fator)}</td></tr>`;
  html += `<tr><td>Cebola</td><td class="qtd">${formatarPeso(125 * fator)}</td></tr>`;
  html += `<tr><td>Pimenta dedo de moça (sem semente)</td><td class="qtd">${formatarPeso(10 * fator)}</td></tr>`;

  html += `<tr><th colspan="2">ETAPA 2</th></tr>`;

  html += `<tr><td>Açúcar</td><td class="qtd">${formatarPeso(280 * fator)}</td></tr>`;
  const litrosVinagre = (300 * fator) / 1000;
  html += `<tr><td>Vinagre de maçã</td><td class="qtd">${formatarLitros(litrosVinagre)}</td></tr>`;
  html += `<tr><td>Alho</td><td class="qtd">${formatarPeso(4 * fator)}</td></tr>`;
  html += `<tr><td>Açafrão</td><td class="qtd">${(0.5 * fator)} colheres de café</td></tr>`;
  html += `<tr><td>Coentro em grão</td><td class="qtd">${(1 * fator)} colheres de café</td></tr>`;
  html += `<tr><td>Mostarda em grão</td><td class="qtd">${(1 * fator)} colheres de café</td></tr>`;

  totalReceitaG = pesoKg * 1000;
}

    html += `
      <tr>
        <th>Peso total da receita</th>
        <th>${(totalReceitaG / 1000).toFixed(2)} kg</th>
      </tr>
    </table>
    `;

    document.getElementById("resultado").innerHTML = html;

    salvarHistorico({
      responsavel,
      tipo,
      pesoKg,
      data: new Date().toLocaleString(),
      receitaHTML: html
    });

    nextScreen();

  }, 1200);
}

/*********************************
 HISTÓRICO
*********************************/
function salvarHistorico(dados) {
  const historico = JSON.parse(localStorage.getItem("historicoDefumados")) || [];
  historico.push(dados);
  localStorage.setItem("historicoDefumados", JSON.stringify(historico));
}

function abrirHistorico() {
  montarHistorico();
  nextScreen();
}

function montarHistorico() {
  const lista = document.getElementById("listaHistorico");
  const historico = JSON.parse(localStorage.getItem("historicoDefumados")) || [];

  if (historico.length === 0) {
    lista.innerHTML = "<p>Nenhuma receita registrada.</p>";
    return;
  }

  let html = "";

  historico.slice().reverse().forEach((item, index) => {
    html += `
      <div class="card-historico">
        <strong>${item.tipo.toUpperCase()}</strong><br>
        ${item.pesoKg} kg<br>
        <small>${item.data}</small><br>
        <em>${item.responsavel}</em><br><br>
        <button class="btn mini" onclick="verReceita(${historico.length - 1 - index})">
          Ver Receita
        </button>
      </div>
    `;
  });

  lista.innerHTML = html;
}

function verReceita(index) {
  const historico = JSON.parse(localStorage.getItem("historicoDefumados")) || [];
  document.getElementById("resultado").innerHTML = historico[index].receitaHTML;
  telaAtual = 4;
  slider.style.transform = `translateX(-${telaAtual * 100}vw)`;
}
