const el = {
  workspace: document.getElementById("workspace"),
  objective: document.getElementById("objective"),
  pending: document.getElementById("pending"),
  nextSteps: document.getElementById("nextSteps"),
  warnings: document.getElementById("warnings"),
  decisionsList: document.getElementById("decisionsList"),
  sessionsList: document.getElementById("sessionsList"),
  doctorResults: document.getElementById("doctorResults"),
  searchResults: document.getElementById("searchResults"),
  projectContext: document.getElementById("projectContext"),
  handoff: document.getElementById("handoff"),
  toast: document.getElementById("toast"),
  refreshBtn: document.getElementById("refreshBtn"),
  buildHandoffBtn: document.getElementById("buildHandoffBtn"),
  saveProjectContextBtn: document.getElementById("saveProjectContextBtn"),
  saveHandoffBtn: document.getElementById("saveHandoffBtn"),
  runDoctorBtn: document.getElementById("runDoctorBtn"),
  logForm: document.getElementById("logForm"),
  decisionForm: document.getElementById("decisionForm"),
  searchForm: document.getElementById("searchForm"),
  themeToggleBtn: document.getElementById("themeToggleBtn"),
  langSelect: document.getElementById("langSelect")
};

const LANG_KEY = "mb_ui_lang";
const THEME_KEY = "mb_ui_theme";

