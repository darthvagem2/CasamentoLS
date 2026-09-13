let currentGuestStatusUrl = "";

document.addEventListener("DOMContentLoaded", () => {
    if (!window.config || typeof window.config !== "object") {
        renderConfigErrorState();
        return;
    }

    initializeStatusPage().catch(error => {
        console.error("Erro ao identificar convidado:", error);
        renderInvalidGuestState(config.whatsapp.mensagem_qr_invalido);
    });
});

async function initializeStatusPage() {
    document.title = `${config.whatsapp.titulo_status} | ${config.nome_dos_noivos}`;

    setText("status-title", config.whatsapp.titulo_status);
    setText("status-text", config.whatsapp.texto_status);
    setText("speak-status-btn", config.whatsapp.botao_ouvir_novamente);
    setText("copy-status-link-btn", config.whatsapp.botao_copiar_link);
    setText("download-status-qr-btn", config.whatsapp.botao_baixar_qr);

    toggleSpeechButton();

    const params = new URLSearchParams(window.location.search);

    const guestRaw = params.get("guest");
    const statusFromQr = params.get("status");

    if (!guestRaw) {
        console.warn("QR sem parâmetro guest.");
        renderInvalidGuestState(config.whatsapp.mensagem_qr_invalido);
        return;
    }

    const guests = await loadGuests();

    console.log("ID recebido pelo QR:", guestRaw);
    console.log("ID normalizado:", normalizeGuestKey(guestRaw));
    console.log("Quantidade de convidados carregados:", guests.length);

    const guest = findGuestByToken(guests, guestRaw);

    if (!guest) {
        console.warn(
            "Convidado não encontrado para o token:",
            guestRaw,
            normalizeGuestKey(guestRaw)
        );

        renderInvalidGuestState(config.whatsapp.mensagem_qr_invalido);
        return;
    }

    console.log(
        "Convidado encontrado:",
        guest.nome,
        "ID:",
        guest.id
    );

    const statusInfo = resolveStatusInfo(
        statusFromQr || getCurrentGuestStatus(guest)
    );

    renderGuestState(guest, statusInfo);

    currentGuestStatusUrl = buildGuestStatusUrl(guest);
    renderGuestQr(guest, currentGuestStatusUrl);
    setupQrActionButtons(guest);

    setupSpeechButton(guest, statusInfo);

    speakGuestStatus(guest.nome, statusInfo);
}


/*
========================================================
CARREGAMENTO DOS CONVIDADOS
========================================================
*/

async function loadGuests() {
    /*
     * Date.now() impede inclusive cache intermediário/CDN
     * de devolver guests.json antigo.
     */
    const guestsUrl = `guests.json?v=${Date.now()}`;

    const response = await fetch(guestsUrl, {
        cache: "no-store"
    });

    if (!response.ok) {
        throw new Error(
            `Não foi possível carregar guests.json. HTTP ${response.status}`
        );
    }

    const data = await response.json();

    const guests = Array.isArray(data)
        ? data
        : data.convidados;

    if (!Array.isArray(guests)) {
        throw new Error("Formato inválido do guests.json");
    }

    return guests;
}


/*
========================================================
IDENTIFICAÇÃO DO CONVIDADO
========================================================
*/

/*
 * Transforma formatos diferentes na mesma chave.
 *
 * Exemplos:
 *
 * "Marcos Peres"
 * "marcos-peres"
 * " MARCOS_PERES "
 *
 * viram:
 *
 * "marcos-peres"
 */
function normalizeGuestKey(value) {
    if (value == null) {
        return "";
    }

    let text = String(value);

    /*
     * Caso por algum motivo tenha vindo uma URL inteira
     * dentro do parâmetro.
     */
    try {
        if (
            text.startsWith("http://") ||
            text.startsWith("https://")
        ) {
            const parsed = new URL(text);

            const nestedGuest = parsed.searchParams.get("guest");

            if (nestedGuest) {
                text = nestedGuest;
            }
        }
    } catch (error) {
        // Continua usando o texto original.
    }

    /*
     * URLSearchParams normalmente já decodifica,
     * porém mantemos compatibilidade com QR antigo.
     */
    try {
        text = decodeURIComponent(text);
    } catch (error) {
        // Ignora encoding inválido.
    }

    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()

        /*
         * Remove prefixos antigos possíveis.
         */
        .replace(
            /^(guest|guestid|guest-id|convidado|id)[\s:_=\-]*/i,
            ""
        )

        /*
         * Qualquer espaço, underscore, barra etc.
         * vira hífen.
         */
        .replace(/[^a-z0-9]+/g, "-")

        /*
         * Remove hífens duplicados.
         */
        .replace(/-+/g, "-")

        /*
         * Remove hífen inicial/final.
         */
        .replace(/^-|-$/g, "");
}


