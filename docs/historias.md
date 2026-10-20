# Histórias de usuário

> Entregável da aula 20. Cada história nasce de uma oportunidade do mapa de jornada e vira uma Issue com o label `historia`.
| ID | História | Oportunidade de origem | Prioridade | Issue |
| --- | --- | --- | --- | --- |
| HU01 | Como José, cliente novo que não está recebendo as mensagens da Bulbe, quero confirmar meu WhatsApp e meu e-mail e escolher um canal reserva para ter certeza de que vou receber os avisos sobre minha ativação e minha fatura. | Fase 2 (Boas-vindas): confirmar contatos e canal reserva — ~20% de falha na entrega por WhatsApp | alta | #[ ] |
| HU02 | Como Lucas, cliente novo que ainda recebe conta da Cemig, quero ver em que etapa está a minha ativação e quando vem a minha 1ª fatura para não achar que a contratação deu errado durante a espera. | Fase 3 (Espera da ativação): linha do tempo da ativação — até 20 dias sem comunicação | alta | #[ ] |
| HU03 | Como Ana Paula, cliente que recebeu a 1ª fatura da Bulbe, quero ver cada parte da fatura explicada em linguagem simples e quanto economizei para entender o que estou pagando e não achar que estou pagando duas vezes. | Fase 4 (Chegada da 1ª fatura): fatura explicada item por item — fatura difícil de entender | média | #[ ] |
| HU04 | Como Mariana, cliente com a 1ª fatura aberta e renda variável, quero ver o valor, o vencimento e as formas de pagamento em um só lugar e ativar um lembrete para pagar sem atraso. | Fase 5 (Pagamento): PIX, boleto e lembrete — 32,4% de inadimplência na 1ª fatura | alta | #[ ] |
| HU05 | Como Beatriz, cliente nova com dúvidas em cada etapa, quero encontrar respostas rápidas para as perguntas mais comuns do início para não ficar insegura e não deixar de pagar por falta de informação. | Transversal: central de dúvidas com busca — comunicação falha no onboarding | baixa | #[ ] |
## Critérios de aceite

### HU01
- [ ] Ao abrir a tela, o WhatsApp e o e-mail aparecem preenchidos com os dados de `cliente.json`.
- [ ] Com um WhatsApp de menos de 11 dígitos, ao clicar em "Confirmar", aparece "Digite um celular válido com DDD" e o formulário não é enviado.
- [ ] Com um e-mail sem "@" ou sem domínio, ao clicar em "Confirmar", aparece "Digite um e-mail válido".
- [ ] Sem canal reserva escolhido (e-mail ou SMS), ao clicar em "Confirmar", aparece um aviso pedindo a escolha.
- [ ] Com todos os campos válidos, ao clicar em "Confirmar", aparece "Contatos confirmados!" e um botão para "Acompanhar minha ativação".

### HU02
- [ ] Ao abrir a tela, aparece uma linha do tempo com 4 etapas carregadas de `ativacao.json`: Contrato assinado, Pedido enviado à Cemig, Energia Bulbe ativa, 1ª fatura gerada.
- [ ] As etapas concluídas aparecem marcadas como concluídas, com a data.
- [ ] A etapa em andamento aparece destacada, com a data prevista e uma frase simples do que está acontecendo.
- [ ] A tela mostra o aviso "Sua 1ª fatura está prevista para [data]".
- [ ] Ao clicar em "Tenho uma dúvida", o usuário é levado à Central de dúvidas.

### HU03
- [ ] Ao abrir a tela, aparecem os dados da fatura fictícia carregados de fatura.json: mês de referência, consumo (kWh), valor total e vencimento.
- [ ] Cada item da fatura tem uma explicação curta em linguagem simples.
- [ ] A tela mostra em destaque "Você economizou R$ X este mês", em comparação com a conta sem a Bulbe.
- [ ] Ao tocar em um item da fatura, a explicação dele abre ou fecha.
- [ ] Ao clicar em "Pagar agora", o usuário é levado à tela de pagamento.

### HU04
- [ ] Ao abrir a tela, aparecem o valor e o vencimento carregados de fatura.json, além de quantos dias faltam para vencer.
- [ ] Ao clicar em "Copiar código" do PIX, o código fictício é copiado e aparece "Código copiado!".
- [ ] Ao escolher boleto, aparece a linha digitável fictícia com um botão para copiá-la.
- [ ] Ao clicar em "Me lembre antes do vencimento", aparece a confirmação de que o lembrete foi ativado para 3 dias antes.
- [ ] Quando faltam 3 dias ou menos para o vencimento, a tela mostra um alerta visual de vencimento próximo.