const I18N = {
  en: {
    "brand.eyebrow": "Engrene Local-First",
    "brand.title": "Memory Bridge UI",
    "ui.language": "Language",
    "btn.refresh": "Refresh",
    "btn.buildHandoff": "Build Handoff",
    "btn.saveSession": "Save Session Event",
    "btn.saveDecision": "Save Decision",
    "btn.saveProjectContext": "Save Project Context",
    "btn.saveHandoff": "Save Handoff",
    "btn.search": "Search",
    "btn.runDoctor": "Run Doctor",
    "btn.darkMode": "Dark Mode",
    "btn.lightMode": "Light Mode",
    "section.currentSnapshot": "Current Snapshot",
    "section.quickLog": "Quick Log",
    "section.addDecision": "Add Decision",
    "section.projectContext": "Project Context (editable)",
    "section.handoff": "Handoff (editable)",
    "section.search": "Search",
    "section.recentDecisions": "Recent Decisions",
    "section.recentSessions": "Recent Sessions",
    "section.doctor": "Doctor",
    "field.objective": "Objective",
    "field.pending": "Pending",
    "field.nextSteps": "Next Steps",
    "field.warnings": "Warnings",
    "label.tool": "Tool",
    "label.intent": "Intent",
    "label.summary": "Summary",
    "label.actions": "Actions (comma separated)",
    "label.artifacts": "Artifacts (comma separated)",
    "label.tags": "Tags (comma separated)",
    "label.title": "Title",
    "label.decision": "Decision",
    "label.context": "Context",
    "label.impact": "Impact",
    "label.supersedes": "Supersedes (comma separated)",
    "placeholder.searchMemory": "Search memory...",
    "mode.text": "text",
    "mode.semantic": "semantic",
    "help.currentSnapshot": "Auto-built context from your memory files: objective, pending items, next steps, and warnings.",
    "help.quickLog": "Save what you just did. These events power handoff and cross-tool resume.",
    "help.addDecision": "Record important decisions so future sessions know what was chosen and why.",
    "help.projectContext": "Editable high-level project notes: goals, scope, constraints, and shared context.",
    "help.handoff": "Transfer note for the next IDE/CLI or teammate. Build it automatically or edit manually.",
    "help.search": "Search previous sessions, decisions, handoff, and context. Semantic mode uses local vector index if enabled.",
    "help.recentDecisions": "Latest entries from decisions.jsonl to help you understand project direction quickly.",
    "help.recentSessions": "Latest session events from daily JSONL files. Useful to see recent activity across tools.",
    "help.doctor": "Runs health and safety checks: files, permissions, redaction, encryption setup, and leak-risk scan.",
    "toast.readonly": "Read-only mode enabled",
    "toast.refreshed": "Refreshed",
    "toast.handoffRebuilt": "Handoff rebuilt",
    "toast.projectContextSaved": "Project context saved",
    "toast.handoffSaved": "Handoff saved",
    "toast.sessionSaved": "Session event saved",
    "toast.decisionSaved": "Decision saved",
    "common.loadingWorkspace": "Loading workspace...",
    "common.none": "None",
    "common.readonly": "read-only",
    "common.editable": "editable",
    "search.score": "score"
  },
  "pt-BR": {
    "brand.eyebrow": "Engrene Local-First",
    "brand.title": "Memory Bridge UI",
    "ui.language": "Idioma",
    "btn.refresh": "Atualizar",
    "btn.buildHandoff": "Gerar Handoff",
    "btn.saveSession": "Salvar Evento de Sessão",
    "btn.saveDecision": "Salvar Decisão",
    "btn.saveProjectContext": "Salvar Contexto do Projeto",
    "btn.saveHandoff": "Salvar Handoff",
    "btn.search": "Buscar",
    "btn.runDoctor": "Executar Doctor",
    "btn.darkMode": "Modo Escuro",
    "btn.lightMode": "Modo Claro",
    "section.currentSnapshot": "Resumo Atual",
    "section.quickLog": "Log Rápido",
    "section.addDecision": "Adicionar Decisão",
    "section.projectContext": "Contexto do Projeto (editável)",
    "section.handoff": "Handoff (editável)",
    "section.search": "Busca",
    "section.recentDecisions": "Decisões Recentes",
    "section.recentSessions": "Sessões Recentes",
    "section.doctor": "Doctor",
    "field.objective": "Objetivo",
    "field.pending": "Pendências",
    "field.nextSteps": "Próximos Passos",
    "field.warnings": "Avisos",
    "label.tool": "Ferramenta",
    "label.intent": "Intenção",
    "label.summary": "Resumo",
    "label.actions": "Ações (separadas por vírgula)",
    "label.artifacts": "Artefatos (separados por vírgula)",
    "label.tags": "Tags (separadas por vírgula)",
    "label.title": "Título",
    "label.decision": "Decisão",
    "label.context": "Contexto",
    "label.impact": "Impacto",
    "label.supersedes": "Substitui (separado por vírgula)",
    "placeholder.searchMemory": "Buscar na memória...",
    "mode.text": "texto",
    "mode.semantic": "semântico",
    "help.currentSnapshot": "Contexto consolidado automaticamente dos seus arquivos de memória: objetivo, pendências, próximos passos e avisos.",
    "help.quickLog": "Salve o que acabou de fazer. Esses eventos alimentam o handoff e a retomada entre ferramentas.",
    "help.addDecision": "Registre decisões importantes para futuras sessões entenderem o que foi escolhido e por quê.",
    "help.projectContext": "Notas editáveis de alto nível: objetivos, escopo, restrições e contexto compartilhado.",
    "help.handoff": "Nota de transferência para a próxima IDE/CLI ou pessoa. Gere automaticamente ou edite manualmente.",
    "help.search": "Busque em sessões, decisões, handoff e contexto. O modo semântico usa índice vetorial local quando habilitado.",
    "help.recentDecisions": "Últimos registros de decisions.jsonl para entender rapidamente a direção do projeto.",
    "help.recentSessions": "Últimos eventos de sessão dos arquivos JSONL diários. Útil para ver atividade recente entre ferramentas.",
    "help.doctor": "Executa verificações de saúde e segurança: arquivos, permissões, redação, criptografia e risco de vazamento.",
    "toast.readonly": "Modo somente leitura ativado",
    "toast.refreshed": "Atualizado",
    "toast.handoffRebuilt": "Handoff regenerado",
    "toast.projectContextSaved": "Contexto do projeto salvo",
    "toast.handoffSaved": "Handoff salvo",
    "toast.sessionSaved": "Evento de sessão salvo",
    "toast.decisionSaved": "Decisão salva",
    "common.loadingWorkspace": "Carregando workspace...",
    "common.none": "Nenhum",
    "common.readonly": "somente leitura",
    "common.editable": "editável",
    "search.score": "pontuação"
  },
  es: {
    "brand.eyebrow": "Engrene Local-First",
    "brand.title": "Memory Bridge UI",
    "ui.language": "Idioma",
    "btn.refresh": "Actualizar",
    "btn.buildHandoff": "Generar Handoff",
    "btn.saveSession": "Guardar Evento de Sesión",
    "btn.saveDecision": "Guardar Decisión",
    "btn.saveProjectContext": "Guardar Contexto del Proyecto",
    "btn.saveHandoff": "Guardar Handoff",
    "btn.search": "Buscar",
    "btn.runDoctor": "Ejecutar Doctor",
    "btn.darkMode": "Modo Oscuro",
    "btn.lightMode": "Modo Claro",
    "section.currentSnapshot": "Resumen Actual",
    "section.quickLog": "Registro Rápido",
    "section.addDecision": "Agregar Decisión",
    "section.projectContext": "Contexto del Proyecto (editable)",
    "section.handoff": "Handoff (editable)",
    "section.search": "Búsqueda",
    "section.recentDecisions": "Decisiones Recientes",
    "section.recentSessions": "Sesiones Recientes",
    "section.doctor": "Doctor",
    "field.objective": "Objetivo",
    "field.pending": "Pendientes",
    "field.nextSteps": "Próximos Pasos",
    "field.warnings": "Avisos",
    "label.tool": "Herramienta",
    "label.intent": "Intención",
    "label.summary": "Resumen",
    "label.actions": "Acciones (separadas por coma)",
    "label.artifacts": "Artefactos (separados por coma)",
    "label.tags": "Etiquetas (separadas por coma)",
    "label.title": "Título",
    "label.decision": "Decisión",
    "label.context": "Contexto",
    "label.impact": "Impacto",
    "label.supersedes": "Sustituye (separado por coma)",
    "placeholder.searchMemory": "Buscar en la memoria...",
    "mode.text": "texto",
    "mode.semantic": "semántico",
    "help.currentSnapshot": "Contexto generado automáticamente desde tus archivos de memoria: objetivo, pendientes, próximos pasos y avisos.",
    "help.quickLog": "Guarda lo que acabas de hacer. Estos eventos alimentan el handoff y la reanudación entre herramientas.",
    "help.addDecision": "Registra decisiones importantes para que futuras sesiones entiendan qué se eligió y por qué.",
    "help.projectContext": "Notas editables de alto nivel: objetivos, alcance, restricciones y contexto compartido.",
    "help.handoff": "Nota de transferencia para la próxima IDE/CLI o persona. Puedes generarla automáticamente o editarla.",
    "help.search": "Busca en sesiones, decisiones, handoff y contexto. El modo semántico usa índice vectorial local si está habilitado.",
    "help.recentDecisions": "Últimas entradas de decisions.jsonl para entender rápidamente la dirección del proyecto.",
    "help.recentSessions": "Últimos eventos de sesión de archivos JSONL diarios. Útil para ver actividad reciente entre herramientas.",
    "help.doctor": "Ejecuta verificaciones de salud y seguridad: archivos, permisos, redacción, cifrado y riesgo de fugas.",
    "toast.readonly": "Modo solo lectura activado",
    "toast.refreshed": "Actualizado",
    "toast.handoffRebuilt": "Handoff regenerado",
    "toast.projectContextSaved": "Contexto del proyecto guardado",
    "toast.handoffSaved": "Handoff guardado",
    "toast.sessionSaved": "Evento de sesión guardado",
    "toast.decisionSaved": "Decisión guardada",
    "common.loadingWorkspace": "Cargando workspace...",
    "common.none": "Ninguno",
    "common.readonly": "solo lectura",
    "common.editable": "editable",
    "search.score": "puntuación"
  }
};