/*
 * Retorna vários IDs possíveis para o mesmo convidado.
 *
 * Isso mantém compatibilidade com QR Codes gerados
 * por versões anteriores do site.
 */
function getGuestAliases(guest) {
    const aliases = new Set();

    const id = guest.id || "";

    const name =
        guest.nome ||
        guest.name ||
        "";

    const phone =
        normalizeDigits(
            guest.telefone_ultimos4 ||
            guest.phoneLast4 ||
            ""
        );

    /*
     * ID atual do guests.json.
     */
    if (id) {
        aliases.add(normalizeGuestKey(id));
    }

    /*
     * Nome convertido em slug.
     *
     * Ex:
     * Marcos Peres -> marcos-peres
     */
    if (name) {
        aliases.add(normalizeGuestKey(name));
    }

    /*
     * Compatibilidade com IDs antigos no formato:
     *
     * Marcos Peres-0304
     *
     * ou
     *
     * marcos-peres-0304
     */
    if (name && phone) {
        aliases.add(
            normalizeGuestKey(`${name}-${phone}`)
        );
    }

    /*
     * Outra possibilidade de versões antigas:
     *
     * marcos-peres-0304
     */
    if (id && phone) {
        aliases.add(
            normalizeGuestKey(`${id}-${phone}`)
        );
    }

    return [...aliases].filter(Boolean);
}


/*
 * Procura o convidado usando qualquer formato conhecido.
 */
function findGuestByToken(guests, rawToken) {
    const token = normalizeGuestKey(rawToken);

    if (!token) {
        return null;
    }

    /*
     * Primeiro tenta o ID oficial.
     */
    const exactIdMatch = guests.find(guest => {
        return normalizeGuestKey(guest.id || "") === token;
    });

    if (exactIdMatch) {
        return exactIdMatch;
    }

    /*
     * Depois tenta IDs legados.
     */
    const matches = guests.filter(guest => {
        const aliases = getGuestAliases(guest);

        return aliases.includes(token);
    });

    if (matches.length === 1) {
        return matches[0];
    }

    /*
     * Nunca escolhe aleatoriamente se houver
     * dois convidados compatíveis.
     */
    if (matches.length > 1) {
        console.error(
            "Mais de um convidado corresponde ao QR:",
            token,
            matches
        );

        return null;
    }

    return null;
}


/*
========================================================
STATUS
========================================================
*/

function getCurrentGuestStatus(guest) {
    const localReplies = getStoredReplies();

    const guestId = getGuestId(guest);

    /*
     * Procura pelo ID atual.
     */
    if (
        localReplies[guestId] &&
        localReplies[guestId].resposta_valor
    ) {
        return localReplies[guestId].resposta_valor;
    }

    /*
     * Compatibilidade com possíveis chaves antigas
     * existentes no localStorage.
     */
    const aliases = getGuestAliases(guest);

    for (const [storedId, reply] of Object.entries(localReplies)) {
        if (
            aliases.includes(normalizeGuestKey(storedId)) &&
            reply &&
            reply.resposta_valor
        ) {
            return reply.resposta_valor;
        }
    }

    return guest.status;
}


