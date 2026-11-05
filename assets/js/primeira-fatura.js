// HU03 · Sua primeira fatura
// Lê data/fatura.json (via api.js), calcula o total e a economia e controla
// as 3 telas de pages/primeira-fatura.html.

import { buscarFatura } from './api.js';

const reais = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

// Ícones de linha usados nos cards (o JSON diz qual usar em cada item)
const ICONES = {
  raio: '<polygon points="13,3 5,14 11,14 10,21 18,10 12,10"/>',
  check: '<polyline points="5,12 10,17 19,7"/>',
  recibo: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="9" y1="12" x2="15" y2="12"/>',
  calendario: '<rect x="4" y="5" width="16" height="15" rx="2"/><line x1="4" y1="10" x2="20" y2="10"/><line x1="9" y1="3" x2="9" y2="7"/><line x1="15" y1="3" x2="15" y2="7"/>'
};

const SETA = '<svg class="icone termo-seta" viewBox="0 0 24 24" aria-hidden="true"><polyline points="6,9 12,15 18,9"/></svg>';

function icone(nome) {
  // Os créditos usam o círculo verde, como no wireframe
  const classe = nome === 'check' ? 'icone-circulo icone-circulo-verde' : 'icone-circulo';
  return `<span class="${classe}"><svg class="icone" viewBox="0 0 24 24" aria-hidden="true">${ICONES[nome] ?? ''}</svg></span>`;
}

// "2026-11-15" -> "15/11/2026" (sem usar Date, para não ter problema de fuso horário)
function formatarData(iso) {
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}

// "2026-10" -> "Outubro/2026"
function formatarReferencia(referencia) {
  const [ano, mes] = referencia.split('-');
  return `${MESES[Number(mes) - 1]}/${ano}`;
}

// Valores negativos (créditos) aparecem como "- R$ 37,20"
function formatarValor(valor) {
  return valor < 0 ? `- ${reais.format(Math.abs(valor))}` : reais.format(valor);
}

function mostrarTela(id) {
  document.querySelectorAll('.tela').forEach((tela) => {
    tela.hidden = tela.id !== id;
  });
  window.scrollTo(0, 0);
}

function validar(fatura) {
  if (!Array.isArray(fatura.itens) || fatura.itens.length === 0) {
    throw new Error('O JSON precisa ter a lista "itens" da fatura.');
  }
  if (!fatura.itens.every((item) => Number.isFinite(item.valor))) {
    throw new Error('Todo item da fatura precisa de um "valor" numérico.');
  }
  if (!Number.isFinite(fatura.contaSemBulbe)) {
    throw new Error('O JSON precisa ter "contaSemBulbe" numérico.');
  }
}

function calcularFatura(fatura) {
  const total = fatura.itens.reduce((soma, item) => soma + item.valor, 0);
  const economia = fatura.contaSemBulbe - total;
  return { total, economia };
}

function preencher(seletor, texto) {
  document.querySelectorAll(seletor).forEach((elemento) => {
    elemento.textContent = texto;
  });
}

function montarCliente(cliente) {
  const avatar = document.querySelector('#avatar-iniciais');
  avatar.textContent = cliente.iniciais;
  avatar.setAttribute('aria-label', cliente.nomeCompleto);
}

// Tela 1: card principal + resumo do valor
function montarResumo(fatura, { total, economia }) {
  document.querySelector('#mes-referencia').textContent = formatarReferencia(fatura.referencia);
  document.querySelector('#status-fatura').textContent = fatura.status;
  document.querySelector('#valor-total').textContent = reais.format(total);
  document.querySelector('#consumo-kwh').textContent = `${fatura.consumoKwh} kWh`;
  document.querySelector('#valor-economia').textContent = reais.format(economia);
  document.querySelector('#valor-sem-bulbe').textContent = reais.format(fatura.contaSemBulbe);

  preencher('.data-vencimento', formatarData(fatura.vencimento));
  preencher('.valor-total', reais.format(total));

  document.querySelector('#lista-resumo').innerHTML = fatura.itens
    .map((item) => `<li><span>${item.nome}</span><strong>${formatarValor(item.valor)}</strong></li>`)
    .join('');
}

// Tela 2: cada item com explicação curta e valor
function montarComposicao(fatura) {
  document.querySelector('#lista-composicao').innerHTML = fatura.itens
    .map((item) => `
      <li class="card card-com-icone">
        ${icone(item.icone)}
        <div class="item-info">
          <p class="card-titulo">${item.nome}</p>
          <p class="card-texto">${item.resumo}</p>
        </div>
        <strong class="item-valor ${item.valor < 0 ? 'negativo' : ''}">${formatarValor(item.valor)}</strong>
      </li>`)
    .join('');
}

// Tela 3: termos que abrem e fecham ao tocar
function montarTermos(termos, fatura) {
  // Troca {consumoKwh} e {vencimento} do texto pelos dados da fatura
  const completar = (texto) => texto
    .replace('{consumoKwh}', fatura.consumoKwh)
    .replace('{vencimento}', formatarData(fatura.vencimento));

  const lista = document.querySelector('#lista-termos');

  lista.innerHTML = termos
    .map((termo, i) => `
      <li class="card termo">
        <button type="button" class="termo-botao" aria-expanded="false" aria-controls="termo-${i}">
          ${icone(termo.icone)}
          <span class="item-info">
            <span class="card-titulo">${termo.titulo}</span>
            <span class="card-texto">${termo.resumo}</span>
          </span>
          ${SETA}
        </button>
        <p class="termo-detalhe" id="termo-${i}" hidden>${completar(termo.detalhe)}</p>
      </li>`)
    .join('');

  // Um único "ouvinte" na lista cuida de todos os botões
  lista.addEventListener('click', (evento) => {
    const botao = evento.target.closest('.termo-botao');
    if (!botao) return;

    const aberto = botao.getAttribute('aria-expanded') === 'true';
    botao.setAttribute('aria-expanded', String(!aberto));
    document.getElementById(botao.getAttribute('aria-controls')).hidden = aberto;
  });
}

function configurarNavegacao() {
  document.querySelector('#botao-entender').addEventListener('click', () => mostrarTela('tela-composicao'));
  document.querySelector('#voltar-composicao').addEventListener('click', () => mostrarTela('tela-fatura'));
  document.querySelector('#botao-termos').addEventListener('click', () => mostrarTela('tela-termos'));
  document.querySelector('#voltar-termos').addEventListener('click', () => mostrarTela('tela-composicao'));
}

async function iniciar() {
  try {
    const dados = await buscarFatura();
    validar(dados.fatura);

    const calculo = calcularFatura(dados.fatura);

    montarCliente(dados.cliente);
    montarResumo(dados.fatura, calculo);
    montarComposicao(dados.fatura);
    montarTermos(dados.termos, dados.fatura);
    configurarNavegacao();
  } catch (erro) {
    const aviso = document.querySelector('#erro-fatura');
    aviso.textContent = 'Não foi possível carregar a sua fatura. O projeto está aberto pelo Live Server?';
    aviso.hidden = false;
    document.querySelector('#botao-entender').hidden = true;
    console.error(erro);
  }
}

iniciar();
