const state = {
  user: null,
  providers: [],
  chats: [],
  activeChat: null,
  authEmail: "",
  authMode: "login",
  codeRequested: false,
  settings: {
    preferences: { language: "de", responseStyle: "balanced", customInstructions: "" },
    keys: [],
    teamMember: false,
    teamProviders: [],
    sharedProviders: []
  },
  usage: null,
  adminUsage: null,
  renameChatId: null,
  deepThink: false,
  webSearch: false,
  busy: false,
  requestController: null
};

const $ = (selector) => document.querySelector(selector);
const appShell = $("#app");
const authScreen = $("#authScreen");
const authForm = $("#authForm");
const authEmail = $("#authEmail");
const authPassword = $("#authPassword");
const authCode = $("#authCode");
const authError = $("#authError");
const authSubmit = $("#authSubmit");
const authResend = $("#authResend");
const authModeToggle = $("#authModeToggle");
const authLegacyToggle = $("#authLegacyToggle");
const authBack = $("#authBack");
const messageInput = $("#messageInput");
const providerSelect = $("#providerSelect");
const modelSelect = $("#modelSelect");
const messages = $("#messages");
const welcome = $("#welcome");
const toast = $("#toast");

const translations = {
  de: {
    newChat: "Neuer Chat", yourChats: "DEINE CHATS", workspaceModels: "Ein Workspace. Alle Modelle.",
    settingsProfile: "Einstellungen · Profil", provider: "ANBIETER", model: "MODELL",
    welcomeKicker: "DEIN PERSÖNLICHER KI-ARBEITSRAUM",
    welcomeTitle: "Gute Ideen beginnen<br>mit <span>einer Frage.</span>",
    welcomeDescription: "Ein Raum für klare Gedanken, neue Perspektiven und alles,<br class=\"desktop-break\"> was du als Nächstes erschaffen möchtest.",
    ideaTitle: "Eine Idee entwickeln", ideaDescription: "Von der ersten Frage zum klaren Konzept",
    writingTitle: "Besser formulieren", writingDescription: "Finde die richtigen Worte für jeden Anlass",
    learnTitle: "Etwas verstehen", learnDescription: "Komplexes einfach und klar erklärt",
    createTitle: "Etwas erschaffen", createDescription: "Bild- und Videogenerierung ausprobieren",
    messagePlaceholder: "Frag, denk laut oder erschaffe etwas ...", generate: "Generieren",
    webSearch: "Websuche", generateImage: "Bild erstellen", generateImageHelp: "Mit einem Prompt generieren",
    generateVideo: "Video erstellen", generateVideoHelp: "Wenn dein Anbieter es unterstützt",
    contextActive: "Kontext aktiv", sendHint: "↵ zum Senden", sendMessage: "Nachricht senden",
    aiDisclaimer: "KI kann Fehler machen. Prüfe wichtige Informationen immer nach.",
    settingsEyebrow: "PERSÖNLICHER WORKSPACE", settingsTitle: "Einstellungen",
    preferencesTitle: "Sprache und Antworten", languageLabel: "Sprache der Website und Antworten",
    responseStyleLabel: "Wie soll die KI antworten?", styleBalanced: "Ausgewogen",
    styleConcise: "Kurz und direkt", styleDetailed: "Ausführlich mit Beispielen",
    styleFriendly: "Freundlich und locker", styleProfessional: "Professionell",
    customInstructionsLabel: "Eigene Wünsche (optional)",
    customInstructionsPlaceholder: "Zum Beispiel: Erkläre Fachbegriffe einfach.",
    saveSettings: "Einstellungen speichern", apiKeysTitle: "Deine privaten API-Schlüssel",
    apiKeysHelp: "Eigene Schlüssel werden verschlüsselt gespeichert, sind nur für dein Konto sichtbar und können jederzeit gelöscht werden.",
    apiKeyLabel: "API-Schlüssel", apiKeyPlaceholder: "API-Schlüssel einfügen",
    addKey: "Schlüssel hinzufügen", logoutHelp: "Deine Chats bleiben beim Abmelden gespeichert.",
    logout: "Abmelden", closeSettings: "Schließen", noPrivateKeys: "Noch keine eigenen Schlüssel gespeichert.",
    deleteKey: "Löschen", keyEnding: "Endet auf", noSharedKey: "Für diesen Anbieter ist kein privater Team-Schlüssel für dein Konto freigegeben.",
    sharedKeyAvailable: "Ein privater Team-Schlüssel ist für dein Konto freigegeben. Du kannst ihn oben beim Anbieter auswählen.",
    ownKeyAvailable: "Du hast für diesen Anbieter einen eigenen Schlüssel gespeichert.",
    saveSuccess: "Einstellungen gespeichert.", keyAdded: "Dein API-Schlüssel wurde verschlüsselt gespeichert.",
    keyDeleted: "Dein API-Schlüssel wurde gelöscht.", providerKeyMissing: "Für diesen Anbieter ist kein API-Schlüssel für dein Konto eingerichtet.",
    defaultChatTitle: "Dein kreativer Denkraum", autoProviderTitle: "Automatische Anbieterauswahl",
    documentTitle: "AI Studio — Dein KI-Arbeitsbereich", autoModel: "✳ Auto · bestes Modell",
    smartMatch: "✳ Auto · smart match", renameTitle: "Chat umbenennen", renameInputLabel: "Chatname",
    cancel: "Abbrechen", saveRename: "Speichern", usageTitle: "Deine Nutzung",
    usageLimitMessage: "Dein Nachrichtenlimit ist aufgebraucht. Warte bitte bis zum angezeigten Reset."
  },
  en: {
    newChat: "New chat", yourChats: "YOUR CHATS", workspaceModels: "One workspace. Every model.",
    settingsProfile: "Settings · Profile", provider: "PROVIDER", model: "MODEL",
    welcomeKicker: "YOUR PERSONAL AI WORKSPACE",
    welcomeTitle: "Great ideas begin<br>with <span>a question.</span>",
    welcomeDescription: "A space for clear thoughts, new perspectives, and everything<br class=\"desktop-break\"> you want to create next.",
    ideaTitle: "Develop an idea", ideaDescription: "From the first question to a clear concept",
    writingTitle: "Write it better", writingDescription: "Find the right words for every occasion",
    learnTitle: "Understand something", learnDescription: "Make complex topics simple and clear",
    createTitle: "Create something", createDescription: "Try image and video generation",
    messagePlaceholder: "Ask, think out loud, or create something ...", generate: "Generate",
    webSearch: "Web search", generateImage: "Create image", generateImageHelp: "Generate from a prompt",
    generateVideo: "Create video", generateVideoHelp: "If your provider supports it",
    contextActive: "Context active", sendHint: "↵ to send", sendMessage: "Send message",
    aiDisclaimer: "AI can make mistakes. Always verify important information.",
    settingsEyebrow: "PERSONAL WORKSPACE", settingsTitle: "Settings",
    preferencesTitle: "Language and responses", languageLabel: "Website and response language",
    responseStyleLabel: "How should the AI respond?", styleBalanced: "Balanced",
    styleConcise: "Concise and direct", styleDetailed: "Detailed with examples",
    styleFriendly: "Friendly and casual", styleProfessional: "Professional",
    customInstructionsLabel: "Your preferences (optional)",
    customInstructionsPlaceholder: "For example: Explain technical terms simply.",
    saveSettings: "Save settings", apiKeysTitle: "Your private API keys",
    apiKeysHelp: "Your keys are encrypted, visible only to your account, and can be deleted at any time.",
    apiKeyLabel: "API key", apiKeyPlaceholder: "Paste API key",
    addKey: "Add key", logoutHelp: "Your chats will remain saved when you sign out.",
    logout: "Sign out", closeSettings: "Close", noPrivateKeys: "No personal keys saved yet.",
    deleteKey: "Delete", keyEnding: "Ending in", noSharedKey: "No private team key is enabled for your account with this provider.",
    sharedKeyAvailable: "A private team key is enabled for your account. You can select this provider above.",
    ownKeyAvailable: "You have saved your own key for this provider.",
    saveSuccess: "Settings saved.", keyAdded: "Your API key was encrypted and saved.",
    keyDeleted: "Your API key was deleted.", providerKeyMissing: "No API key is configured for your account with this provider.",
    defaultChatTitle: "Your creative workspace", autoProviderTitle: "Automatic provider selection",
    documentTitle: "AI Studio — Your AI workspace", autoModel: "✳ Auto · best model",
    smartMatch: "✳ Auto · smart match", renameTitle: "Rename chat", renameInputLabel: "Chat name",
    cancel: "Cancel", saveRename: "Save", usageTitle: "Your usage",
    usageLimitMessage: "Your message limit is used up. Please wait until the displayed reset."
  }
};