function resolveStatusInfo(statusValue) {
    const normalized = normalizeStatus(statusValue);

    if (
        [
            "sim",
            "confirmado",
            "confirmada",
            "presente"
        ].includes(normalized)
    ) {
        return {
            label:
                config.whatsapp.mensagem_status_confirmado,

            className:
                "status-badge status-badge--success",

            panelClassName:
                "status-panel status-panel--success",

            detail:
                "Este convidado está com a presença confirmada.",

            speech:
                config.whatsapp.fala_confirmado
        };
    }

    if (
        [
            "nao",
            "nao_confirmado",
            "recusado",
            "recusada",
            "ausente"
        ].includes(normalized)
    ) {
        return {
            label:
                config.whatsapp.mensagem_status_nao_confirmado,

            className:
                "status-badge status-badge--danger",

            panelClassName:
                "status-panel status-panel--danger",

            detail:
                "Este convidado informou que não poderá comparecer.",

            speech:
                config.whatsapp.fala_nao_confirmado
        };
    }

    return {
        label:
            config.whatsapp.mensagem_status_pendente,

        className:
            "status-badge status-badge--warning",

        panelClassName:
            "status-panel status-panel--warning",

        detail:
            "Ainda não existe confirmação registrada para este convidado.",

        speech:
            config.whatsapp.fala_pendente
    };
}


/*
========================================================
RENDERIZAÇÃO
========================================================
*/

function renderGuestState(guest, statusInfo) {
    const statusPanel =
        document.getElementById("status-panel");

    const statusBadge =
        document.getElementById("status-badge");

    if (!statusPanel || !statusBadge) {
        return;
    }

    statusPanel.className =
        statusInfo.panelClassName;

    statusBadge.className =
        statusInfo.className;

    statusBadge.textContent =
        statusInfo.label;

    setText(
        "guest-name",
        guest.nome || guest.name || "Convidado"
    );

    setText(
        "guest-detail",
        statusInfo.detail
    );

    setText(
        "guest-event",
        `Evento: ${config.nome_dos_noivos}`
    );
}


