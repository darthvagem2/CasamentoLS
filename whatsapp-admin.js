let mergedGuests = [];
let selectedGuest = null;
let selectedGuestUrl = "";

document.addEventListener("DOMContentLoaded", () => {
    initializeWhatsappAdmin().catch(error => {
        console.error(error);
        setAdminMessage("Não foi possível carregar os dados do painel.", "error");
    });
});

async function initializeWhatsappAdmin() {
    document.title = `${config.whatsapp.titulo_admin} | ${config.nome_dos_noivos}`;

    setText("admin-title", config.whatsapp.titulo_admin);
    setText("admin-text", config.whatsapp.texto_admin);
    setText("admin-search-label", config.whatsapp.campo_busca);
    setPlaceholder("admin-phone-search", config.whatsapp.placeholder_busca);
    setText("admin-search-btn", config.whatsapp.botao_buscar);
    setText("copy-link-btn", config.whatsapp.botao_copiar_link);
    setText("download-qr-btn", config.whatsapp.botao_baixar_qr);
    setText("open-whatsapp-btn", config.whatsapp.botao_whatsapp);
    setText("share-qr-btn", config.whatsapp.botao_compartilhar);
    setText("send-api-btn", config.whatsapp.botao_api);

    const [guests, contacts] = await Promise.all([loadGuests(), loadContacts()]);
    mergedGuests = mergeGuestsAndContacts(guests, contacts);

    setupSearchForm();
    setupActionButtons();
    toggleApiButton();
    toggleShareButton();
}

