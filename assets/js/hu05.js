const FAQ_URL = new URL("../../data/faq.json", import.meta.url);

const CATEGORY_ICONS = {
  ativacao: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m13.5 2-9 11h6l-.8 9 9.8-12h-6.3l.3-8Z"/></svg>',
  fatura: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h9l4 4v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M14 3v5h5M8 12h8M8 16h6"/></svg>',
  pagamento: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h3"/></svg>'
};

const CATEGORY_DESCRIPTIONS = {
  ativacao: "Encontre respostas para ativar seu serviço Bulbe.",
  fatura: "Entenda sua conta de energia.",
  pagamento: "Veja prazos e formas de pagamento."
};

const state = {
  faqs: [],
  categories: [],
  view: "home",
  category: null,
  query: "",
  returnView: "home"
};

const elements = {
  homeHeader: document.querySelector("#home-header"),
  innerHeader: document.querySelector("#inner-header"),
  backButton: document.querySelector("#back-button"),
  homeView: document.querySelector("#home-view"),
  categoryView: document.querySelector("#category-view"),
  resultsView: document.querySelector("#results-view"),
  emptyView: document.querySelector("#empty-view"),
  categoryList: document.querySelector("#category-list"),
  homeSearch: document.querySelector("#home-search"),
  homeQuery: document.querySelector("#home-query"),
  loadError: document.querySelector("#load-error")
};

function normalize(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR").trim();
}

function setView(view) {
  const changed = state.view !== view;
  state.view = view;
  elements.homeView.hidden = view !== "home";
  elements.categoryView.hidden = view !== "category";
  elements.resultsView.hidden = view !== "results";
  elements.emptyView.hidden = view !== "empty";
  elements.homeHeader.hidden = view !== "home";
  elements.innerHeader.hidden = view === "home";
  elements.homeQuery.value = view === "home" ? state.query : "";
  if (changed) window.scrollTo({ top: 0, behavior: "smooth" });
}

function buildCategoryCard(category) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "category-card";
  button.setAttribute("aria-label", `Abrir categoria ${category.label}`);
  button.innerHTML = `<span class="category-icon">${CATEGORY_ICONS[category.id] ?? ""}</span>
    <span class="category-copy"><strong></strong><span></span></span><span class="chevron" aria-hidden="true">›</span>`;
  button.querySelector(".category-copy strong").textContent = category.label;
  button.querySelector(".category-copy span").textContent = category.description;
  button.addEventListener("click", () => openCategory(category.id));
  return button;
}

function renderCategories() {
  elements.categoryList.replaceChildren(...state.categories.map(buildCategoryCard));
}