function renderGuestQr(guest, guestStatusUrl) {
    const qrSection =
        document.getElementById("status-qr");

    const preview =
        document.getElementById("status-qr-preview");

    if (!qrSection || !preview) {
        return;
    }

    qrSection.hidden =
        false;

    preview.innerHTML =
        "";

    setText(
        "status-qr-link",
        guestStatusUrl
    );

    if (!("QRCode" in window)) {
        const fallback =
            document.createElement("p");

        fallback.className =
            "guest-pass-placeholder";

        fallback.textContent =
            "Nao foi possivel renderizar o QR automaticamente neste navegador.";

        preview.appendChild(
            fallback
        );

        return;
    }

    new QRCode(preview, {
        text: guestStatusUrl,
        width: 240,
        height: 240,
        colorDark: "#243022",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    const guestName =
        guest.nome ||
        guest.name ||
        "convidado";

    preview.setAttribute(
        "aria-label",
        `QR Code do link de ${guestName}`
    );
}


function setupQrActionButtons(guest) {
    const copyButton =
        document.getElementById("copy-status-link-btn");

    const downloadButton =
        document.getElementById("download-status-qr-btn");

    if (copyButton) {
        copyButton.addEventListener("click", async () => {
            if (!currentGuestStatusUrl) {
                return;
            }

            await copyToClipboard(currentGuestStatusUrl);
        });
    }

    if (downloadButton) {
        downloadButton.addEventListener("click", () => {
            downloadStatusQr(guest);
        });
    }
}


function downloadStatusQr(guest) {
    getStatusQrDownloadData()
        .then(({ dataUrl, extension }) => {
            const link =
                document.createElement("a");

            link.href =
                dataUrl;

            link.download =
                `${slugify(guest.nome || guest.name || guest.id || "convidado")}-qr.${extension}`;

            link.click();
        })
        .catch(error => {
            console.error(
                "Nao foi possivel baixar o QR.",
                error
            );
        });
}


async function getStatusQrDownloadData() {
    const preview =
        document.getElementById("status-qr-preview");

    if (!preview) {
        throw new Error("Area do QR nao encontrada.");
    }

    const canvas =
        preview.querySelector("canvas");

    const image =
        preview.querySelector("img");

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

    throw new Error("QR nao encontrado.");
}


function renderInvalidGuestState(message) {
    const statusPanel =
        document.getElementById("status-panel");

    const statusBadge =
        document.getElementById("status-badge");

    if (!statusPanel || !statusBadge) {
        return;
    }

    statusPanel.className =
        "status-panel status-panel--danger";

    statusBadge.className =
        "status-badge status-badge--danger";

    statusBadge.textContent =
        "QR inválido";

    setText(
        "guest-name",
        "Convidado não localizado"
    );

    setText(
        "guest-detail",
        message
    );

    setText(
        "guest-event",
        `Evento: ${config.nome_dos_noivos}`
    );

    hideGuestQr();
}


function renderConfigErrorState() {
    document.title =
        "Convite indisponível";

    setText(
        "status-title",
        "Convite indisponível"
    );

    setText(
        "status-text",
        "Não foi possível carregar a configuração desta página."
    );

    setText(
        "guest-name",
        "Arquivo ausente"
    );

    setText(
        "guest-detail",
        "Verifique se config.js e guests.json foram publicados no GitHub Pages."
    );

    setText(
        "guest-event",
        ""
    );

    const statusPanel =
        document.getElementById("status-panel");

    const statusBadge =
        document.getElementById("status-badge");

    if (statusPanel) {
        statusPanel.className =
            "status-panel status-panel--danger";
    }

    if (statusBadge) {
        statusBadge.className =
            "status-badge status-badge--danger";

        statusBadge.textContent =
            "Erro";
    }

    hideGuestQr();
}


/*
========================================================
ÁUDIO
========================================================
*/

function setupSpeechButton(guest, statusInfo) {
    const button =
        document.getElementById("speak-status-btn");

    if (!button) {
        return;
    }

    button.addEventListener("click", () => {
        speakGuestStatus(
            guest.nome || guest.name || "Convidado",
            statusInfo
        );
    });
}


function toggleSpeechButton() {
    const button =
        document.getElementById("speak-status-btn");

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

    const speechTemplate =
        statusInfo.speech ||
        "{nome}";

    const text =
        speechTemplate.replace(
            "{nome}",
            name
        );

    const utterance =
        new SpeechSynthesisUtterance(text);

    utterance.lang =
        "pt-BR";

    utterance.rate =
        0.95;

    window.speechSynthesis.cancel();

    window.speechSynthesis.speak(
        utterance
    );
}


/*
========================================================
LOCAL STORAGE
========================================================
*/

function getStoredReplies() {
    try {
        return JSON.parse(
            localStorage.getItem(
                config.armazenamento_local_rsvp
            ) || "{}"
        );
    } catch (error) {
        console.warn(
            "Não foi possível ler respostas locais.",
            error
        );

        return {};
    }
}


/*
========================================================
UTILITÁRIOS
========================================================
*/

function getGuestId(guest) {
    if (guest.id) {
        return String(guest.id);
    }

    return `${normalizeName(guest.nome)}-${normalizeDigits(
        guest.telefone_ultimos4
    )}`;
}


function buildGuestStatusUrl(guest) {
    const baseUrl =
        getPublicBaseUrl();

    const url =
        new URL("guest-status.html", baseUrl);

    url.searchParams.set(
        "guest",
        getGuestId(guest)
    );

    return url.toString();
}


function getPublicBaseUrl() {
    if (config.base_url_publico) {
        const normalized =
            String(config.base_url_publico).trim();

        if (normalized.endsWith(".html")) {
            return normalized;
        }

        return normalized.endsWith("/")
            ? normalized
            : `${normalized}/`;
    }

    return window.location.href;
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
    return String(value || "")
        .replace(/\D/g, "")
        .slice(-4);
}


function slugify(value) {
    return String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "convidado";
}


async function copyToClipboard(value) {
    if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
        return;
    }

    const helper =
        document.createElement("textarea");

    helper.value =
        value;

    helper.setAttribute(
        "readonly",
        ""
    );

    helper.style.position =
        "absolute";

    helper.style.left =
        "-9999px";

    document.body.appendChild(
        helper
    );

    helper.select();

    document.execCommand(
        "copy"
    );

    document.body.removeChild(
        helper
    );
}


function hideGuestQr() {
    const qrSection =
        document.getElementById("status-qr");

    const preview =
        document.getElementById("status-qr-preview");

    if (qrSection) {
        qrSection.hidden =
            true;
    }

    if (preview) {
        preview.innerHTML =
            "";
    }

    setText(
        "status-qr-link",
        ""
    );
}


function setText(id, value) {
    const element =
        document.getElementById(id);

    if (element) {
        element.textContent =
            value || "";
    }
}