function applyLanguage(language) {
  const selectedLanguage = language === "en" ? "en" : "de";
  const dictionary = translations[selectedLanguage];
  document.documentElement.lang = selectedLanguage;
  document.title = dictionary.documentTitle;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const translation = dictionary[element.dataset.i18n];
    if (translation) {
      if (element.dataset.i18n === "welcomeTitle" || element.dataset.i18n === "welcomeDescription") {
        element.innerHTML = translation;
      } else {
        element.textContent = translation;
      }
    }
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const translation = dictionary[element.dataset.i18nPlaceholder];
    if (translation) element.placeholder = translation;
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    const translation = dictionary[element.dataset.i18nAriaLabel];
    if (translation) element.setAttribute("aria-label", translation);
  });
}

function applyTheme(theme) {
  const dark = theme === "dark";
  document.body.classList.toggle("dark-mode", dark);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#000000" : "#f8f8fb");
  $("#themeToggle").textContent = dark ? "☀" : "☾";
  $("#themeToggle").setAttribute("aria-label", dark ? "Helles Design aktivieren" : "Dark Mode aktivieren");
  $("#themeToggle").title = dark ? "Helles Design aktivieren" : "Dark Mode aktivieren";
}

applyTheme(localStorage.getItem("ai-studio-theme") || "light");
$("#themeToggle").addEventListener("click", () => {
  const theme = document.body.classList.contains("dark-mode") ? "light" : "dark";
  localStorage.setItem("ai-studio-theme", theme);
  applyTheme(theme);
});

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

async function api(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) }
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.error || `Anfrage fehlgeschlagen (${response.status}).`);
    error.status = response.status;
    error.usage = payload.usage;
    error.resetAt = payload.resetAt;
    error.feature = payload.feature;
    throw error;
  }
  return payload;
}

function renderUsage() {
  if (!state.usage) return;
  const usage = state.usage;
  const english = state.settings.preferences.language === "en";
  const featureLabels = english
    ? { text: "messages", image: "images", video: "videos" }
    : { text: "Nachrichten", image: "Bilder", video: "Videos" };
  const badge = $("#usageButton");
  if (usage.teamMember) {
    badge.textContent = english ? "Team · Unlimited" : "Team · Unbegrenzt";
    $("#usageSummary").textContent = english ? "Your team account has unlimited usage." : "Dein Teamkonto hat unbegrenzte Nutzung.";
    $("#usageDetails").replaceChildren();
  } else if (!usage.enabled) {
    badge.textContent = english ? "Limits off" : "Limits aus";
    $("#usageSummary").textContent = english ? "Usage limits are currently disabled for everyone." : "Die Nutzungslimits sind aktuell für alle deaktiviert.";
    $("#usageDetails").replaceChildren();
  } else {
    badge.textContent = english
      ? `${usage.features.text.remaining} msg · ${usage.features.image.remaining} img · ${usage.features.video.remaining} vid`
      : `${usage.features.text.remaining} N · ${usage.features.image.remaining} B · ${usage.features.video.remaining} V`;
    const resetIn = Math.max(0, usage.resetAt - Date.now());
    const hours = Math.floor(resetIn / 3600000);
    const minutes = Math.ceil((resetIn % 3600000) / 60000);
    $("#usageSummary").textContent = english
      ? `Limits reset in ${hours}h ${minutes}m. Permanent extras do not reset.`
      : `Reset in ${hours} Std. ${minutes} Min. Dauerhafte Extras verfallen nicht.`;
    const details = $("#usageDetails");
    details.replaceChildren();
    for (const feature of ["text", "image", "video"]) {
      const item = usage.features[feature];
      const row = document.createElement("div");
      row.className = "usage-detail-row";
      const label = document.createElement("span");
      label.textContent = featureLabels[feature];
      const count = document.createElement("strong");
      count.textContent = `${Math.max(0, item.limit - item.used)} / ${item.limit} · ${english ? "extra" : "Extra"} ${item.permanent}`;
      row.append(label, count);
      details.append(row);
    }
  }
  $("#adminUsageSection").classList.toggle("hidden", !usage.teamMember);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.remove("visible"), 4300);
}

function setAuthError(message) {
  authError.textContent = message;
  authError.classList.toggle("hidden", !message);
}

function setAuthenticated(user) {
  state.user = user;
  authScreen.classList.toggle("hidden", Boolean(user));
  appShell.classList.toggle("hidden", !user);
  if (!user) return;
  $("#userEmail").textContent = user.email;
  $("#avatar").textContent = user.email.slice(0, 1).toUpperCase();
  loadWorkspace().catch((error) => showToast(error.message));
}

function setAuthMode(mode) {
  state.authMode = mode;
  const registering = mode === "register";
  $("#authTitle").innerHTML = registering
    ? "Dein eigener<br><span>Ideenraum.</span>"
    : "Schön, dass<br>du <span>wieder da bist.</span>";
  $("#authDescription").textContent = state.codeRequested
    ? `Gib den sechsstelligen Code ein, den wir an ${state.authEmail} senden.`
    : registering
      ? "Erstelle dein Konto mit einer dauerhaften E-Mail-Adresse."
      : "Melde dich mit deiner E-Mail-Adresse und deinem Passwort an.";
  $("#passwordField").classList.toggle("hidden", state.codeRequested);
  $("#emailLabel").classList.toggle("hidden", state.codeRequested);
  authEmail.classList.toggle("hidden", state.codeRequested);
  $("#codeField").classList.toggle("hidden", !state.codeRequested);
  authPassword.required = !state.codeRequested;
  authPassword.minLength = registering && !state.codeRequested ? 10 : 0;
  authPassword.autocomplete = registering ? "new-password" : "current-password";
  authSubmit.innerHTML = state.codeRequested
    ? "Sicher anmelden <span>→</span>"
    : registering ? "Konto erstellen <span>→</span>" : "Anmelden <span>→</span>";
  authModeToggle.textContent = registering ? "Du hast schon ein Konto? Anmelden" : "Noch kein Konto? Konto erstellen";
  authModeToggle.classList.toggle("hidden", state.codeRequested);
  authLegacyToggle.classList.toggle("hidden", registering || state.codeRequested);
  authBack.classList.toggle("hidden", !state.codeRequested);
  authResend.classList.toggle("hidden", !state.codeRequested);
}

function showCodeStep() {
  state.authEmail = authEmail.value.trim().toLowerCase();
  state.codeRequested = true;
  setAuthMode(state.authMode);
  authCode.focus();
}

