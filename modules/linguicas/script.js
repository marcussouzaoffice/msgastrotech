/*********************************
 * CONFIGURAÇÕES DE MEDIDAS
 *********************************/
const ingredientesLiquidos = [
  'Água',
  'Leite',
  'Cerveja',
  'Vinho tinto'
];

/*********************************
 * CONTROLE DE TELAS (SLIDER)
 *********************************/
let telaAtual = 0;
const slider = document.querySelector('.slider');

function nextScreen() {
  telaAtual++;
  slider.style.transform = `translateX(-${telaAtual * 100}vw)`;
}

function resetar() {
  telaAtual = 0;
  slider.style.transform = `translateX(0)`;
}

function novaReceita() {
  telaAtual = 2; // TELA "GERAR RECEITA"
  slider.style.transform = `translateX(-${telaAtual * 100}vw)`;
}

function irInicio() {
  telaAtual = 0;
  slider.style.transform = `translateX(0)`;
}


/*********************************
 * CAMPOS DINÂMICOS
 *********************************/
function atualizarCampos() {
  const tipo = document.getElementById('tipoProteina').value;
  document.getElementById('camposFrango').classList.add('hidden');
  document.getElementById('campoUnico').classList.add('hidden');

  if (tipo === 'frango') {
    document.getElementById('camposFrango').classList.remove('hidden');
  } else if (tipo) {
    document.getElementById('campoUnico').classList.remove('hidden');
  }

  carregarSabores(tipo);
}

function carregarSabores(tipo) {
  const sabor = document.getElementById('sabor');
  sabor.innerHTML = `<option value="">Sabor da linguiça</option>`;

  const sabores = {
    frango: ['Goiana', 'Frangolone', 'Frangalho', 'Marguerita'],
    bovina: ['Mandaka', 'Nordestina', 'Cuiabana', 'Costela Angus'],
    suina: [
      'Bierwurst', 'Clássica', 'Rapadura', 'Pimenta Biquinho',
      'Queijo Coalho', 'Queijo Picante', 'Apimentada',
      'Suave', 'Salsicha Parrilheira', 'Apimentada DM'
    ]
  };

  sabores[tipo]?.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s;
    opt.textContent = s;
    sabor.appendChild(opt);
  });
}

/*********************************
 * RECEITAS (BASE POR KG)
 *********************************/