let state = {
  readonly: false,
  lang: "en",
  theme: "light"
};

function normalizeLang(raw) {
  if (!raw) {
    return "en";
  }
  const lower = String(raw).toLowerCase();
  if (lower.startsWith("pt")) {
    return "pt-BR";
  }
  if (lower.startsWith("es")) {
    return "es";
  }
  return "en";
}

function getInitialLang() {
  return normalizeLang(localStorage.getItem(LANG_KEY) || navigator.language);
}

function getInitialTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function t(key) {
  const table = I18N[state.lang] || I18N.en;
  return table[key] || I18N.en[key] || key;
}

function applyTranslations() {
  document.documentElement.lang = state.lang === "pt-BR" ? "pt-BR" : state.lang;

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.getAttribute("data-i18n");
    if (key) {
      node.textContent = t(key);
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    const key = node.getAttribute("data-i18n-placeholder");
    if (key && "placeholder" in node) {
      node.placeholder = t(key);
    }
  });

  if (el.langSelect) {
    el.langSelect.value = state.lang;
  }

  if (el.themeToggleBtn) {
    el.themeToggleBtn.textContent = state.theme === "dark" ? t("btn.lightMode") : t("btn.darkMode");
  }

  if (el.workspace && (!el.workspace.textContent || /loading workspace/i.test(el.workspace.textContent))) {
    el.workspace.textContent = t("common.loadingWorkspace");
  }
}

