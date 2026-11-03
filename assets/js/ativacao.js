// HU02 · Acompanhamento da ativação
// Lê data/ativacao.json (via api.js) e monta as 3 telas de pages/ativacao.html.
//
// Para ver a tela 3 (serviço ativado) sem mexer no JSON, abra:
//   pages/ativacao.html?simular=ativado

import { buscarAtivacao } from './api.js';

const TOTAL_ETAPAS = 4;

const ICONES = {
  check: '<polyline points="5,12 10,17 19,7"/>',
  relogio: '<circle cx="12" cy="12" r="9"/><polyline points="12,7 12,12 15,14"/>',
  raio: '<polygon points="13,3 5,14 11,14 10,21 18,10 12,10"/>',
  info: '<circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16"/><line x1="12" y1="8" x2="12" y2="8"/>'
};

function svg(nome) {
  return `<svg class="icone" viewBox="0 0 24 24" aria-hidden="true">${ICONES[nome] ?? ''}</svg>`;
}

// Os dados vêm de um JSON local, mas escapamos o texto por boa prática
function esc(texto) {
  return String(texto ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function mostrarTela(id) {
  document.querySelectorAll('.tela').forEach((tela) => {
    tela.hidden = tela.id !== id;
  });
  window.scrollTo(0, 0);
}

function validar(etapas) {
  if (!Array.isArray(etapas) || etapas.length !== TOTAL_ETAPAS) {
    throw new Error(`O JSON precisa ter exatamente ${TOTAL_ETAPAS} etapas.`);
  }
}

function descreverEstado(etapa) {
  if (etapa.status === 'concluida') return 'Concluído';
  if (etapa.status === 'ativa') {
    return etapa.prazoDias ? `Etapa atual · até ${etapa.prazoDias} dias` : 'Etapa atual';
  }
  return 'Aguardando';
}

function montarLinhaTempo(etapas) {
  const marcador = { concluida: 'check', ativa: 'relogio', pendente: 'relogio' };

  document.querySelector('#linha-tempo').innerHTML = etapas
    .map(
      (etapa) => `
        <li class="passo ${esc(etapa.status)}">
          <span class="passo-marcador">${svg(marcador[etapa.status] ?? 'relogio')}</span>
          <div>
            <p class="passo-titulo">${esc(etapa.titulo)}</p>
            <p class="passo-estado">${esc(descreverEstado(etapa))}</p>
          </div>
        </li>`
    )
    .join('');
}

function montarResumo(etapas, indiceAtiva) {
  const todasConcluidas = etapas.every((e) => e.status === 'concluida');
  const posicao = indiceAtiva >= 0 ? indiceAtiva + 1 : todasConcluidas ? TOTAL_ETAPAS : 0;
  const proxima = etapas[indiceAtiva + 1];

  document.querySelector('#anel-texto').textContent = `${posicao}/${TOTAL_ETAPAS}`;
  document.querySelector('#anel-progresso').style.strokeDashoffset = 100 - (posicao / TOTAL_ETAPAS) * 100;

  document.querySelector('#status-titulo').textContent =
    indiceAtiva >= 0 ? etapas[indiceAtiva].titulo : todasConcluidas ? 'Serviço ativado' : 'Aguardando início';
  document.querySelector('#status-proximo').textContent =
    indiceAtiva >= 0 && proxima ? `Próximo: ${proxima.titulo}` : '';
}

function montarEtapaAtual(etapa, indice) {
  document.querySelector('#selo-etapa-texto').textContent = `Etapa ${indice + 1} de ${TOTAL_ETAPAS}`;
  document.querySelector('#etapa-titulo').textContent = etapa.titulo;
  document.querySelector('#etapa-subtitulo').textContent = etapa.subtitulo ?? '';
  document.querySelector('#etapa-prazo').textContent = etapa.prazoDias ?? '—';

  const detalhes = Array.isArray(etapa.detalhes) ? etapa.detalhes : [];
  document.querySelector('#etapa-detalhes').innerHTML = detalhes
    .map(
      (item) => `
        <div class="card card-com-icone">
          <span class="icone-circulo">${svg(item.icone)}</span>
          <div>
            <p class="card-titulo">${esc(item.titulo)}</p>
            <p class="card-texto">${esc(item.texto)}</p>
          </div>
        </div>`
    )
    .join('');
}

function configurarNavegacao(temEtapaAtiva) {
  const botao = document.querySelector('#botao-entender-etapa');
  botao.hidden = !temEtapaAtiva;
  botao.addEventListener('click', () => mostrarTela('tela-etapa-atual'));
  document.querySelector('#botao-ver-ativado').addEventListener('click', () => mostrarTela('tela-ativado'));  // NOVA LINHA
  document.querySelector('#voltar-etapa').addEventListener('click', () => mostrarTela('tela-acompanhamento'));
   document.querySelector('#voltar-ativado').addEventListener('click', () =>
    mostrarTela(temEtapaAtiva ? 'tela-etapa-atual' : 'tela-acompanhamento')
  );
}

async function iniciar() {
  try {
    const dados = await buscarAtivacao();
    let etapas = dados.etapas;
    validar(etapas);

    // Atalho para conferir a tela 3 (serviço ativado)
    if (new URLSearchParams(location.search).get('simular') === 'ativado') {
      etapas = etapas.map((e) => ({ ...e, status: 'concluida' }));
    }

    const indiceAtiva = etapas.findIndex((e) => e.status === 'ativa');
    const todasConcluidas = etapas.every((e) => e.status === 'concluida');

    if (dados.cliente?.iniciais) {
      document.querySelector('#avatar-iniciais').textContent = dados.cliente.iniciais;
    }

    montarLinhaTempo(etapas);
    montarResumo(etapas, indiceAtiva);
    if (indiceAtiva >= 0) montarEtapaAtual(etapas[indiceAtiva], indiceAtiva);
    configurarNavegacao(indiceAtiva >= 0);

    mostrarTela(todasConcluidas ? 'tela-ativado' : 'tela-acompanhamento');
  } catch (erro) {
    const aviso = document.querySelector('#erro-ativacao');
    aviso.textContent = 'Não foi possível carregar os dados da ativação. O projeto está aberto pelo Live Server?';
    aviso.hidden = false;
    console.error(erro);
  }
}

iniciar();