setAuthMode("login");
authModeToggle.addEventListener("click", () => setAuthMode(state.authMode === "login" ? "register" : "login"));
authBack.addEventListener("click", () => {
  state.codeRequested = false;
  authCode.value = "";
  setAuthMode(state.authMode);
  setAuthError("");
  authEmail.focus();
});

authLegacyToggle.addEventListener("click", async () => {
  setAuthError("");
  if (!authEmail.reportValidity()) return;
  showCodeStep();
  authLegacyToggle.disabled = true;
  try {
    await api("/api/auth/request-code", {
      method: "POST",
      body: JSON.stringify({ email: state.authEmail })
    });
  } catch (error) {
    setAuthError(error.message);
  } finally {
    authLegacyToggle.disabled = false;
  }
});

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setAuthError("");
  authSubmit.disabled = true;
  try {
    if (state.codeRequested) {
      const result = await api("/api/auth/verify-code", {
        method: "POST",
        body: JSON.stringify({ email: state.authEmail, code: authCode.value.trim() })
      });
      setAuthenticated(result.user);
    } else {
      state.authEmail = authEmail.value.trim().toLowerCase();
      const endpoint = state.authMode === "register" ? "/api/auth/register" : "/api/auth/login";
      const result = await api(endpoint, {
        method: "POST",
        body: JSON.stringify({ email: state.authEmail, password: authPassword.value })
      });
      setAuthenticated(result.user);
    }
  } catch (error) {
    setAuthError(error.message);
  } finally {
    authSubmit.disabled = false;
  }
});

authResend.addEventListener("click", async () => {
  authResend.disabled = true;
  setAuthError("");
  try {
    await api("/api/auth/request-code", {
      method: "POST",
      body: JSON.stringify({ email: state.authEmail })
    });
    showToast("Ein neuer Code wurde angefordert. Prüfe auch deinen Spam-Ordner.");
  } catch (error) {
    setAuthError(error.message);
  } finally {
    authResend.disabled = false;
  }
});

authCode.addEventListener("input", () => {
  authCode.value = authCode.value.replace(/\D/g, "").slice(0, 6);
});

async function loadWorkspace() {
  const [config, providerData, chatData, settings, usage] = await Promise.all([
    api("/api/config"),
    api("/api/providers"),
    api("/api/chats"),
    api("/api/profile/settings"),
    api("/api/usage")
  ]);
  state.settings = settings;
  state.usage = usage;
  applyLanguage(settings.preferences.language);
  renderUsage();
  state.providers = providerData.providers.map((provider) => {
    const fallback = config.providers.find((item) => item.id === provider.id);
    const models = provider.models?.length ? provider.models : fallback?.fallbackModels || [];
    return {
      ...provider,
      models,
      imageModels: provider.imageModels || models.filter(isImageGenerationModel)
    };
  });
  const readyCount = state.providers.filter((provider) => provider.configured).length;
  $("#providerCount").textContent = settings.preferences.language === "en"
    ? `${readyCount} providers ready`
    : `${readyCount} Anbieter bereit`;

  const previousProvider = localStorage.getItem("ai-studio-provider");
  renderProviderOptions();
  providerSelect.value = isProviderSelectionAvailable(previousProvider)
    ? previousProvider
    : "auto";
  renderModels();
  renderSettings();
  state.chats = chatData.chats;
  renderChatList();
  if (state.chats.length) await openChat(state.chats[0].id);
  else showWelcome();
}

function providerAccessLabel(provider) {
  const ownKey = state.settings.keys.some((key) => key.providerId === provider.id);
  if (ownKey) return state.settings.preferences.language === "en" ? " · Your key" : " · Eigener Key";
  if (provider.configured) return "";
  return state.settings.preferences.language === "en" ? " · No key" : " · Key fehlt";
}

function renderProviderOptions() {
  const language = state.settings.preferences.language;
  const previousProvider = providerSelect.value;
  const autoLabel = language === "en" ? "✳ Auto · all providers" : "✳ Auto · alle Anbieter";
  const secretAutoLabel = language === "en" ? "🔒 Team Auto · shared keys only" : "🔒 Team Auto · nur freigegebene Schlüssel";
  const chatProviders = state.providers.filter((provider) => !provider.videoOnly);
  const normalProviders = chatProviders.map((provider) =>
    `<option value="${escapeHTML(provider.id)}">${escapeHTML(provider.label)}${escapeHTML(providerAccessLabel(provider))}</option>`
  ).join("");
  const teamProviderIds = state.settings.teamMember
    ? state.settings.teamProviders
    : state.settings.sharedProviders;
  const sharedProviders = teamProviderIds
    .map((id) => chatProviders.find((provider) => provider.id === id))
    .filter(Boolean);
  const sharedOptions = sharedProviders.map((provider) => {
    const configured = state.settings.sharedProviders.includes(provider.id);
    const accessLabel = configured
      ? (language === "en" ? " · Team key" : " · Secret-Key")
      : (language === "en" ? " · Team key not configured" : " · Team-Key fehlt");
    return `<option value="secret:${escapeHTML(provider.id)}"${configured ? "" : " disabled"}>🔒 ${escapeHTML(provider.label)}${accessLabel}</option>`;
  }
  ).join("");
  providerSelect.innerHTML = `<option value="auto">${autoLabel}</option>${sharedProviders.length ? `<option value="secret-auto">${secretAutoLabel}</option>` : ""}${normalProviders}${sharedOptions}`;
  providerSelect.value = isProviderSelectionAvailable(previousProvider) ? previousProvider : "auto";
  const keyProvider = $("#keyProviderSelect");
  if (keyProvider) {
    const previous = keyProvider.value;
    keyProvider.innerHTML = state.providers.map((provider) =>
      `<option value="${escapeHTML(provider.id)}">${escapeHTML(provider.label)}</option>`
    ).join("");
    if (state.providers.some((provider) => provider.id === previous)) keyProvider.value = previous;
    updateSharedKeyNotice();
  }
}

function isProviderSelectionAvailable(selection) {
  if (selection === "auto") return true;
  if (selection === "secret-auto") return state.settings.sharedProviders.length > 0;
  if (selection?.startsWith("secret:")) return state.settings.sharedProviders.includes(selection.slice("secret:".length));
  return state.providers.some((provider) => provider.id === selection);
}

function renderSettings() {
  const language = state.settings.preferences.language === "en" ? "en" : "de";
  $("#settingsEmail").textContent = state.user?.email || "";
  $("#languageSelect").value = language;
  $("#responseStyleSelect").value = state.settings.preferences.responseStyle || "balanced";
  $("#customInstructions").value = state.settings.preferences.customInstructions || "";
  renderProviderOptions();
  renderPrivateKeys();
}

function renderPrivateKeys() {
  const list = $("#privateKeyList");
  if (!list) return;
  list.replaceChildren();
  if (!state.settings.keys.length) {
    const empty = document.createElement("div");
    empty.className = "private-key-empty";
    empty.textContent = translations[state.settings.preferences.language].noPrivateKeys;
    list.append(empty);
    return;
  }
  for (const key of state.settings.keys) {
    const provider = state.providers.find((item) => item.id === key.providerId);
    const entry = document.createElement("div");
    entry.className = "private-key-item";
    const label = document.createElement("span");
    label.textContent = `${provider?.label || key.providerId} · •••• ${key.lastFour}`;
    const remove = document.createElement("button");
    remove.className = "private-key-delete";
    remove.type = "button";
    remove.textContent = translations[state.settings.preferences.language].deleteKey;
    remove.addEventListener("click", () => deletePrivateKey(key.id));
    entry.append(label, remove);
    list.append(entry);
  }
}