function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(THEME_KEY, theme);
  applyTranslations();
}

function notify(message, isError = false) {
  el.toast.textContent = message;
  el.toast.classList.toggle("error", isError);
  el.toast.hidden = false;
  setTimeout(() => {
    el.toast.hidden = true;
  }, 1800);
}

function listToHtml(list, mapper) {
  if (!list || list.length === 0) {
    return `<li>${t("common.none")}</li>`;
  }
  return list.map(mapper).join("");
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok || json.ok === false) {
    const message = json.error || `Request failed: ${response.status}`;
    throw new Error(message);
  }
  return json;
}

function setReadonly(readonly) {
  const previous = state.readonly;
  state.readonly = readonly;
  const controls = [
    el.buildHandoffBtn,
    el.saveProjectContextBtn,
    el.saveHandoffBtn,
    ...el.logForm.querySelectorAll("input,textarea,button"),
    ...el.decisionForm.querySelectorAll("input,textarea,button")
  ];
  for (const control of controls) {
    control.disabled = readonly;
  }
  if (readonly && previous !== readonly) {
    notify(t("toast.readonly"), false);
  }
}

function render(data) {
  state = {
    ...state,
    ...data
  };

  const mode = data.readonly ? t("common.readonly") : t("common.editable");
  el.workspace.textContent = `${data.workspace} · ${mode}`;
  el.objective.textContent = data.snapshot.objective || "N/A";

  el.pending.innerHTML = listToHtml(data.snapshot.pending, (item) => `<li>${item}</li>`);
  el.nextSteps.innerHTML = listToHtml(data.snapshot.nextSteps, (item) => `<li>${item}</li>`);
  el.warnings.innerHTML = listToHtml(data.warnings || data.snapshot.warnings, (item) => `<li>${item}</li>`);

  el.decisionsList.innerHTML = listToHtml(data.decisions.slice(-20).reverse(), (item) => {
    return `<li><strong>[${item.id}] ${item.title}</strong><br/><span>${item.decision}</span></li>`;
  });

  el.sessionsList.innerHTML = listToHtml(data.sessions.slice(-30).reverse(), (item) => {
    const tags = (item.tags || []).join(", ");
    return `<li><strong>${item.tool}</strong> · ${new Date(item.ts).toLocaleString()}<br/><span>${item.intent}</span><br/><em>${item.summary}</em>${tags ? `<br/><small>#${tags}</small>` : ""}</li>`;
  });

  el.projectContext.value = data.projectContext || "";
  el.handoff.value = data.handoff || "";

  setReadonly(Boolean(data.readonly));
}

async function refresh() {
  const data = await api("/api/state");
  render(data);
}