async function loadGuests() {
    const response = await fetch("guests.json", { cache: "no-store" });
    if (!response.ok) {
        throw new Error("Não foi possível carregar guests.json");
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data.convidados || [];
}

async function loadContacts() {
    const response = await fetch("private/guest-contacts.json", { cache: "no-store" });
    if (!response.ok) {
        throw new Error("Não foi possível carregar private/guest-contacts.json");
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data.contatos || [];
}

function mergeGuestsAndContacts(guests, contacts) {
    const contactsMap = new Map(contacts.map(item => [item.guest_id, item]));

    return guests
        .map(guest => ({
            ...guest,
            telefone_whatsapp: contactsMap.get(guest.id)?.telefone_whatsapp || ""
        }))
        .filter(guest => guest.telefone_whatsapp);
}

function setupSearchForm() {
    const form = document.getElementById("admin-search-form");
    const phoneInput = document.getElementById("admin-phone-search");

    phoneInput.addEventListener("input", () => {
        phoneInput.value = phoneInput.value.replace(/\D/g, "");
    });

    form.addEventListener("submit", event => {
        event.preventDefault();

        const query = phoneInput.value.trim();
        if (!query) {
            setAdminMessage(config.whatsapp.mensagem_busca_vazia, "error");
            return;
        }

        const guest = findGuestByPhone(query);
        if (!guest) {
            selectedGuest = null;
            selectedGuestUrl = "";
            document.getElementById("admin-result").hidden = true;
            setAdminMessage(config.whatsapp.mensagem_convidado_nao_encontrado, "error");
            return;
        }

        selectedGuest = guest;
        selectedGuestUrl = buildGuestStatusUrl(guest);
        renderGuestResult(guest, selectedGuestUrl);
        setAdminMessage("", "");
    });
}

function setupActionButtons() {
    document.getElementById("copy-link-btn").addEventListener("click", async () => {
        if (!selectedGuestUrl) {
            return;
        }

        await copyToClipboard(selectedGuestUrl);
        setAdminMessage(config.whatsapp.mensagem_link_copiado, "success");
    });

    document.getElementById("download-qr-btn").addEventListener("click", () => {
        if (!selectedGuest) {
            return;
        }

        downloadCurrentQr(selectedGuest);
    });

    document.getElementById("open-whatsapp-btn").addEventListener("click", () => {
        if (!selectedGuest || !selectedGuest.telefone_whatsapp) {
            return;
        }

        const url = buildWhatsappUrl(selectedGuest, selectedGuestUrl);
        window.open(url, "_blank", "noopener,noreferrer");
    });

    document.getElementById("share-qr-btn").addEventListener("click", async () => {
        if (!selectedGuest) {
            return;
        }

        await shareQrCode(selectedGuest);
    });

    document.getElementById("send-api-btn").addEventListener("click", async () => {
        if (!selectedGuest || config.whatsapp.modo_envio !== "api" || !config.whatsapp.api_endpoint) {
            return;
        }

        try {
            const payload = await buildApiPayload(selectedGuest, selectedGuestUrl);
            await sendToWhatsappApi(payload);
            setAdminMessage(config.whatsapp.mensagem_api_sucesso, "success");
        } catch (error) {
            console.error(error);
            setAdminMessage(config.whatsapp.mensagem_api_erro, "error");
        }
    });
}

function toggleApiButton() {
    const apiButton = document.getElementById("send-api-btn");
    const shouldShow = config.whatsapp.modo_envio === "api" && Boolean(config.whatsapp.api_endpoint);
    apiButton.hidden = !shouldShow;
}

function toggleShareButton() {
    const shareButton = document.getElementById("share-qr-btn");
    shareButton.hidden = !(navigator.share && navigator.canShare);
}

function findGuestByPhone(phoneNumber) {
    const normalizedQuery = normalizeDigits(phoneNumber);
    return mergedGuests.find(guest => normalizeDigits(guest.telefone_whatsapp) === normalizedQuery);
}

function buildGuestStatusUrl(guest) {
    const baseUrl = getPublicBaseUrl();
    const url = new URL("guest-status.html", baseUrl);
    url.searchParams.set("guest", guest.id);
    url.searchParams.set("status", getCurrentGuestStatus(guest) || "");
    return url.toString();
}

function getPublicBaseUrl() {
    if (config.base_url_publico) {
        const normalized = String(config.base_url_publico).trim();
        if (normalized.endsWith(".html")) {
            return normalized;
        }

        return normalized.endsWith("/") ? normalized : `${normalized}/`;
    }

    return window.location.href;
}

function renderGuestResult(guest, guestUrl) {
    const adminResult = document.getElementById("admin-result");
    const statusInfo = resolveStatusInfo(getCurrentGuestStatus(guest));

    setText("admin-guest-name", guest.nome);
    setText("admin-guest-phone", `WhatsApp: ${formatPhone(guest.telefone_whatsapp)}`);
    setText("admin-guest-status", `Status atual: ${statusInfo.label}`);
    setText("admin-guest-link", guestUrl);
    setText("message-preview", buildWhatsappMessage(guest, guestUrl, statusInfo.label));

    renderQrCode(guestUrl);
    adminResult.hidden = false;
}

function renderQrCode(text) {
    const preview = document.getElementById("qr-preview");
    preview.innerHTML = "";

    // O QRCode é gerado no navegador para manter o fluxo simples de editar e publicar.
    new QRCode(preview, {
        text,
        width: 240,
        height: 240,
        colorDark: "#243022",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
}

function buildWhatsappMessage(guest, guestUrl, statusLabel) {
    return config.whatsapp.mensagem_whatsapp
        .replace("{nome}", guest.nome)
        .replace("{evento}", config.nome_dos_noivos)
        .replace("{link}", guestUrl)
        .replace("{status}", statusLabel);
}

function buildWhatsappUrl(guest, guestUrl) {
    const message = buildWhatsappMessage(guest, guestUrl, resolveStatusInfo(getCurrentGuestStatus(guest)).label);
    return `https://wa.me/${normalizeDigits(guest.telefone_whatsapp)}?text=${encodeURIComponent(message)}`;
}

async function buildApiPayload(guest, guestUrl) {
    return {
        guest_id: guest.id,
        nome: guest.nome,
        telefone_whatsapp: normalizeDigits(guest.telefone_whatsapp),
        status: resolveStatusInfo(getCurrentGuestStatus(guest)).label,
        link_qr: guestUrl,
        mensagem: buildWhatsappMessage(guest, guestUrl, resolveStatusInfo(getCurrentGuestStatus(guest)).label),
        qr_data_url: await getQrDataUrl()
    };
}

async function sendToWhatsappApi(payload) {
    const response = await fetch(config.whatsapp.api_endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error("Falha ao enviar para a API.");
    }

    return response.json().catch(() => ({}));
}

async function shareQrCode(guest) {
    if (!navigator.share || !navigator.canShare) {
        setAdminMessage("Compartilhamento direto não está disponível neste navegador.", "warning");
        return;
    }

    try {
        const qrFile = await buildQrFile(guest);
        if (!navigator.canShare({ files: [qrFile] })) {
            setAdminMessage("Este navegador não permite compartilhar arquivos diretamente.", "warning");
            return;
        }

        await navigator.share({
            title: `QR de ${guest.nome}`,
            text: buildWhatsappMessage(guest, selectedGuestUrl, resolveStatusInfo(getCurrentGuestStatus(guest)).label),
            files: [qrFile]
        });
    } catch (error) {
        if (error.name !== "AbortError") {
            console.error(error);
            setAdminMessage("Não foi possível compartilhar o QR agora.", "error");
        }
    }
}

function downloadCurrentQr(guest) {
    getQrDownloadData()
        .then(({ dataUrl, extension }) => {
            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = `${slugify(guest.nome)}-qr.${extension}`;
            link.click();
        })
        .catch(error => {
            console.error(error);
            setAdminMessage("Não foi possível baixar o QR agora.", "error");
        });
}

async function buildQrFile(guest) {
    const { dataUrl } = await getQrDownloadData();
    const blob = await dataUrlToBlob(dataUrl);
    return new File([blob], `${slugify(guest.nome)}-qr.png`, { type: "image/png" });
}

async function getQrDataUrl() {
    const { dataUrl } = await getQrDownloadData();
    return dataUrl;
}

async function getQrDownloadData() {
    const preview = document.getElementById("qr-preview");
    const canvas = preview.querySelector("canvas");
    const image = preview.querySelector("img");

    if (canvas) {
        return {
            dataUrl: canvas.toDataURL("image/png"),
            extension: "png"
        };
    }

    if (image) {
        return {
            dataUrl: image.src,
            extension: "png"
        };
    }

    throw new Error("QR não encontrado.");
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
            label: config.whatsapp.mensagem_status_confirmado
        };
    }

    if (["nao", "nao_confirmado", "recusado", "recusada", "ausente"].includes(normalized)) {
        return {
            label: config.whatsapp.mensagem_status_nao_confirmado
        };
    }

    return {
        label: config.whatsapp.mensagem_status_pendente
    };
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

    return `${slugify(guest.nome)}-${normalizeLast4(guest.telefone_ultimos4)}`;
}

function normalizeStatus(value) {
    return String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "_");
}

function normalizeDigits(value) {
    return String(value || "").replace(/\D/g, "");
}

function normalizeLast4(value) {
    return normalizeDigits(value).slice(-4);
}

function slugify(value) {
    return String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function formatPhone(value) {
    const digits = normalizeDigits(value);
    return digits ? `+${digits}` : "Não informado";
}

async function dataUrlToBlob(dataUrl) {
    const response = await fetch(dataUrl);
    return response.blob();
}

async function copyToClipboard(value) {
    if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
        return;
    }

    const helper = document.createElement("textarea");
    helper.value = value;
    helper.setAttribute("readonly", "");
    helper.style.position = "absolute";
    helper.style.left = "-9999px";
    document.body.appendChild(helper);
    helper.select();
    document.execCommand("copy");
    document.body.removeChild(helper);
}

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value || "";
    }
}

function setPlaceholder(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.placeholder = value || "";
    }
}

function setAdminMessage(text, type) {
    const target = document.getElementById("admin-message");
    target.textContent = text || "";
    target.className = type ? `form-status is-${type}` : "form-status";
}