function updateSharedKeyNotice() {
  const notice = $("#sharedKeyNotice");
  const providerId = $("#keyProviderSelect")?.value;
  const dictionary = translations[state.settings.preferences.language];
  const ownKey = state.settings.keys.some((key) => key.providerId === providerId);
  const sharedKey = state.settings.sharedProviders.includes(providerId);
  notice.classList.toggle("available", ownKey || sharedKey);
  notice.textContent = ownKey
    ? dictionary.ownKeyAvailable
    : sharedKey
      ? dictionary.sharedKeyAvailable
      : dictionary.noSharedKey;
}

function currentProvider() {
  const providerId = providerSelect.value.startsWith("secret:")
    ? providerSelect.value.slice("secret:".length)
    : providerSelect.value;
  return state.providers.find((provider) => provider.id === providerId) || null;
}

function isImageGenerationModel(model) {
  return /(image|imagen|flux|dall.?e|stable.?diffusion|recraft|ideogram)/i.test(model);
}

function isVideoGenerationModel(model) {
  return /(video|veo|sora|kling|runway|luma|wan|h3|minimax|hailuo|seedance)/i.test(model);
}

function renderModels() {
  const provider = currentProvider();
  const teamMode = providerSelect.value === "secret-auto" || providerSelect.value.startsWith("secret:");
  const selectedScope = teamMode ? "team" : "standard";
  const storageKey = `${selectedScope}-${provider?.id || (teamMode ? "auto" : "auto")}`;
  const stored = localStorage.getItem(`ai-studio-model-${storageKey}`);
  if (!provider) {
    const choices = state.providers.filter((item) => !item.videoOnly && (teamMode
      ? state.settings.sharedProviders.includes(item.id)
      : item.configured)).flatMap((item) =>
      item.models.map((model) => ({
        value: `${teamMode ? "secret:" : ""}${item.id}::${model}`,
        label: `${teamMode ? "🔒 " : ""}${item.label} · ${model}`
      }))
    );
    modelSelect.innerHTML = `<option value="auto">${translations[state.settings.preferences.language].autoModel}</option>` + choices.map(({ value, label }) =>
      `<option value="${escapeHTML(value)}">${escapeHTML(label)}</option>`
    ).join("");
    modelSelect.value = stored && (stored === "auto" || choices.some((choice) => choice.value === stored)) ? stored : "auto";
    $("#topbarTitle").textContent = teamMode
      ? (state.settings.preferences.language === "en" ? "Automatic team-key selection" : "Automatische Auswahl der Team-Schlüssel")
      : translations[state.settings.preferences.language].autoProviderTitle;
    return;
  }
  const models = provider.models || [];
  modelSelect.innerHTML = `<option value="auto">${translations[state.settings.preferences.language].smartMatch}</option>${models.map((model) =>
    `<option value="${teamMode ? "secret:" : ""}${escapeHTML(model)}">${escapeHTML(model)}</option>`
  ).join("")}`;
  const optionValues = models.map((model) => `${teamMode ? "secret:" : ""}${model}`);
  modelSelect.value = stored && (stored === "auto" || optionValues.includes(stored)) ? stored : "auto";
  if (provider.error)   $("#topbarTitle").textContent = state.settings.preferences.language === "en"
    ? "Model list unavailable · suggestions loaded"
    : "Modelliste nicht erreichbar · Vorschläge geladen";
  else $("#topbarTitle").textContent = translations[state.settings.preferences.language].defaultChatTitle;
}

providerSelect.addEventListener("change", () => {
  localStorage.setItem("ai-studio-provider", providerSelect.value);
  renderModels();
});
modelSelect.addEventListener("change", () => {
  const provider = currentProvider();
  const scope = providerSelect.value === "secret-auto" || providerSelect.value.startsWith("secret:") ? "team" : "standard";
  localStorage.setItem(`ai-studio-model-${scope}-${provider?.id || "auto"}`, modelSelect.value);
});

$("#refreshModels").addEventListener("click", async () => {
  const button = $("#refreshModels");
  button.disabled = true;
  try {
    const result = await api("/api/providers");
    state.providers = state.providers.map((provider) => {
      const updated = result.providers.find((next) => next.id === provider.id);
      return updated ? { ...updated, imageModels: updated.imageModels || updated.models.filter(isImageGenerationModel) } : provider;
    });
    renderProviderOptions();
    renderModels();
    showToast("Modelllisten wurden aktualisiert.");
  } catch (error) {
    showToast(error.message);
  } finally {
    button.disabled = false;
  }
});

function renderChatList() {
  const list = $("#chatList");
  list.innerHTML = "";
  for (const chat of state.chats) {
    const entry = document.createElement("button");
    entry.type = "button";
    entry.className = `chat-entry${chat.id === state.activeChat ? " active" : ""}`;
    entry.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5.5h14v10H9l-4 3v-13Z"/><path d="M8 9h8M8 12h5"/></svg><span>${escapeHTML(chat.title)}</span><span class="delete-chat" title="Chat löschen" role="button" aria-label="Chat löschen">×</span>`;
    entry.addEventListener("click", (event) => {
      if (event.target.classList.contains("delete-chat")) {
        event.stopPropagation();
        deleteChat(chat.id);
      } else {
        openChat(chat.id);
      }
    });
    entry.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      renameChat(chat.id);
    });
    let pressTimer;
    let startX = 0;
    let startY = 0;
    let longPressTriggered = false;
    entry.addEventListener("pointerdown", (event) => {
      if (event.pointerType !== "touch") return;
      startX = event.clientX;
      startY = event.clientY;
      longPressTriggered = false;
      pressTimer = setTimeout(() => {
        longPressTriggered = true;
        renameChat(chat.id);
      }, 650);
    });
    entry.addEventListener("pointermove", (event) => {
      if (Math.hypot(event.clientX - startX, event.clientY - startY) > 12) clearTimeout(pressTimer);
    });
    entry.addEventListener("pointerup", () => clearTimeout(pressTimer));
    entry.addEventListener("pointercancel", () => clearTimeout(pressTimer));
    entry.addEventListener("click", (event) => {
      if (!longPressTriggered) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      longPressTriggered = false;
    }, true);
    list.append(entry);
  }
}

async function renameChat(id) {
  const chat = state.chats.find((item) => item.id === id);
  if (!chat) return;
  state.renameChatId = id;
  $("#renameChatInput").value = chat.title;
  $("#renameDialog").classList.remove("hidden");
  $("#renameDialog").setAttribute("aria-hidden", "false");
  $("#renameChatInput").focus();
  $("#renameChatInput").select();
}

function closeRenameDialog() {
  state.renameChatId = null;
  $("#renameDialog").classList.add("hidden");
  $("#renameDialog").setAttribute("aria-hidden", "true");
}

