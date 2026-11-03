
// Aguarda o carregamento completo do HTML
document.addEventListener("DOMContentLoaded", carregarAtivacao);


// FUNÇÃO PRINCIPAL
async function carregarAtivacao() {

    try {

        // Busca os dados do arquivo JSON
        const resposta = await fetch("../data/ativacao.json");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar o arquivo JSON.");
        }

        const dados = await resposta.json();

        // Exibe as etapas na tela
        exibirEtapas(dados.etapas);

        // Exibe a previsão da primeira fatura
        exibirPrevisaoFatura(dados.primeira_fatura_prevista);

        // Atualiza o status geral
        atualizarStatusGeral(dados.etapas);

    } catch (erro) {

        console.error("Erro:", erro);

        const timeline = document.querySelector(".timeline");

        if (timeline) {
            timeline.textContent =
                "Não foi possível carregar os dados da ativação.";
        }
    }
}


// EXIBIR AS ETAPAS
function exibirEtapas(etapas) {

    const timeline = document.querySelector(".timeline");

    if (!timeline) {
        console.error("Linha do tempo não encontrada.");
        return;
    }

    if (!Array.isArray(etapas) || etapas.length !== 4) {
        throw new Error("O JSON precisa conter exatamente quatro etapas.");
    }

    // Remove as etapas fixas do HTML
    timeline.replaceChildren();

    etapas.forEach((etapa, indice) => {

        // Cria o elemento principal
        const elemento = document.createElement("div");

        elemento.classList.add("etapa", etapa.status);

        // Cria o marcador
        const marcador = document.createElement("div");
        marcador.classList.add("marcador");

        const numero = document.createElement("span");

        if (etapa.status === "concluida") {
            numero.textContent = "✓";
        } else {
            numero.textContent = indice + 1;
        }

        marcador.appendChild(numero);

        // Cria o conteúdo
        const conteudo = document.createElement("div");
        conteudo.classList.add("conteudo-etapa");

        const titulo = document.createElement("h3");
        titulo.textContent = etapa.titulo;

        const descricao = document.createElement("p");
        descricao.textContent = etapa.descricao;

        const data = document.createElement("span");
        data.classList.add("data");

        // Define a informação de acordo com o status
        if (etapa.status === "concluida") {

            data.textContent =
                "Concluído em: " + formatarData(etapa.data);

        } else if (etapa.status === "ativa") {

            data.textContent =
                "Previsão: " + formatarData(etapa.previsao);

        } else {

            data.textContent = "Aguardando etapa anterior";
        }

        conteudo.append(titulo, descricao, data);

        // Destaca a etapa atual
        if (etapa.status === "ativa") {

            const tag = document.createElement("span");

            tag.classList.add("tag-atual");
            tag.textContent = "ETAPA ATUAL";

            conteudo.appendChild(tag);
        }

        // Junta os elementos
        elemento.append(marcador, conteudo);

        timeline.appendChild(elemento);
    });
}


// FORMATAR DATAS
function formatarData(data) {

    if (!data) {
        return "A definir";
    }

    // As datas do JSON já estão no formato DD/MM/AAAA
    return data;
}


// EXIBIR PREVISÃO DA PRIMEIRA FATURA
function exibirPrevisaoFatura(data) {

    const elemento = document.querySelector(".aviso-fatura strong");

    if (!elemento) {
        return;
    }

    elemento.textContent = formatarData(data);
}


// ATUALIZAR STATUS GERAL
function atualizarStatusGeral(etapas) {

    const status = document.querySelector(".status");

    if (!status) {
        return;
    }

    const todasConcluidas = etapas.every(
        etapa => etapa.status === "concluida"
    );

    const existeEtapaAtiva = etapas.some(
        etapa => etapa.status === "ativa"
    );

    if (todasConcluidas) {

        status.textContent = "Ativação concluída";

    } else if (existeEtapaAtiva) {

        status.textContent = "Em andamento";

    } else {

        status.textContent = "Aguardando";
    }
}
