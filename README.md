# Retentor  

> Projeto em Ciência de Dados I · Ibmec BH · 2º semestre de 2026
> Cliente: **Bulbe Energia** · Turma **A** · Squad **08**

Painel que acompanha o cliente novo da Bulbe da adesão ao pagamento da primeira fatura, tirando todas as suas dúvidas, e dando todo o apoio necessário para a conversão e retenção do cliente.

---

## 1. Problema

- **Dor escolhida:** inadimplência alta da primeira fatura, por falta de informações
- **Evidência:** inadimplência de 32,4% na 1ª fatura (contra 1,6% na carteira com mais de 4 meses)
- **Indicador que a solução pretende mover:** pagamento da 1ª fatura | churn do 1º mês | entregabilidade das comunicações

## 2. Persona e jornada

A solução atende cinco personas de clientes novos da Bulbe, uma para cada momento da jornada inicial. Todas são fictícias.

| Persona | Perfil | Dor principal | História |
| --- | --- | --- | --- |
| **José Almeida**, 63 anos | Aposentado, Betim – MG. O filho contratou a Bulbe para ele e ele não sabe como a cobrança funciona. | "Vou receber duas contas? Será que fui enganado?" | HU01 – Como a Bulbe funciona |
| **Lucas Ferreira**, 28 anos | Entregador por aplicativo, Belo Horizonte – MG. Contratou pelo celular e ficou quase 3 semanas sem notícia. | "Por que ainda recebo conta da Cemig? Caí em golpe?" | HU02 – Acompanhamento da ativação |
| **Ana Paula Rocha**, 41 anos | Professora da rede estadual, Contagem – MG. Não entendeu os termos da 1ª fatura ("energia compensada", "créditos"). | "Estou pagando a energia duas vezes?" | HU03 – Explicação da 1ª fatura |
| **Mariana Souza**, 34 anos | Cabeleireira autônoma, Contagem – MG. Renda variável; a fatura nova não entrou na rotina dela. | Esquecer o vencimento e pagar multa. | HU04 – Pagamento da 1ª fatura |
| **Beatriz Lima**, 22 anos | Estudante e estagiária, Belo Horizonte – MG. É a primeira conta de luz no nome dela. | "Preciso cancelar a Cemig? Quando vence?" | HU05 – Central de dúvidas |

A jornada tem cinco fases, e cada uma vira uma tela: boas-vindas e entendimento do serviço, espera pela ativação, recebimento da 1ª fatura, pagamento e esclarecimento de dúvidas.

- **Mapa de jornada completo:** [docs/jornada.md](docs/jornada.md)
- **Histórias de usuário:** [docs/historias.md](docs/historias.md)

## 3. Solução

| Tela | O que faz | História relacionada |
| --- | --- | --- |
| Como a Bulbe funciona (`pages/como-funciona.html`) | Explica a cobrança, simula a economia e confirma o entendimento | HU01 |
| Acompanhar ativação (`pages/ativacao.html`) | Linha do tempo da ativação e explicação da etapa atual | HU02 |
| Primeira fatura (`pages/primeira-fatura.html`) | Explica cada item da fatura e mostra a economia | HU03 |
| Pagamento (`pages/pagamento.html`) | Valor, vencimento, PIX, boleto e lembrete | HU04 |
| Central de dúvidas (`pages/hu05.html`) | Perguntas frequentes com busca | HU05 |

- **Histórias de usuário:** [docs/historias.md](docs/historias.md)
- **Wireframes:** [docs/wireframes/](docs/wireframes/)

## 4. Tecnologias

- HTML, CSS e JavaScript puro (vanilla)
- Dados fictícios em JSON, lidos com `fetch` (pasta [`data/`](data/))
- Git e GitHub (Issues, Projects e Pull Requests)

## 5. Como executar

1. Clone o repositório:
   ```bash
   git clone https://github.com/jpalves7/202602-projeto1-a-08.git
   ```
2. Abra a pasta no VS Code.
3. Instale a extensão **Live Server** (o VS Code vai sugerir automaticamente).
4. Clique com o botão direito em `index.html` e escolha **Open with Live Server**.

> Abrir o `index.html` direto no navegador (duplo clique) não funciona: o `fetch` dos arquivos JSON exige um servidor.

## 6. Estrutura do repositório

```
├── index.html            # Página inicial
├── pages/                # Telas: como-funciona, ativacao, primeira-fatura, pagamento, hu05
├── assets/
│   ├── css/              # style.css (base) + um CSS por tela
│   ├── js/               # api.js (leitura dos JSON) + um JS por tela
│   └── img/              # Logos da Bulbe
├── data/                 # Dados fictícios em JSON
├── docs/                 # Jornada, histórias, wireframes e sprints
└── .github/              # Modelos de Issue e de Pull Request
```

## 7. Quadro do projeto

- **GitHub Projects:** https://github.com/users/jpalves7/projects/2

## 8. Equipe

| Integrante | GitHub | Papel principal |
| --- | --- | --- |
| Pedro Paulo | [@pedropcg1466](https://github.com/pedropcg1466) | HU01 – Como a Bulbe funciona |
| João Pedro Alves | [@jpalves7](https://github.com/jpalves7) | HU02 – Acompanhamento da ativação |
| Vitor Carrara | [@VitorCarrara31](https://github.com/VitorCarrara31) | HU03 – Explicação da fatura |
| Pedro Coelho | [@PedroCoelho0](https://github.com/PedroCoelho0) | HU04 – Pagamento da 1ª fatura |
| João Pedro Lanna | [@JPLanna](https://github.com/JPLanna) | HU05 – Central de dúvidas |


## 9. Entregas

| Marco | Aula | Status |
| --- | --- | --- |
| Mapa de jornada | 19 | Concluído |
| Histórias de usuário | 20 | Concluído |
| Wireframes | 21–23 | Concluído |
| Sprint Review I | 24 | Concluído |
| Implementação | 25–28 | Concluído |
| Sprint Review II | 29 | Concluído |
| Versão final | 30 | Concluído |
---

> Todos os dados deste repositório são fictícios. Nenhum dado real de cliente da Bulbe Energia é utilizado.