const receitas = {

  frango: {
    Goiana: [
      { nome: 'Água', tipo: '%', valor: 30 },
      { nome: 'Sal', tipo: '%', valor: 2 },
      { nome: 'Alho in natura', tipo: '%', valor: 1 },
      { nome: 'Liga Gel', tipo: '%', valor: 0.5 },
      { nome: 'Cura', tipo: '%', valor: 0.25 },
      { nome: 'Pimenta bode', tipo: 'gkg', valor: 2 },
      { nome: 'Pequi in natura', tipo: '%', valor: 10 },
      { nome: 'Cebolinha', tipo: 'gosto' }
    ],
    Frangolone: [
      { nome: 'Água', tipo: '%', valor: 30 },
      { nome: 'Sal', tipo: '%', valor: 2 },
      { nome: 'Alho in natura', tipo: '%', valor: 1 },
      { nome: 'Liga Gel', tipo: '%', valor: 0.5 },
      { nome: 'Cura', tipo: '%', valor: 0.25 },
      { nome: 'Queijo coalho', tipo: 'gkg', valor: 70 },
      { nome: 'Queijo provolone', tipo: 'gkg', valor: 70 },
      { nome: 'Manjerona', tipo: 'gkg', valor: 2 }
    ],
    Frangalho: [
      { nome: 'Água', tipo: '%', valor: 30 },
      { nome: 'Sal', tipo: '%', valor: 2 },
      { nome: 'Alho in natura', tipo: '%', valor: 1 },
      { nome: 'Liga Gel', tipo: '%', valor: 0.5 },
      { nome: 'Cura', tipo: '%', valor: 0.25 },
      { nome: 'Manjerona', tipo: 'gkg', valor: 2 },
      { nome: 'Oh My Garlic', tipo: 'gkg', valor: 150 },
      { nome: 'Alho poró', tipo: 'gkg', valor: 60 }
    ],
    Marguerita: [
      { nome: 'Água', tipo: '%', valor: 30 },
      { nome: 'Bacon', tipo: '%', valor: 25 },
      { nome: 'Sal', tipo: '%', valor: 2 },
      { nome: 'Alho in natura', tipo: '%', valor: 1 },
      { nome: 'Liga Gel', tipo: '%', valor: 0.5 },
      { nome: 'Cura', tipo: '%', valor: 0.25 },
      { nome: 'Pimenta bode', tipo: 'gkg', valor: 2 },
      { nome: 'Tomate', tipo: 'gkg', valor: 130 },
      { nome: 'Queijo coalho', tipo: 'gkg', valor: 140 },
      { nome: 'Manjericão', tipo: 'gosto' }
    ]
  },

  bovina: {
    Mandaka: [
      { nome: 'Leite', tipo: '%', valor: 40 },
      { nome: 'Água', tipo: '%', valor: 10 },
      { nome: 'Sal', tipo: '%', valor: 0.5 },
      { nome: 'Alho in natura', tipo: '%', valor: 1.3 },
      { nome: 'Liga Gel', tipo: '%', valor: 0.5 },
      { nome: 'Cura', tipo: '%', valor: 0.25 },
      { nome: 'Pimenta bode', tipo: 'gkg', valor: 2 },
      { nome: 'Queijo coalho', tipo: 'gkg', valor: 120 },
      { nome: 'Cebolinha', tipo: 'gosto' }
    ],
    Nordestina: [
      { nome: 'Leite', tipo: '%', valor: 40 },
      { nome: 'Água', tipo: '%', valor: 10 },
      { nome: 'Sal', tipo: '%', valor: 0.5 },
      { nome: 'Alho in natura', tipo: '%', valor: 1.3 },
      { nome: 'Liga Gel', tipo: '%', valor: 0.5 },
      { nome: 'Cura', tipo: '%', valor: 0.25 },
      { nome: 'Pimenta bode', tipo: 'gkg', valor: 2 },
      { nome: 'Queijo coalho', tipo: 'gkg', valor: 120 },
      { nome: 'Manteiga de garrafa', tipo: '%', valor: 5 },
      { nome: 'Salsa', tipo: 'gosto' }
    ],
    Cuiabana: [
      { nome: 'Leite', tipo: '%', valor: 40 },
      { nome: 'Sal', tipo: '%', valor: 2 },
      { nome: 'Alho in natura', tipo: '%', valor: 1 },
      { nome: 'Liga Gel', tipo: '%', valor: 0.5 },
      { nome: 'Cura', tipo: '%', valor: 0.25 },
      { nome: 'Pimenta bode', tipo: 'gkg', valor: 2 },
      { nome: 'Queijo coalho', tipo: 'gkg', valor: 140 },
      { nome: 'Azeitona', tipo: 'gkg', valor: 100 },
      { nome: 'Cebolinha', tipo: 'gosto' },
      { nome: 'Salsa', tipo: 'gosto' }
    ],
    'Costela Angus': [
      { nome: 'Água', tipo: '%', valor: 30 },
      { nome: 'Sal', tipo: '%', valor: 2 },
      { nome: 'Alho in natura', tipo: '%', valor: 1 },
      { nome: 'Chimichurri', tipo: '%', valor: 1 },
      { nome: 'Liga Gel', tipo: '%', valor: 0.5 },
      { nome: 'Cura', tipo: '%', valor: 0.25 },
      { nome: 'Pimenta bode', tipo: 'gkg', valor: 2 }
    ]
  },

  suina: {
    Bierwurst: [
      { nome: 'Toucinho', tipo: '%', valor: 15 },
      { nome: 'Água', tipo: '%', valor: 14 },
      { nome: 'Cerveja', tipo: '%', valor: 16 },
      { nome: 'Alho in natura', tipo: '%', valor: 1.3 },
      { nome: 'Liga Gel', tipo: '%', valor: 0.5 },
      { nome: 'Cura', tipo: '%', valor: 0.25 },
      { nome: 'Queijo coalho', tipo: 'gkg', valor: 140 },
      { nome: 'Pimenta bode', tipo: 'gkg', valor: 2 }
    ],
      'Clássica': [
    { nome: 'Toucinho', tipo: '%', valor: 15 },
    { nome: 'Água', tipo: '%', valor: 35 },
    { nome: 'Sal', tipo: '%', valor: 2.4 },
    { nome: 'Alho in natura', tipo: '%', valor: 1.3 },
    { nome: 'Liga Gel', tipo: '%', valor: 0.5 },
    { nome: 'Cura', tipo: '%', valor: 0.25 },
    { nome: 'Pimenta bode', tipo: 'gkg', valor: 2 }
  ],

  Rapadura: [
    { nome: 'Toucinho', tipo: '%', valor: 15 },
    { nome: 'Água', tipo: '%', valor: 35 },
    { nome: 'Sal', tipo: '%', valor: 2.4 },
    { nome: 'Alho in natura', tipo: '%', valor: 1.3 },
    { nome: 'Liga Gel', tipo: '%', valor: 0.5 },
    { nome: 'Cura', tipo: '%', valor: 0.25 },
    { nome: 'Pimenta bode', tipo: 'gkg', valor: 2 },
    { nome: 'Rapadura', tipo: 'gkg', valor: 150 },
    { nome: 'Bacon', tipo: 'gkg', valor: 100 }
  ],

  'Pimenta Biquinho': [
    { nome: 'Toucinho', tipo: '%', valor: 15 },
    { nome: 'Água', tipo: '%', valor: 35 },
    { nome: 'Sal', tipo: '%', valor: 2.4 },
    { nome: 'Alho in natura', tipo: '%', valor: 1.3 },
    { nome: 'Liga Gel', tipo: '%', valor: 0.5 },
    { nome: 'Cura', tipo: '%', valor: 0.25 },
    { nome: 'Pimenta bode', tipo: 'gkg', valor: 2 },
    { nome: 'Pimenta biquinho', tipo: 'gkg', valor: 50 }
  ],

  'Queijo Coalho': [
    { nome: 'Toucinho', tipo: '%', valor: 15 },
    { nome: 'Água', tipo: '%', valor: 35 },
    { nome: 'Sal', tipo: '%', valor: 2.4 },
    { nome: 'Alho in natura', tipo: '%', valor: 1.3 },
    { nome: 'Liga Gel', tipo: '%', valor: 0.5 },
    { nome: 'Cura', tipo: '%', valor: 0.25 },
    { nome: 'Pimenta bode', tipo: 'gkg', valor: 2 },
    { nome: 'Queijo coalho', tipo: 'gkg', valor: 120 }
  ],

  'Queijo Picante': [
    { nome: 'Toucinho', tipo: '%', valor: 15 },
    { nome: 'Água', tipo: '%', valor: 35 },
    { nome: 'Sal', tipo: '%', valor: 2.4 },
    { nome: 'Alho in natura', tipo: '%', valor: 1.3 },
    { nome: 'Liga Gel', tipo: '%', valor: 0.5 },
    { nome: 'Cura', tipo: '%', valor: 0.25 },
    { nome: 'Pimenta bode', tipo: 'gkg', valor: 2 },
    { nome: 'Queijo coalho', tipo: 'gkg', valor: 120 },
    { nome: 'Pimenta dedo de moça', tipo: 'unidkg', valor: 1 },
    { nome: 'Sálvia', tipo: 'gosto' }
  ],

  Apimentada: [
    { nome: 'Toucinho', tipo: '%', valor: 15 },
    { nome: 'Água', tipo: '%', valor: 35 },
    { nome: 'Sal', tipo: '%', valor: 2.4 },
    { nome: 'Alho in natura', tipo: '%', valor: 1.3 },
    { nome: 'Liga Gel', tipo: '%', valor: 0.5 },
    { nome: 'Cura', tipo: '%', valor: 0.25 },
    { nome: 'Pimenta bode', tipo: 'gkg', valor: 2 },
    { nome: 'Pimenta dedo de moça', tipo: 'unidkg', valor: 2 }
  ],

  Suave: [
    { nome: 'Toucinho', tipo: '%', valor: 15 },
    { nome: 'Água', tipo: '%', valor: 35 },
    { nome: 'Sal', tipo: '%', valor: 2.4 },
    { nome: 'Alho in natura', tipo: '%', valor: 1.3 },
    { nome: 'Liga Gel', tipo: '%', valor: 0.5 },
    { nome: 'Cura', tipo: '%', valor: 0.25 },
    { nome: 'Pimenta bode', tipo: 'gkg', valor: 2 },
    { nome: 'Pimenta dedo de moça', tipo: 'unidkg', valor: 1 },
    { nome: 'Salsa', tipo: 'gosto' }
  ],

  'Salsicha Parrilheira': [
    { nome: 'Toucinho', tipo: '%', valor: 15 },
    { nome: 'Água', tipo: '%', valor: 35 },
    { nome: 'Sal', tipo: '%', valor: 2.4 },
    { nome: 'Alho in natura', tipo: '%', valor: 1.3 },
    { nome: 'Liga Gel', tipo: '%', valor: 0.5 },
    { nome: 'Cura', tipo: '%', valor: 0.25 },
    { nome: 'Pimenta bode', tipo: 'gkg', valor: 2 },
    { nome: 'Erva doce', tipo: '%', valor: 0.1 },
    { nome: 'Salsa', tipo: 'gosto' }
  ],

    'Apimentada DM': [
      { nome: 'Toucinho', tipo: '%', valor: 15 },
      { nome: 'Água', tipo: '%', valor: 30 },
      { nome: 'Sal', tipo: '%', valor: 2.2 },
      { nome: 'Alho in natura', tipo: '%', valor: 1 },
      { nome: 'Liga Gel', tipo: '%', valor: 0.45 },
      { nome: 'Cura', tipo: '%', valor: 0.25 },
      { nome: 'Pimenta calabresa', tipo: '%', valor: 0.7 },
      { nome: 'Açúcar mascavo', tipo: '%', valor: 1 },
      { nome: 'Vinho tinto', tipo: '%', valor: 1 },
      { nome: 'Erva doce', tipo: '%', valor: 0.1 }
    ]
  }
};