$("#renameForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const id = state.renameChatId;
  const chat = state.chats.find((item) => item.id === id);
  const title = $("#renameChatInput").value.trim();
  if (!chat || !title || title === chat.title) {
    closeRenameDialog();
    return;
  }
  try {
    const result = await api(`/api/chats/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ title })
    });
    chat.title = result.chat.title;
    renderChatList();
    if (state.activeChat === id) $("#topbarTitle").textContent = chat.title;
    closeRenameDialog();
  } catch (error) {
    showToast(error.message);
  }
});
$("#closeRename").addEventListener("click", closeRenameDialog);
$("#cancelRename").addEventListener("click", closeRenameDialog);
$("#renameDialog").addEventListener("click", (event) => {
  if (event.target === $("#renameDialog")) closeRenameDialog();
});

async function createChat() {
  const result = await api("/api/chats", { method: "POST", body: "{}" });
  state.chats.unshift(result.chat);
  state.activeChat = result.chat.id;
  renderChatList();
  renderMessages([]);
  showWelcome();
  messageInput.focus();
  closeSidebar();
}

$("#newChat").addEventListener("click", () => createChat().catch((error) => showToast(error.message)));

async function openChat(id) {
  const result = await api(`/api/chats/${encodeURIComponent(id)}`);
  state.activeChat = id;
  $("#topbarTitle").textContent = result.chat.title;
  renderChatList();
  renderMessages(result.messages);
  closeSidebar();
}

async function deleteChat(id) {
  try {
    await api(`/api/chats/${encodeURIComponent(id)}`, { method: "DELETE" });
    state.chats = state.chats.filter((chat) => chat.id !== id);
    if (state.activeChat === id) {
      state.activeChat = null;
      if (state.chats.length) await openChat(state.chats[0].id);
      else {
        renderMessages([]);
        showWelcome();
      }
    }
    renderChatList();
  } catch (error) {
    showToast(error.message);
  }
}

function showWelcome() {
  welcome.classList.remove("hidden");
  messages.classList.add("hidden");
  $("#topbarTitle").textContent = translations[state.settings.preferences.language].defaultChatTitle;
}

function appendMessage(message) {
  welcome.classList.add("hidden");
  messages.classList.remove("hidden");
  const row = document.createElement("article");
  row.className = `message-row ${message.role}`;
  const who = message.role === "user" ? "Du" : "Atelier";
  let avatar = null;
  if (message.role === "assistant") {
    avatar = document.createElement("span");
    avatar.className = "message-avatar";
    avatar.textContent = "✳";
    avatar.setAttribute("aria-hidden", "true");
  }
  const content = document.createElement("div");
  content.className = "message-content";
  content.textContent = message.content;
  const body = document.createElement("div");
  body.className = "message-body";
  const meta = document.createElement("div");
  meta.className = "message-meta";
  meta.textContent = who;
  body.append(meta);
  if (message.role === "assistant") {
    formatAssistantAnswer(content, body);
  } else {
    body.append(content);
  }
  if (message.media_url && message.kind === "image") {
    const image = document.createElement("img");
    image.className = "message-media";
    image.src = message.media_url;
    image.alt = message.content || "Generiertes Bild";
    image.loading = "lazy";
    body.append(image);
  }
  if (message.media_url && message.kind === "video") {
    const video = document.createElement("video");
    video.className = "message-media";
    video.src = message.media_url;
    video.controls = true;
    video.preload = "metadata";
    body.append(video);
  }
  if (message.role === "user") row.append(body);
  else row.append(avatar, body);
  messages.append(row);
  $("#conversationView").scrollTop = $("#conversationView").scrollHeight;
}

function createAssistantMessageRow(deepThink, webSearch) {
  welcome.classList.add("hidden");
  messages.classList.remove("hidden");
  const row = document.createElement("article");
  row.className = "message-row assistant";
  const avatar = document.createElement("span");
  avatar.className = "message-avatar";
  avatar.textContent = "✳";
  avatar.setAttribute("aria-hidden", "true");
  const body = document.createElement("div");
  body.className = "message-body";
  const meta = document.createElement("div");
  meta.className = "message-meta";
  meta.textContent = "Atelier";
  const status = document.createElement("div");
  status.className = "thinking-status";
  status.textContent = [
    webSearch ? "Suche im Web …" : "",
    deepThink ? "Vergleiche relevante Chats …" : "",
    !webSearch && !deepThink ? "Formuliere die Antwort …" : ""
  ].filter(Boolean).join(" ");
  const content = document.createElement("div");
  content.className = "message-content streaming-content";
  body.append(meta, status, content);
  row.append(avatar, body);
  messages.append(row);
  return { row, body, status, content };
}

function splitBriefExplanation(text) {
  const marker = /^\s*(?:#{1,3}\s*)?(?:\*\*)?(?:Kurz erkl(?:ä|ae)rt|In short)(?:\*\*)?:?\s*/im;
  const match = marker.exec(text);
  if (!match) return { answer: text, explanation: "" };
  return {
    answer: text.slice(0, match.index).trim(),
    explanation: text.slice(match.index + match[0].length).trim()
  };
}

function isLongAssistantAnswer(text) {
  return text.length >= 480 || text.includes("```");
}

function formatAssistantAnswer(content, body) {
  const fullText = content.textContent || "";
  const { answer, explanation } = splitBriefExplanation(fullText);
  content.textContent = answer;
  content.classList.remove("streaming-content");
  const isLong = isLongAssistantAnswer(fullText);
  if (isLong && !body.querySelector(".assistant-answer-frame")) {
    const frame = document.createElement("div");
    frame.className = "assistant-answer-frame";
    const toolbar = document.createElement("div");
    toolbar.className = "answer-toolbar";
    const label = document.createElement("span");
    label.textContent = "ANTWORT";
    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.className = "copy-answer-button";
    copyButton.textContent = "Kopieren";
    copyButton.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(fullText);
        copyButton.textContent = "Kopiert";
        setTimeout(() => { copyButton.textContent = "Kopieren"; }, 1600);
      } catch (error) {
        showToast(`Kopieren ist fehlgeschlagen: ${error.message}`);
      }
    });
    toolbar.append(label, copyButton);
    frame.append(toolbar, content);
    body.append(frame);
  } else {
    body.append(content);
  }
  if (explanation) {
    const summary = document.createElement("aside");
    summary.className = "reasoning-summary";
    const title = document.createElement("strong");
    title.textContent = "Kurz erklärt";
    const text = document.createElement("p");
    text.textContent = explanation;
    summary.append(title, text);
    body.append(summary);
  }
}

