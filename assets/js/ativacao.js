
document.addEventListener("DOMContentLoaded", () => {
    carregarAtivacao();
});

async function carregarAtivacao() {
    try {
        // Busca os dados do arquivo JSON
        const resposta = await fetch("../data/ativacao.json");

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar os dados da ativação.");
        }

        const dados = await resposta.json();

        // Atualiza a linha do tempo
        exibirEtapas(dados.etapas);

        // Atualiza a previsão da primeira fatura
        exibirPrevisaoFatura(dados.primeira_fatura_prevista);

    } catch (erro) {
        console.error("Erro ao carregar ativação:", erro);

        const timeline = document.querySelector(".timeline");

        if (timeline) {
            timeline.textContent = "Não foi possível carregar as informações da ativação. Tente novamente.";
        }
    }
}


// EXIBE AS QUATRO ETAPAS DA ATIVAÇÃO

function exibirEtapas(etapas) {
    const timeline = document.querySelector(".timeline");

    if (!timeline) {
        console.error("Elemento .timeline não encontrado.");
        return;
    }

    if (!Array.isArray(etapas) || etapas.length !== 4) {
        timeline.textContent = "Os dados da linha do tempo estão incompletos.";
        return;
    }

    // Limpa as etapas que estavam fixas no HTML
    timeline.replaceChildren();

    etapas.forEach((etapa, indice) => {
        const elemento = document.createElement("div");

        const status = normalizarStatus(etapa.status);

        elemento.classList.add("etapa", status);

        // Marcador da etapa
        const marcador = document.createElement("div");
        marcador.classList.add("marcador");

        const numero = document.createElement("span");

        if (status === "concluida") {
            numero.textContent = "✓";
        } else {
            numero.textContent = indice + 1;
        }

        marcador.appendChild(numero);

        // Conteúdo da etapa
        const conteudo = document.createElement("div");
        conteudo.classList.add("conteudo-etapa");

        const titulo = document.createElement("h3");
        titulo.textContent = etapa.titulo;

        const descricao = document.createElement("p");
        descricao.textContent = etapa.descricao;

        const data = document.createElement("span");
        data.classList.add("data");

        if (status === "concluida") {
            data.textContent = "Concluído em: " + formatarData(etapa.data);
        } else if (status === "ativa") {
            data.textContent = "Previsão: " + formatarData(etapa.previsao);
        } else {
            data.textContent = "Aguardando etapa anterior";
        }

        conteudo.append(titulo, descricao, data);

        // Identifica a etapa atual
        if (status === "ativa") {
            const tag = document.createElement("span");

            tag.classList.add("tag-atual");
            tag.textContent = "ETAPA ATUAL";

            conteudo.appendChild(tag);
        }

        elemento.append(marcador, conteudo);
        timeline.appendChild(elemento);
    });

    atualizarStatusGeral(etapas);
}


// PADRONIZA OS STATUS

function normalizarStatus(status) {
    const valor = String(status || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[\s-]+/g, "_");

    if (["concluida", "concluido", "finalizada", "finalizado"].includes(valor)) {
        return "concluida";
    }

    if (["ativa", "em_andamento", "atual"].includes(valor)) {
        return "ativa";
    }

    return "pendente";
}


// ATUALIZA O STATUS GERAL

function atualizarStatusGeral(etapas) {
    const elementoStatus = document.querySelector(".status");

    if (!elementoStatus) return;

    const existeEtapaAtual = etapas.some(
        etapa => normalizarStatus(etapa.status) === "ativa"
    );

    const todasConcluidas = etapas.every(
        etapa => normalizarStatus(etapa.status) === "concluida"
    );

    if (todasConcluidas) {
        elementoStatus.textContent = "Ativação concluída";
    } else if (existeEtapaAtual) {
        elementoStatus.textContent = "Em andamento";
    } else {
        elementoStatus.textContent = "Aguardando";
    }
}


// EXIBE A PREVISÃO DA PRIMEIRA FATURA

function exibirPrevisaoFatura(data) {
    const elemento = document.querySelector(".aviso-fatura strong");

    if (!elemento) {
        console.error("Elemento da previsão da fatura não encontrado.");
        return;
    }

    elemento.textContent = formatarData(data);

    const titulo = document.querySelector(".aviso-fatura h2");

    if (titulo) {
        titulo.textContent = "Sua 1ª fatura está prevista para:";
    }
}


// FORMATA A DATA PARA DD/MM/AAAA

function formatarData(data) {
    if (!data) return "A definir";

    // Mantém datas já formatadas
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(data)) {
        return data;
    }

    // Converte datas no padrão ISO
    const partes = String(data).split("-");

    if (partes.length === 3) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    return data;
}