/*********************************
 * FUNÇÃO AUXILIAR – FORMATAR PESO
 *********************************/
function formatarPeso(pesoGramas) {
  if (pesoGramas >= 1000) {
    return (pesoGramas / 1000).toFixed(2) + ' kg';
  }
  return Math.round(pesoGramas) + ' g';
}

/*********************************
 * GERAR RECEITA
 *********************************/
function gerarReceita() {
  const tipo = document.getElementById('tipoProteina').value;
  const sabor = document.getElementById('sabor').value;

  let totalKg = 0;

  if (tipo === 'frango') {
    totalKg =
      (Number(document.getElementById('peito').value) || 0) +
      (Number(document.getElementById('coxa').value) || 0);
  } else {
    totalKg = Number(document.getElementById('proteinaUnica').value) || 0;
  }

  if (!tipo || !sabor || totalKg <= 0) {
    alert('Preencha todos os campos corretamente.');
    return;
  }

  nextScreen(); // LOADING

  setTimeout(() => {
    const lista = receitas[tipo][sabor];

    // 🔹 começa com o peso da proteína
    let totalReceitaGramas = totalKg * 1000;

    let html = `<h3>${sabor} (${totalKg} kg)</h3><table>
      <tr><th>Ingrediente</th><th>Quantidade</th></tr>`;

    lista.forEach(item => {
      let qtd = '';
      let pesoItemGramas = 0;

      if (item.tipo === '%') {
        const base = (item.valor / 100) * totalKg * 1000;
        pesoItemGramas = base;

        if (ingredientesLiquidos.includes(item.nome)) {
          qtd = base >= 1000
            ? (Math.round(base / 100) / 10) + ' L'
            : Math.round(base) + ' ml';
        } else {
          qtd = formatarPeso(base);
        }
      } 
      else if (item.tipo === 'gkg') {
        pesoItemGramas = item.valor * totalKg;
        qtd = formatarPeso(pesoItemGramas);
      } 
      else if (item.tipo === 'gosto') {
        qtd = 'A gosto';
        pesoItemGramas = 0;
      }

      totalReceitaGramas += pesoItemGramas;

      html += `<tr><td>${item.nome}</td><td class="qtd">${qtd}</td></tr>`;
    });

    // 🔹 peso total da receita
    const totalReceitaKg = totalReceitaGramas / 1000;

    // 🔹 NEW COR → 2,5 g por kg da receita
    const newCorGramas = Math.round(totalReceitaKg * 2.5);

// 🔹 NEW COR → entra como ingrediente
html += `
  <tr>
    <td>New Cor</td>
    <td class="qtd">${newCorGramas} g</td>
  </tr>
`;

// 🔹 resumo final
html += `
  <tr class="total">
    <th>Peso total da receita</th>
    <th>${totalReceitaKg.toFixed(2)} kg</th>
  </tr>
`;

    html += '</table>';

    document.getElementById('resultado').innerHTML = html;

    salvarHistorico({
      responsavel: document.getElementById('responsavel').value,
      tipo: tipo,
      sabor: sabor,
      peso: totalKg,
      pesoTotalReceita: totalReceitaKg,
      newCor: newCorGramas,
      data: new Date().toLocaleString(),
      receitaHTML: html
    });

    nextScreen(); // RESULTADO
  }, 1800);
}

function salvarHistorico(dados) {
  const historico = JSON.parse(localStorage.getItem('historicoSchetini')) || [];
  historico.push(dados);
  localStorage.setItem('historicoSchetini', JSON.stringify(historico));
}

function abrirHistorico() {
  montarHistorico();
  nextScreen();
}

function voltar() {
  telaAtual--;
  slider.style.transform = `translateX(-${telaAtual * 100}vw)`;
}

function montarHistorico() {
  const lista = document.getElementById('listaHistorico');
  const historico = JSON.parse(localStorage.getItem('historicoSchetini')) || [];

  if (historico.length === 0) {
    lista.innerHTML = '<p>Nenhuma receita registrada.</p>';
    return;
  }

  let html = '';

  historico
    .slice()
    .reverse()
    .forEach((item, index) => {
      html += `
        <div class="card-historico">
          <strong>${item.sabor}</strong><br>
          ${item.tipo} • ${item.peso} kg<br>
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
  const historico = JSON.parse(localStorage.getItem('historicoSchetini')) || [];
  document.getElementById('resultado').innerHTML = historico[index].receitaHTML;
  telaAtual = 4; // tela de resultado
  slider.style.transform = `translateX(-${telaAtual * 100}vw)`;
}