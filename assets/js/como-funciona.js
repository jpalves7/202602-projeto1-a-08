// HU01 · Como a Bulbe funciona
// Lê data/como-funciona.json (via api.js), calcula a economia e controla
// as 3 telas de pages/como-funciona.html.

import { buscarComoFunciona } from './api.js';

const reais = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const reaisSemCentavos = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0
});

function mostrarTela(id) {
  document.querySelectorAll('.tela').forEach((tela) => {
    tela.hidden = tela.id !== id;
  });
  window.scrollTo(0, 0);
}

function validar({ contaAntes, contaCemig, descontoPercentual }) {
  const valores = [contaAntes, contaCemig, descontoPercentual];
  if (!valores.every(Number.isFinite) || contaAntes <= 0) {
    throw new Error('O JSON precisa ter contaAntes, contaCemig e descontoPercentual numéricos.');
  }
  if (contaCemig + (contaAntes * descontoPercentual) / 100 > contaAntes) {
    throw new Error('A conta Cemig não pode ser maior que o total com a Bulbe.');
  }
}

function calcularEconomia({ contaAntes, contaCemig, descontoPercentual }) {
  const economia = (contaAntes * descontoPercentual) / 100;
  const comBulbe = contaAntes - economia;

  return {
    economia,
    comBulbe,
    contaBulbe: comBulbe - contaCemig,
    economiaAnual: economia * 12
  };
}

function montarCliente(cliente) {
  document.querySelectorAll('.cliente-nome').forEach((nome) => {
    nome.textContent = cliente.nome;
  });

  const avatar = document.querySelector('#avatar-iniciais');
  avatar.textContent = cliente.iniciais;
  avatar.setAttribute('aria-label', cliente.nomeCompleto);
}

function montarEconomia(simulacao) {
  const { contaAntes, contaCemig, descontoPercentual } = simulacao;
  const { economia, comBulbe, contaBulbe, economiaAnual } = calcularEconomia(simulacao);

  document.querySelector('#valor-antes').textContent = reais.format(contaAntes);
  document.querySelector('#valor-com-bulbe').textContent = reais.format(comBulbe);
  document.querySelector('#valor-cemig').textContent = reais.format(contaCemig);
  document.querySelector('#valor-bulbe').textContent = reais.format(contaBulbe);
  document.querySelector('#valor-economia').textContent = reais.format(economia);
  document.querySelector('#percentual-economia').textContent = `${descontoPercentual}%`;
  document.querySelector('#economia-anual').textContent = reaisSemCentavos.format(economiaAnual);

  // A tela 3 repete a economia da tela 2
  document.querySelector('.valor-economia').textContent = reais.format(economia);

  // As barras são proporcionais à conta de antes
  document.querySelector('#barra-cemig').style.width = `${(contaCemig / contaAntes) * 100}%`;
  document.querySelector('#barra-bulbe').style.width = `${(contaBulbe / contaAntes) * 100}%`;
}

function configurarNavegacao() {
  document.querySelector('#botao-ver-economia').addEventListener('click', () => mostrarTela('tela-economia'));
  document.querySelector('#voltar-economia').addEventListener('click', () => mostrarTela('tela-como-funciona'));
  document.querySelector('#botao-entendi').addEventListener('click', () => mostrarTela('tela-confirmacao'));
  document.querySelector('#voltar-confirmacao').addEventListener('click', () => mostrarTela('tela-economia'));
}

function configurarConfirmacao() {
  const form = document.querySelector('#form-entendimento');
  const aviso = document.querySelector('#erro-entendimento');
  const itens = [...form.querySelectorAll('input[name="entendimento"]')];

  form.addEventListener('change', () => {
    if (itens.every((item) => item.checked)) aviso.hidden = true;
  });

  form.addEventListener('submit', (evento) => {
    evento.preventDefault();

    if (!itens.every((item) => item.checked)) {
      aviso.hidden = false;
      return;
    }
    window.location.href = 'ativacao.html';
  });
}

async function iniciar() {
  try {
    const dados = await buscarComoFunciona();
    validar(dados.simulacao);

    montarCliente(dados.cliente);
    montarEconomia(dados.simulacao);
    configurarNavegacao();
    configurarConfirmacao();
  } catch (erro) {
    const aviso = document.querySelector('#erro-como-funciona');
    aviso.textContent = 'Não foi possível carregar os seus dados. O projeto está aberto pelo Live Server?';
    aviso.hidden = false;
    document.querySelector('#botao-ver-economia').hidden = true;
    console.error(erro);
  }
}

iniciar();
