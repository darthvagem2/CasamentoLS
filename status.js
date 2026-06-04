document.addEventListener("DOMContentLoaded", () => {
    if (!window.config || typeof window.config !== "object") {
        renderConfigErrorState();
        return;
    }

    initializeStatusPage().catch(error => {
        console.error(error);
        renderInvalidGuestState(config.whatsapp.mensagem_qr_invalido);
    });
});

async function initializeStatusPage() {
    document.title = `${config.whatsapp.titulo_status} | ${config.nome_dos_noivos}`;

    setText("status-title", config.whatsapp.titulo_status);
    setText("status-text", config.whatsapp.texto_status);
    setText("speak-status-btn", config.whatsapp.botao_ouvir_novamente);
    toggleSpeechButton();

    const params = new URLSearchParams(window.location.search);
    const guestId = params.get("guest");
    const statusFromQr = params.get("status");
    if (!guestId) {
        renderInvalidGuestState(config.whatsapp.mensagem_qr_invalido);
        return;
    }

    const guests = await loadGuests();
    const guest = guests.find(item => String(item.id || "").trim() === guestId);

    if (!guest) {
        renderInvalidGuestState(config.whatsapp.mensagem_qr_invalido);
        return;
    }

    const statusInfo = resolveStatusInfo(statusFromQr || getCurrentGuestStatus(guest));
    renderGuestState(guest, statusInfo);
    setupSpeechButton(guest, statusInfo);
    speakGuestStatus(guest.nome, statusInfo);
}

async function loadGuests() {
    const response = await fetch("guests.json", { cache: "no-store" });
    if (!response.ok) {
        throw new Error("Não foi possível carregar guests.json");
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data.convidados || [];
}

function getCurrentGuestStatus(guest) {
    const localReplies = getStoredReplies();
    const guestId = getGuestId(guest);

    if (localReplies[guestId] && localReplies[guestId].resposta_valor) {
        return localReplies[guestId].resposta_valor;
    }

    return guest.status;
}

function resolveStatusInfo(statusValue) {
    const normalized = normalizeStatus(statusValue);

    if (["sim", "confirmado", "confirmada", "presente"].includes(normalized)) {
        return {
            label: config.whatsapp.mensagem_status_confirmado,
            className: "status-badge status-badge--success",
            panelClassName: "status-panel status-panel--success",
            detail: "Este convidado está com a presença confirmada.",
            speech: config.whatsapp.fala_confirmado
        };
    }

    if (["nao", "nao_confirmado", "recusado", "recusada", "ausente"].includes(normalized)) {
        return {
            label: config.whatsapp.mensagem_status_nao_confirmado,
            className: "status-badge status-badge--danger",
            panelClassName: "status-panel status-panel--danger",
            detail: "Este convidado informou que não poderá comparecer.",
            speech: config.whatsapp.fala_nao_confirmado
        };
    }

    return {
        label: config.whatsapp.mensagem_status_pendente,
        className: "status-badge status-badge--warning",
        panelClassName: "status-panel status-panel--warning",
        detail: "Ainda não existe confirmação registrada para este convidado.",
        speech: config.whatsapp.fala_pendente
    };
}

function renderGuestState(guest, statusInfo) {
    const statusPanel = document.getElementById("status-panel");
    const statusBadge = document.getElementById("status-badge");

    statusPanel.className = statusInfo.panelClassName;
    statusBadge.className = statusInfo.className;
    statusBadge.textContent = statusInfo.label;

    setText("guest-name", guest.nome);
    setText("guest-detail", statusInfo.detail);
    setText("guest-event", `Evento: ${config.nome_dos_noivos}`);
}

function renderInvalidGuestState(message) {
    const statusPanel = document.getElementById("status-panel");
    const statusBadge = document.getElementById("status-badge");

    if (!statusPanel || !statusBadge) {
        return;
    }

    statusPanel.className = "status-panel status-panel--danger";
    statusBadge.className = "status-badge status-badge--danger";
    statusBadge.textContent = "QR inválido";

    setText("guest-name", "Convidado não localizado");
    setText("guest-detail", message);
    setText("guest-event", `Evento: ${config.nome_dos_noivos}`);
}

function renderConfigErrorState() {
    document.title = "Convite indisponível";
    setText("status-title", "Convite indisponível");
    setText("status-text", "Não foi possível carregar a configuração desta página.");
    setText("guest-name", "Arquivo ausente");
    setText("guest-detail", "Verifique se config.js e guests.json foram publicados no GitHub Pages.");
    setText("guest-event", "");

    const statusPanel = document.getElementById("status-panel");
    const statusBadge = document.getElementById("status-badge");
    if (statusPanel) {
        statusPanel.className = "status-panel status-panel--danger";
    }

    if (statusBadge) {
        statusBadge.className = "status-badge status-badge--danger";
        statusBadge.textContent = "Erro";
    }
}

function setupSpeechButton(guest, statusInfo) {
    const button = document.getElementById("speak-status-btn");
    if (!button) {
        return;
    }

    button.addEventListener("click", () => {
        speakGuestStatus(guest.nome, statusInfo);
    });
}

function toggleSpeechButton() {
    const button = document.getElementById("speak-status-btn");
    if (!button) {
        return;
    }

    if (!("speechSynthesis" in window)) {
        button.hidden = true;
    }
}

function speakGuestStatus(name, statusInfo) {
    if (!("speechSynthesis" in window)) {
        return;
    }

    const text = statusInfo.speech.replace("{nome}", name);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-BR";
    utterance.rate = 0.95;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
}

function getStoredReplies() {
    try {
        return JSON.parse(localStorage.getItem(config.armazenamento_local_rsvp) || "{}");
    } catch (error) {
        return {};
    }
}

function getGuestId(guest) {
    if (guest.id) {
        return String(guest.id);
    }

    return `${normalizeName(guest.nome)}-${normalizeDigits(guest.telefone_ultimos4)}`;
}

function normalizeStatus(value) {
    return String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "_");
}

function normalizeName(value) {
    return String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
}

function normalizeDigits(value) {
    return String(value || "").replace(/\D/g, "").slice(-4);
}

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value || "";
    }
}