function makeSearchForm(value, id) {
  const form = document.createElement("form");
  form.className = "search-form";
  form.setAttribute("role", "search");
  form.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4 4"/></svg>
    <label class="sr-only" for="${id}">Busque sua dúvida</label>
    <input id="${id}" type="search" placeholder="Busque sua dúvida aqui..." autocomplete="off">`;
  const input = form.querySelector("input");
  input.value = value;
  form.addEventListener("submit", (event) => event.preventDefault());
  input.addEventListener("input", () => handleSearch(input.value));
  return form;
}

function buildFaqItem(faq, index) {
  const item = document.createElement("details");
  item.className = "faq-item";
  item.id = `faq-${faq.id ?? index}`;

  const summary = document.createElement("summary");
  summary.className = "faq-question";
  summary.textContent = faq.question;
  item.append(summary);

  const answer = document.createElement("div");
  answer.className = "faq-answer";
  const paragraph = document.createElement("p");
  paragraph.textContent = faq.answer;
  answer.append(paragraph);

  if (faq.tip) {
    const tip = document.createElement("aside");
    tip.className = "tip-box";
    tip.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg><div><strong>Dica importante</strong><span></span></div>';
    tip.querySelector("span").textContent = faq.tip;
    answer.append(tip);
  }

  item.append(answer);
  return item;
}

function openCategory(categoryId) {
  state.category = state.categories.find((category) => category.id === categoryId) ?? null;
  if (!state.category) return;
  state.query = "";
  renderCategory();
  setView("category");
}

function renderCategory() {
  if (!state.category) return;

  const faqs = state.faqs.filter((faq) => faq.category === state.category.id);
  const icon = CATEGORY_ICONS[state.category.id] ?? "";
  elements.categoryView.replaceChildren();

  const intro = document.createElement("div");
  intro.className = "category-intro";
  intro.innerHTML = `<span class="category-icon">${icon}</span><h2></h2>`;
  intro.querySelector("h2").textContent = state.category.label;
  elements.categoryView.append(intro);

  const description = document.createElement("p");
  description.className = "category-description";
  description.textContent = state.category.pageDescription ?? CATEGORY_DESCRIPTIONS[state.category.id] ?? "Tire suas dúvidas sobre o serviço.";
  elements.categoryView.append(description, makeSearchForm(state.query, "category-query"));

  const title = document.createElement("h3");
  title.className = "faq-section-title";
  title.textContent = "Perguntas frequentes";

  const list = document.createElement("div");
  list.className = "faq-list";
  list.setAttribute("aria-label", `Perguntas frequentes sobre ${state.category.label}`);
  faqs.forEach((faq, index) => list.append(buildFaqItem(faq, index)));
  elements.categoryView.append(title, list);
}

function renderResults(query) {
  const normalizedQuery = normalize(query);
  const matches = state.faqs.filter((faq) => normalize(faq.question).includes(normalizedQuery));

  if (matches.length === 0) {
    renderEmpty(query);
    setView("empty");
    return;
  }

  elements.resultsView.replaceChildren(makeSearchForm(query, "results-query"));

  const heading = document.createElement("h2");
  heading.id = "results-title";
  heading.className = "results-heading";
  heading.textContent = "Resultados da busca";

  const count = document.createElement("p");
  count.className = "results-count";
  count.textContent = `${matches.length} ${matches.length === 1 ? "pergunta encontrada" : "perguntas encontradas"}`;

  const list = document.createElement("div");
  list.className = "faq-list";
  list.setAttribute("aria-label", "Resultados da busca");
  matches.forEach((faq, index) => list.append(buildFaqItem(faq, index)));

  const noAnswer = document.createElement("aside");
  noAnswer.className = "no-answer-card";
  noAnswer.innerHTML = '<strong>Não encontrou sua resposta?</strong><p>Confira mais assuntos nas categorias.</p><button class="outline-button" type="button">Ver todas as categorias</button>';
  noAnswer.querySelector("button").addEventListener("click", () => {
    state.query = "";
    state.category = null;
    setView("home");
  });

  elements.resultsView.append(heading, count, list, noAnswer);
  setView("results");
}

function renderEmpty(query) {
  elements.emptyView.replaceChildren(makeSearchForm(query, "empty-query"));

  const art = document.createElement("div");
  art.className = "empty-art";
  art.setAttribute("aria-hidden", "true");
  art.innerHTML = '<span class="spark one">ϟ</span><svg viewBox="0 0 160 110"><rect x="17" y="12" width="126" height="82" rx="12"/><path d="M34 31h72M34 51h86M34 71h60"/></svg><span class="magnifier"><svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 5 5"/></svg></span><span class="spark two">✣</span>';

  const copy = document.createElement("div");
  copy.className = "empty-copy";
  copy.innerHTML = '<h2 id="empty-title">Nenhuma pergunta encontrada</h2><p></p><button class="primary-button" type="button">Limpar busca</button><p class="empty-note">Você também pode explorar nossas categorias.</p>';
  copy.querySelector("p").textContent = `Não encontramos resultados para “${query}”. Tente outra palavra-chave ou navegue pelas categorias.`;
  copy.querySelector("button").addEventListener("click", () => {
    state.query = "";
    state.category = null;
    setView("home");
  });

  elements.emptyView.append(art, copy);
}

function handleSearch(value) {
  const focusedSearch = document.activeElement?.matches?.('input[type="search"]');
  const caret = focusedSearch ? document.activeElement.selectionStart : value.length;
  state.query = value;

  if (value.trim()) {
    if (state.view !== "results" && state.view !== "empty") state.returnView = state.view;
    renderResults(value);
  } else if (state.returnView === "category" && state.category) {
    renderCategory();
    setView("category");
  } else {
    state.category = null;
    setView("home");
  }

  if (focusedSearch) {
    const nextInput = document.querySelector(".hu05-app section:not([hidden]) input[type='search']");
    if (nextInput) {
      nextInput.focus({ preventScroll: true });
      const position = Math.min(caret ?? value.length, nextInput.value.length);
      nextInput.setSelectionRange(position, position);
    }
  }
}

function goBack() {
  if (state.view === "results" || state.view === "empty") {
    if (state.returnView === "category" && state.category) {
      state.query = "";
      renderCategory();
      setView("category");
    } else {
      state.query = "";
      state.category = null;
      setView("home");
    }
    return;
  }

  state.query = "";
  state.category = null;
  setView("home");
}

async function start() {
  elements.homeSearch.addEventListener("submit", (event) => event.preventDefault());
  elements.homeQuery.addEventListener("input", () => handleSearch(elements.homeQuery.value));
  elements.backButton.addEventListener("click", goBack);

  try {
    const response = await fetch(FAQ_URL);
    if (!response.ok) throw new Error(`Falha ao carregar FAQ: ${response.status}`);

    const data = await response.json();
    state.faqs = Array.isArray(data.faqs) ? data.faqs : [];
    state.categories = Array.isArray(data.categories)
      ? data.categories.map((category) => ({
          ...category,
          description: category.description ?? CATEGORY_DESCRIPTIONS[category.id]
        }))
      : [];

    if (!state.faqs.length || !state.categories.length) {
      throw new Error("O arquivo FAQ está vazio ou fora do formato esperado.");
    }

    renderCategories();
  } catch (error) {
    console.error(error);
    elements.loadError.hidden = false;
  }
}

start();