async function streamAssistantResponse(chatId, payload, pending, signal) {
  const response = await fetch(`/api/chats/${encodeURIComponent(chatId)}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
    body: JSON.stringify({ ...payload, stream: true }),
    signal
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const requestError = new Error(error.error || `Anfrage fehlgeschlagen (${response.status}).`);
    requestError.status = response.status;
    requestError.usage = error.usage;
    requestError.resetAt = error.resetAt;
    requestError.feature = error.feature;
    throw requestError;
  }
  if (!response.body) throw new Error("Der Browser unterstützt keine gestreamten Antworten.");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let assistantMessage = null;
  let responseTitle = "";
  let serverError = "";
  let webSources = [];

  function processEvent(rawEvent) {
    const data = rawEvent.split(/\r?\n/)
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trim())
      .join("\n");
    if (!data) return;
    const event = JSON.parse(data);
    if (event.type === "start") {
      responseTitle = event.title;
      if (!event.webSearch && !event.deepThink) pending.status.remove();
    } else if (event.type === "status") {
      pending.status.textContent = event.text;
    } else if (event.type === "sources") {
      webSources = event.sources || [];
      pending.status.textContent = `${webSources.length} Webquellen gefunden. Antwort wird erstellt …`;
    } else if (event.type === "delta") {
      pending.status.remove();
      pending.content.textContent += event.text;
      $("#conversationView").scrollTop = $("#conversationView").scrollHeight;
    } else if (event.type === "error") {
      serverError = event.error;
      pending.status.textContent = "Anfrage fehlgeschlagen";
      pending.content.textContent = event.error;
    } else if (event.type === "done") {
      assistantMessage = event.assistantMessage;
      responseTitle = event.title || responseTitle;
    }
  }

  while (true) {
    const { value, done } = await reader.read();
    buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
    let separator = buffer.search(/\r?\n\r?\n/);
    while (separator !== -1) {
      const event = buffer.slice(0, separator);
      const separatorLength = buffer[separator] === "\r" ? 4 : 2;
      buffer = buffer.slice(separator + separatorLength);
      processEvent(event);
      separator = buffer.search(/\r?\n\r?\n/);
    }
    if (done) break;
  }

  if (assistantMessage) {
    pending.status.remove();
    pending.content.textContent = assistantMessage.content;
    formatAssistantAnswer(pending.content, pending.body);
    if (webSources.length) renderWebSources(webSources, pending.body);
  }
  if (serverError) showToast(serverError);
  if (!assistantMessage && !serverError) throw new Error("Der Stream wurde ohne Antwort beendet.");
  return { assistantMessage, title: responseTitle };
}

function renderWebSources(sources, body) {
  const section = document.createElement("aside");
  section.className = "web-sources";
  const heading = document.createElement("div");
  heading.className = "web-sources-title";
  heading.textContent = `Webquellen (${sources.length})`;
  section.append(heading);
  for (const source of sources) {
    let url;
    try {
      url = new URL(source.url);
    } catch {
      continue;
    }
    if (!["http:", "https:"].includes(url.protocol)) continue;
    const link = document.createElement("a");
    link.href = url.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = source.title;
    section.append(link);
  }
  if (section.children.length > 1) body.append(section);
}

function renderMessages(items) {
  messages.replaceChildren();
  messages.classList.toggle("hidden", !items.length);
  welcome.classList.toggle("hidden", Boolean(items.length));
  items.forEach(appendMessage);
}

function detectMode(text) {
  if (/\/generate\s+(vid|video)\b/i.test(text) || /\b(video erstellen|erstelle(?: mir)? (?:ein )?video|generiere(?: mir)? (?:ein )?video|mach(?: mir)? (?:ein )?video|create (?:me )?a video|generate (?:me )?a video)\b/i.test(text)) return "video";
  if (/\/generate\s+(foto|bild|image)\b/i.test(text) || /\b(bild erstellen|foto erstellen|erstelle(?: mir)? (?:ein )?(?:bild|foto)|generiere(?: mir)? (?:ein )?(?:bild|foto)|mach(?: mir)? (?:ein )?(?:bild|foto)|create (?:me )?(?:an image|a picture)|generate (?:me )?(?:an image|a picture))\b/i.test(text)) return "image";
  return "text";
}

function resolveModel(mode) {
  const providerSelection = providerSelect.value;
  const selectedScope = providerSelection === "secret-auto" || providerSelection.startsWith("secret:") ? "team" : "standard";
  const selectedProvider = currentProvider();
  const selectedValue = modelSelect.value;
  let manualModel = selectedValue;
  let manualProvider = selectedProvider;
  let keyScope = selectedScope;
  if (selectedValue !== "auto") {
    const separator = selectedValue.indexOf("::");
    if (separator > 0) {
      const providerValue = selectedValue.slice(0, separator);
      keyScope = providerValue.startsWith("secret:") ? "team" : selectedScope;
      const providerId = providerValue.startsWith("secret:") ? providerValue.slice("secret:".length) : providerValue;
      manualProvider = state.providers.find((provider) => provider.id === providerId);
      manualModel = selectedValue.slice(separator + 2);
    } else if (selectedValue.startsWith("secret:")) {
      keyScope = "team";
      manualModel = selectedValue.slice("secret:".length);
    }
  }
  const providerIsConfigured = (provider) => keyScope === "team"
    ? state.settings.sharedProviders.includes(provider.id)
    : provider.configured;

  if (mode === "video") {
    const candidates = state.providers.filter((provider) => keyScope === "team"
      ? state.settings.sharedProviders.includes(provider.id)
      : provider.configured);
    const preferredProvider = manualProvider || selectedProvider;
    const sorted = candidates.sort((left, right) => {
      if (left.id === preferredProvider?.id) return -1;
      if (right.id === preferredProvider?.id) return 1;
      if (left.videoOnly !== right.videoOnly) return left.videoOnly ? -1 : 1;
      const leftHasVideoModel = left.models?.some(isVideoGenerationModel) || false;
      const rightHasVideoModel = right.models?.some(isVideoGenerationModel) || false;
      return Number(rightHasVideoModel) - Number(leftHasVideoModel);
    });
    const videoCandidates = sorted.flatMap((provider) => {
      if (provider.videoOnly) return [{ provider, model: provider.models?.[0] || "h3" }];
      const videoModels = (provider.models || []).filter(isVideoGenerationModel);
      const preferredManualModel = provider.id === preferredProvider?.id && manualModel !== "auto"
        ? [manualModel]
        : [];
      return [...new Set([...preferredManualModel, ...videoModels])]
        .map((candidateModel) => ({ provider, model: candidateModel }));
    });
    if (!videoCandidates.length) {
      throw new Error("Kein Videoanbieter verfügbar. Richte einen API-Schlüssel für Viggle oder einen anderen Videomodellanbieter ein.");
    }
    return {
      ...videoCandidates[0],
      keyScope,
      videoFallbacks: videoCandidates.slice(1).map(({ provider, model }) => ({ providerId: provider.id, model }))
    };
  }

  if (mode === "image") {
    const candidates = state.providers.filter((provider) =>
      !provider.videoOnly
      && providerIsConfigured(provider)
      && (keyScope === "team"
        ? state.settings.sharedProviders.includes(provider.id)
        : provider.configured)
    );
    const preferredProvider = manualProvider || selectedProvider;
    candidates.sort((left, right) =>
      Number(right.id === preferredProvider?.id) - Number(left.id === preferredProvider?.id)
    );
    const imageCandidates = [];
    if (manualModel !== "auto" && manualProvider?.imageModels?.includes(manualModel) && providerIsConfigured(manualProvider)) {
      imageCandidates.push({ provider: manualProvider, model: manualModel });
    }
    for (const provider of candidates) {
      for (const candidateModel of provider.imageModels || []) {
        if (!imageCandidates.some((item) => item.provider.id === provider.id && item.model === candidateModel)) {
          imageCandidates.push({ provider, model: candidateModel });
        }
      }
    }
    if (!imageCandidates.length) {
      throw new Error("Kein Bildgenerierungsmodell mit einem verfügbaren API-Schlüssel gefunden. Füge einen Anbieter-Key hinzu, der Bildausgabe unterstützt.");
    }
    const [{ provider, model }, ...fallbacks] = imageCandidates;
    return {
      provider,
      model,
      keyScope,
      imageFallbacks: fallbacks.map(({ provider: fallbackProvider, model: fallbackModel }) => ({
        providerId: fallbackProvider.id,
        model: fallbackModel
      }))
    };
  }

  if (manualModel !== "auto" && manualProvider && providerIsConfigured(manualProvider)) {
    return { provider: manualProvider, model: manualModel, keyScope };
  }
  const candidates = selectedProvider
    ? [selectedProvider]
    : selectedScope === "team"
      ? state.providers.filter((provider) => state.settings.sharedProviders.includes(provider.id))
      : state.providers.filter((provider) => provider.configured);
  for (const provider of candidates) {
    if (!providerIsConfigured(provider)) continue;
    const model = provider.models.find((item) => /(llama-3\.3-70b|gemini-2\.5-flash|gpt-4o-mini|mistral-large)/i.test(item))
      || provider.models[0];
    if (model) return { provider, model, keyScope: selectedScope };
  }
  throw new Error(translations[state.settings.preferences.language].providerKeyMissing);
}

async function sendMessage(text) {
  const message = text.trim();
  if (!message || state.busy) return;
  const mode = detectMode(message);
  if (mode === "text" && state.usage?.enabled && !state.usage.teamMember
    && state.usage.features.text.remaining <= 0) {
    showToast(translations[state.settings.preferences.language].usageLimitMessage);
    return;
  }
  let selection;
  try {
    selection = resolveModel(mode);
  } catch (error) {
    showToast(error.message);
    return;
  }
  const providerAvailable = selection.keyScope === "team"
    ? state.settings.sharedProviders.includes(selection.provider?.id)
    : selection.provider?.configured;
  if (!providerAvailable) {
    showToast(`Füge zuerst ${selection.provider?.label || "eines Anbieters"} API-Key in die .env-Datei ein und starte den Server neu.`);
    return;
  }
  if (!state.activeChat) await createChat();
  state.busy = true;
  const controller = new AbortController();
  state.requestController = controller;
  $("#sendButton").classList.add("hidden");
  $("#stopButton").classList.remove("hidden");
  $("#loadingIndicator").classList.remove("hidden");
  appendMessage({ role: "user", content: message });
  messageInput.value = "";
  resizeComposer();
  let pending = null;
  try {
    const payload = {
      message,
      mode,
      provider: selection.provider.id,
      model: selection.model,
      ...(mode === "image" ? { imageFallbacks: selection.imageFallbacks } : {}),
      ...(mode === "video" ? { videoFallbacks: selection.videoFallbacks } : {}),
      keyScope: selection.keyScope,
      deepThink: state.deepThink,
      webSearch: state.webSearch
    };
    let result;
    if (mode === "text") {
      pending = createAssistantMessageRow(state.deepThink, state.webSearch);
      result = await streamAssistantResponse(state.activeChat, payload, pending, controller.signal);
    } else {
      result = await api(`/api/chats/${encodeURIComponent(state.activeChat)}/messages`, {
        method: "POST",
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      appendMessage(result.assistantMessage);
      if (result.providerLabel) {
        showToast(`${mode === "video" ? "Video" : "Bild"} erstellt mit ${result.providerLabel}.`);
      }
    }
    state.usage = await api("/api/usage");
    renderUsage();
    const chat = state.chats.find((item) => item.id === state.activeChat);
    if (chat && result.title) chat.title = result.title;
    renderChatList();
    $("#topbarTitle").textContent = result.title || "Dein kreativer Denkraum";
  } catch (error) {
    if (controller.signal.aborted) {
      if (pending) {
        if (!pending.status.isConnected) pending.body.prepend(pending.status);
        pending.status.textContent = "Antwort gestoppt";
        if (pending.content.textContent.trim()) formatAssistantAnswer(pending.content, pending.body);
        else pending.content.textContent = "Die Antwort wurde von dir gestoppt.";
      } else if (mode !== "text") {
        const stopped = document.createElement("div");
        stopped.className = "message-row assistant";
        stopped.innerHTML = `<span class="message-avatar">✳</span><div class="message-body"><div class="message-meta">Generierung gestoppt</div></div>`;
        messages.append(stopped);
      }
    } else {
      showToast(error.message);
    }
    if (!controller.signal.aborted && error.status === 429 && error.usage) {
      state.usage = error.usage;
      renderUsage();
      if (state.activeChat) await openChat(state.activeChat).catch((reloadError) => showToast(reloadError.message));
    } else if (!controller.signal.aborted && pending) {
      pending.status.textContent = "Anfrage fehlgeschlagen";
      pending.content.textContent = error.message;
    } else if (!controller.signal.aborted) {
      const failed = document.createElement("div");
      failed.className = "message-row assistant";
      failed.innerHTML = `<span class="message-avatar">!</span><div class="message-body"><div class="message-meta">Anfrage fehlgeschlagen</div><div class="message-content"></div></div>`;
      failed.querySelector(".message-content").textContent = error.message;
      messages.append(failed);
    }
  } finally {
    state.busy = false;
    state.requestController = null;
    $("#sendButton").classList.remove("hidden");
    $("#stopButton").classList.add("hidden");
    $("#stopButton").disabled = false;
    $("#stopButton").setAttribute("aria-label", "Antwort stoppen");
    $("#stopButton").title = "Antwort stoppen";
    $("#loadingIndicator").classList.add("hidden");
    messageInput.focus();
  }
}

$("#stopButton").addEventListener("click", () => {
  if (!state.requestController || state.requestController.signal.aborted) return;
  state.requestController.abort();
  $("#stopButton").disabled = true;
  $("#stopButton").setAttribute("aria-label", "Antwort wird gestoppt");
  $("#stopButton").title = "Antwort wird gestoppt";
});

$("#composerForm").addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage(messageInput.value).catch((error) => showToast(error.message));
});
messageInput.addEventListener("input", resizeComposer);
messageInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    $("#composerForm").requestSubmit();
  }
});
function resizeComposer() {
  messageInput.style.height = "auto";
  messageInput.style.height = `${Math.min(messageInput.scrollHeight, 180)}px`;
}

document.querySelectorAll(".suggestion-card").forEach((card) => {
  card.addEventListener("click", () => {
    messageInput.value = card.dataset.prompt;
    resizeComposer();
    messageInput.focus();
  });
});
$("#mediaMenuButton").addEventListener("click", () => $("#mediaMenu").classList.toggle("hidden"));
$("#deepThinkToggle").addEventListener("click", () => {
  state.deepThink = !state.deepThink;
  $("#deepThinkToggle").setAttribute("aria-pressed", String(state.deepThink));
});
$("#webSearchToggle").addEventListener("click", () => {
  state.webSearch = !state.webSearch;
  $("#webSearchToggle").setAttribute("aria-pressed", String(state.webSearch));
});
$("#mediaMenu").addEventListener("click", (event) => {
  const option = event.target.closest("[data-insert]");
  if (!option) return;
  messageInput.value = option.dataset.insert;
  $("#mediaMenu").classList.add("hidden");
  resizeComposer();
  messageInput.focus();
});
document.addEventListener("click", (event) => {
  if (!event.target.closest("#mediaMenuButton") && !event.target.closest("#mediaMenu")) $("#mediaMenu").classList.add("hidden");
});

function renderAdminUsage(data) {
  const settings = data.settings;
  $("#usageEnabled").checked = settings.enabled;
  $("#usageResetHours").value = settings.resetHours;
  $("#usageMessageLimit").value = settings.messages;
  $("#usageImageLimit").value = settings.images;
  $("#usageVideoLimit").value = settings.videos;
  const list = $("#grantList");
  list.replaceChildren();
  if (!data.grants.length) {
    const empty = document.createElement("p");
    empty.className = "settings-help";
    empty.textContent = "Noch keine Zusatzkontingente vergeben.";
    list.append(empty);
    return;
  }
  for (const grant of data.grants) {
    const row = document.createElement("div");
    row.className = "grant-row";
    const description = document.createElement("span");
    const feature = { messages: "Nachrichten", images: "Bilder", videos: "Videos" }[grant.feature];
    description.textContent = `${grant.email} · ${grant.remaining} ${feature} übrig`;
    const revoke = document.createElement("button");
    revoke.className = "private-key-delete";
    revoke.type = "button";
    revoke.textContent = "Entfernen";
    revoke.addEventListener("click", () => deleteUsageGrant(grant.id));
    row.append(description, revoke);
    list.append(row);
  }
}

async function refreshUsageAndAdmin() {
  state.usage = await api("/api/usage");
  renderUsage();
  if (state.usage.teamMember) {
    state.adminUsage = await api("/api/admin/usage");
    renderAdminUsage(state.adminUsage);
  }
}
window.refreshUsageAndAdmin = refreshUsageAndAdmin;

async function openSettings() {
  try {
    const settings = await api("/api/profile/settings");
    const requests = [api("/api/usage")];
    if (settings.teamMember) requests.push(api("/api/admin/usage"));
    const [usage, adminUsage] = await Promise.all(requests);
    state.settings = settings;
    state.usage = usage;
    state.adminUsage = settings.teamMember ? adminUsage : null;
    renderUsage();
    renderSettings();
    if (adminUsage) renderAdminUsage(adminUsage);
    $("#settingsDialog").classList.remove("hidden");
    $("#settingsDialog").setAttribute("aria-hidden", "false");
    $("#languageSelect").focus();
  } catch (error) {
    showToast(error.message);
  }
}

function closeSettings() {
  $("#settingsDialog").classList.add("hidden");
  $("#settingsDialog").setAttribute("aria-hidden", "true");
}

async function refreshPersonalProviders() {
  const [settings, providerData] = await Promise.all([
    api("/api/profile/settings"),
    api("/api/providers")
  ]);
  state.settings = settings;
  state.providers = state.providers.map((provider) => {
    const updated = providerData.providers.find((item) => item.id === provider.id);
    return updated ? {
      ...updated,
      imageModels: updated.imageModels || updated.models.filter(isImageGenerationModel)
    } : provider;
  });
  const count = state.providers.filter((provider) => provider.configured).length;
  $("#providerCount").textContent = state.settings.preferences.language === "en"
    ? `${count} providers ready`
    : `${count} Anbieter bereit`;
  renderProviderOptions();
  renderPrivateKeys();
  renderModels();
}

$("#accountButton").addEventListener("click", openSettings);
$("#usageButton").addEventListener("click", async () => {
  await openSettings();
  $("#usageSection").scrollIntoView({ behavior: "smooth", block: "start" });
});
$("#closeSettings").addEventListener("click", closeSettings);
$("#settingsDialog").addEventListener("click", (event) => {
  if (event.target === $("#settingsDialog")) closeSettings();
});
$("#keyProviderSelect").addEventListener("change", updateSharedKeyNotice);
$("#saveUsageSettings").addEventListener("click", async () => {
  const button = $("#saveUsageSettings");
  const errorElement = $("#adminUsageError");
  button.disabled = true;
  errorElement.classList.add("hidden");
  try {
    await api("/api/admin/usage", {
      method: "PUT",
      body: JSON.stringify({
        enabled: $("#usageEnabled").checked,
        resetHours: Number($("#usageResetHours").value),
        messages: Number($("#usageMessageLimit").value),
        images: Number($("#usageImageLimit").value),
        videos: Number($("#usageVideoLimit").value)
      })
    });
    await window.refreshUsageAndAdmin();
    showToast("Nutzungslimits wurden gespeichert.");
  } catch (error) {
    errorElement.textContent = error.message;
    errorElement.classList.remove("hidden");
  } finally {
    button.disabled = false;
  }
});
$("#grantForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = $("#grantForm button");
  const errorElement = $("#adminUsageError");
  button.disabled = true;
  errorElement.classList.add("hidden");
  try {
    await api("/api/admin/usage/grants", {
      method: "POST",
      body: JSON.stringify({
        email: $("#grantEmail").value,
        feature: $("#grantFeature").value,
        amount: Number($("#grantAmount").value)
      })
    });
    $("#grantEmail").value = "";
    await window.refreshUsageAndAdmin();
    showToast("Dauerhaftes Zusatzkontingent wurde vergeben.");
  } catch (error) {
    errorElement.textContent = error.message;
    errorElement.classList.remove("hidden");
  } finally {
    button.disabled = false;
  }
});

async function deleteUsageGrant(id) {
  const errorElement = $("#adminUsageError");
  errorElement.classList.add("hidden");
  try {
    await api(`/api/admin/usage/grants/${encodeURIComponent(id)}`, { method: "DELETE" });
    await window.refreshUsageAndAdmin();
    showToast("Zusatzkontingent wurde entfernt.");
  } catch (error) {
    errorElement.textContent = error.message;
    errorElement.classList.remove("hidden");
  }
}

$("#savePreferences").addEventListener("click", async () => {
  const button = $("#savePreferences");
  button.disabled = true;
  $("#settingsError").classList.add("hidden");
  try {
    const result = await api("/api/profile/settings", {
      method: "PUT",
      body: JSON.stringify({
        language: $("#languageSelect").value,
        responseStyle: $("#responseStyleSelect").value,
        customInstructions: $("#customInstructions").value
      })
    });
    state.settings.preferences = result.preferences;
    applyLanguage(result.preferences.language);
    renderSettings();
    renderProviderOptions();
    showToast(translations[result.preferences.language].saveSuccess);
  } catch (error) {
    $("#settingsError").textContent = error.message;
    $("#settingsError").classList.remove("hidden");
  } finally {
    button.disabled = false;
  }
});
$("#addKeyForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const input = $("#privateApiKey");
  const button = $("#addKeyForm button");
  const key = input.value;
  if (!key.trim()) return;
  button.disabled = true;
  $("#settingsError").classList.add("hidden");
  try {
    await api("/api/profile/provider-keys", {
      method: "POST",
      body: JSON.stringify({ provider: $("#keyProviderSelect").value, key })
    });
    input.value = "";
    await refreshPersonalProviders();
    showToast(translations[state.settings.preferences.language].keyAdded);
  } catch (error) {
    $("#settingsError").textContent = error.message;
    $("#settingsError").classList.remove("hidden");
  } finally {
    button.disabled = false;
  }
});

async function deletePrivateKey(id) {
  const dictionary = translations[state.settings.preferences.language];
  if (!confirm(state.settings.preferences.language === "en"
    ? "Delete this API key from your account?"
    : "Diesen API-Schlüssel aus deinem Konto löschen?")) return;
  try {
    await api(`/api/profile/provider-keys/${encodeURIComponent(id)}`, { method: "DELETE" });
    await refreshPersonalProviders();
    showToast(dictionary.keyDeleted);
  } catch (error) {
    $("#settingsError").textContent = error.message;
    $("#settingsError").classList.remove("hidden");
  }
}

$("#logoutButton").addEventListener("click", async () => {
  const english = state.settings.preferences.language === "en";
  if (!confirm(english
    ? "Sign out? Your saved chats will remain available."
    : "Möchtest du dich abmelden? Deine gespeicherten Chats bleiben erhalten.")) return;
  try {
    await api("/api/auth/logout", { method: "POST", body: "{}" });
    state.user = null;
    state.activeChat = null;
    closeSettings();
    setAuthenticated(null);
  } catch (error) {
    showToast(error.message);
  }
});

function closeSidebar() {
  $("#sidebar").classList.remove("open");
  $("#mobileScrim").classList.remove("visible");
}
$("#menuToggle").addEventListener("click", () => {
  $("#sidebar").classList.add("open");
  $("#mobileScrim").classList.add("visible");
});
$("#closeSidebar").addEventListener("click", closeSidebar);
$("#mobileScrim").addEventListener("click", closeSidebar);
document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    createChat().catch((error) => showToast(error.message));
  }
  if (event.key === "Escape") {
    closeSidebar();
    closeSettings();
    closeRenameDialog();
    $("#mediaMenu").classList.add("hidden");
  }
});

(async function init() {
  try {
    const { user } = await api("/api/auth/me");
    setAuthenticated(user);
  } catch (error) {
    setAuthError(error.message);
    authScreen.classList.remove("hidden");
  }
})();

setInterval(() => {
  if (state.usage) renderUsage();
}, 60_000);
