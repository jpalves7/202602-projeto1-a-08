
/* ==========================================
   HU04 - Pagamento da fatura
   ========================================== */

// Codigos ficticios para demonstracao
const codigoPix = "PIX-FICTICIO-BULBE-2026-001";

const codigoBoleto =
  "00000.00000 00000.000000 00000.000000 0 00000000000000";

// Elementos da pagina
const valorFatura = document.getElementById("valor-fatura");
const vencimentoFatura = document.getElementById("vencimento-fatura");
const statusFatura = document.getElementById("status-fatura");
const diasVencimento = document.getElementById("dias-vencimento");
const alertaVencimento = document.getElementById("alerta-vencimento");
const textoAlerta = document.getElementById("texto-alerta");
const erroPagamento = document.getElementById("erro-pagamento");

// Formas de pagamento
const opcaoPix = document.getElementById("opcao-pix");
const opcaoBoleto = document.getElementById("opcao-boleto");
const areaPix = document.getElementById("area-pix");
const areaBoleto = document.getElementById("area-boleto");

// Botoes e mensagens
const copiarPix = document.getElementById("copiar-pix");
const copiarBoleto = document.getElementById("copiar-boleto");
const mensagemPix = document.getElementById("mensagem-pix");
const mensagemBoleto = document.getElementById("mensagem-boleto");
const ativarLembrete = document.getElementById("ativar-lembrete");
const mensagemLembrete = document.getElementById("mensagem-lembrete");

// Formatar valores em reais
function formatarMoeda(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

// Converter uma data do JSON para o formato brasileiro
function converterData(dataTexto) {
  const [ano, mes, dia] = dataTexto.split("-").map(Number);
  return new Date(ano, mes - 1, dia);
}

function formatarData(data) {
  return data.toLocaleDateString("pt-BR");
}

// Calcular dias restantes sem considerar as horas
function calcularDiasRestantes(vencimento) {
  const hoje = new Date();

  const dataHoje = Date.UTC(
    hoje.getFullYear(),
    hoje.getMonth(),
    hoje.getDate()
  );

  const dataVencimento = Date.UTC(
    vencimento.getFullYear(),
    vencimento.getMonth(),
    vencimento.getDate()
  );

  const diferenca = dataVencimento - dataHoje;

  return Math.round(diferenca / (1000 * 60 * 60 * 24));
}

// Carregar os dados da fatura
async function carregarFatura() {
  try {
    const resposta = await fetch("../data/fatura.json");

    if (!resposta.ok) {
      throw new Error("Erro ao carregar a fatura.");
    }

    const dados = await resposta.json();
    const fatura = dados.fatura;

    // Somar os itens da fatura
    const total = fatura.itens.reduce((soma, item) => {
      return soma + item.valor;
    }, 0);

    const vencimento = converterData(fatura.vencimento);
    const dias = calcularDiasRestantes(vencimento);

    if (dias < 3) {
      ativarLembrete.disabled = true;

      if (dias < 0) {
        ativarLembrete.textContent = "Fatura vencida";
      } else {
        ativarLembrete.textContent =
          "Prazo para lembrete encerrado";
      }
    }


    valorFatura.textContent = formatarMoeda(total);
    vencimentoFatura.textContent = formatarData(vencimento);
    statusFatura.textContent = fatura.status;

    // Informar quantos dias faltam
    if (dias > 1) {
      diasVencimento.textContent =
        `Faltam ${dias} dias para o vencimento.`;
    } else if (dias === 1) {
      diasVencimento.textContent =
        "Falta 1 dia para o vencimento.";
    } else if (dias === 0) {
      diasVencimento.textContent = "Sua fatura vence hoje!";
    } else {
      diasVencimento.textContent =
        `Sua fatura venceu há ${Math.abs(dias)} dia(s).`;
    }

    // Alerta de vencimento proximo
    if (dias >= 0 && dias <= 3) {
      alertaVencimento.hidden = false;
      textoAlerta.textContent =
        "Atenção! Sua fatura está próxima do vencimento.";
    } else if (dias < 0) {
      alertaVencimento.hidden = false;
      textoAlerta.textContent =
        "Atenção! Sua fatura está vencida.";
    }

  } catch (erro) {
    erroPagamento.hidden = false;
    erroPagamento.textContent =
      "Não foi possível carregar os dados da fatura.";
    console.error(erro);
  }
}

// Alternar entre PIX e boleto
function mostrarFormaPagamento(forma) {
  const usarPix = forma === "pix";

  areaPix.hidden = !usarPix;
  areaBoleto.hidden = usarPix;

  opcaoPix.classList.toggle("ativo", usarPix);
  opcaoBoleto.classList.toggle("ativo", !usarPix);

  opcaoPix.setAttribute("aria-pressed", String(usarPix));
  opcaoBoleto.setAttribute("aria-pressed", String(!usarPix));

  mensagemPix.hidden = true;
  mensagemBoleto.hidden = true;
}

// Copiar um codigo para a area de transferencia
async function copiarCodigo(codigo, mensagem) {
  try {
    await navigator.clipboard.writeText(codigo);
    mensagem.textContent = "Código copiado!";
  } catch (erro) {
    mensagem.textContent =
      "Não foi possível copiar. Selecione o código manualmente.";
  }

  mensagem.hidden = false;
}

// Eventos dos botoes
opcaoPix.addEventListener("click", () => {
  mostrarFormaPagamento("pix");
});

opcaoBoleto.addEventListener("click", () => {
  mostrarFormaPagamento("boleto");
});

copiarPix.addEventListener("click", () => {
  copiarCodigo(codigoPix, mensagemPix);
});

copiarBoleto.addEventListener("click", () => {
  copiarCodigo(codigoBoleto, mensagemBoleto);
});

// Simular a ativacao de um lembrete
ativarLembrete.addEventListener("click", () => {
  mensagemLembrete.textContent =
    "Lembrete ativado para 3 dias antes do vencimento! " +
    "(Simulação: nenhuma notificação será enviada.)";

  mensagemLembrete.hidden = false;
  ativarLembrete.disabled = true;
  ativarLembrete.textContent = "Lembrete ativado";
});

// Mostrar os codigos ficticios na tela
document.getElementById("codigo-pix").textContent = codigoPix;
document.getElementById("codigo-boleto").textContent = codigoBoleto;

// Iniciar a pagina
carregarFatura();