el.themeToggleBtn?.addEventListener("click", () => {
  const next = state.theme === "dark" ? "light" : "dark";
  applyTheme(next);
});

el.langSelect?.addEventListener("change", () => {
  state.lang = normalizeLang(el.langSelect.value);
  localStorage.setItem(LANG_KEY, state.lang);
  applyTranslations();
  refresh().catch((error) => notify(error.message, true));
});

el.refreshBtn.addEventListener("click", async () => {
  try {
    await refresh();
    notify(t("toast.refreshed"));
  } catch (error) {
    notify(error.message, true);
  }
});

el.buildHandoffBtn.addEventListener("click", async () => {
  try {
    const out = await api("/api/handoff/build", { method: "POST" });
    el.handoff.value = out.markdown || el.handoff.value;
    await refresh();
    notify(t("toast.handoffRebuilt"));
  } catch (error) {
    notify(error.message, true);
  }
});

el.saveProjectContextBtn.addEventListener("click", async () => {
  try {
    await api("/api/project-context", {
      method: "PUT",
      body: JSON.stringify({ markdown: el.projectContext.value })
    });
    notify(t("toast.projectContextSaved"));
    await refresh();
  } catch (error) {
    notify(error.message, true);
  }
});

el.saveHandoffBtn.addEventListener("click", async () => {
  try {
    await api("/api/handoff", {
      method: "PUT",
      body: JSON.stringify({ markdown: el.handoff.value })
    });
    notify(t("toast.handoffSaved"));
    await refresh();
  } catch (error) {
    notify(error.message, true);
  }
});

el.logForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(el.logForm);
  const payload = {
    tool: String(form.get("tool") || "ui"),
    intent: String(form.get("intent") || ""),
    summary: String(form.get("summary") || ""),
    actions: String(form.get("actions") || "")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean),
    artifacts: String(form.get("artifacts") || "")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean),
    tags: String(form.get("tags") || "")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean)
  };

  try {
    await api("/api/log", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    notify(t("toast.sessionSaved"));
    el.logForm.reset();
    el.logForm.tool.value = "ui";
    await refresh();
  } catch (error) {
    notify(error.message, true);
  }
});

el.decisionForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(el.decisionForm);
  const payload = {
    title: String(form.get("title") || ""),
    decision: String(form.get("decision") || ""),
    context: String(form.get("context") || ""),
    impact: String(form.get("impact") || ""),
    supersedes: String(form.get("supersedes") || "")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean)
  };

  try {
    await api("/api/decision", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    notify(t("toast.decisionSaved"));
    el.decisionForm.reset();
    await refresh();
  } catch (error) {
    notify(error.message, true);
  }
});

el.searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(el.searchForm);
  const query = encodeURIComponent(String(form.get("query") || ""));
  const mode = encodeURIComponent(String(form.get("mode") || "text"));

  try {
    const out = await api(`/api/search?q=${query}&mode=${mode}&limit=20`);
    el.searchResults.innerHTML = listToHtml(out.hits, (item) => {
      const score = Number(item.score || 0).toFixed(4);
      return `<li><strong>[${item.source}]</strong> ${t("search.score")}=${score} ${item.ref ? `· ${item.ref}` : ""}<br/><span>${item.snippet}</span></li>`;
    });
  } catch (error) {
    notify(error.message, true);
  }
});

el.runDoctorBtn.addEventListener("click", async () => {
  try {
    const out = await api("/api/doctor");
    el.doctorResults.innerHTML = listToHtml(out.result.checks, (check) => {
      const prefix = check.ok ? "ok" : check.severity;
      return `<li><strong>${prefix}</strong> · ${check.name}: ${check.message}</li>`;
    });
  } catch (error) {
    notify(error.message, true);
  }
});

state.lang = getInitialLang();
localStorage.setItem(LANG_KEY, state.lang);
state.theme = getInitialTheme();
applyTheme(state.theme);
applyTranslations();

refresh().catch((error) => notify(error.message, true));
