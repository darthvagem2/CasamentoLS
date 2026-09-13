let guestsCache = null;
let guestPassRefreshTimer = null;
let adminScanner = null;
let adminScannerActive = false;
let lastAdminScanValue = "";
let lastAdminScanTimestamp = 0;
let cloudRepliesMap = {};
let cloudRepliesUnsubscribe = null;
let cloudMessages = [];
let cloudMessagesUnsubscribe = null;
let weddingCountdownTimer = null;
const LANGUAGE_STORAGE_KEY = "casamento-language-v1";
const BASE_CONFIG_SNAPSHOT = JSON.parse(JSON.stringify(window.config || {}));
let currentLanguage = "pt";
const LANGUAGE_CONTENT = {
    pt: {
        htmlLang: "pt-BR",
        static: {
            openingSoundButton: "Ativar som",
            welcomeEyebrow: "Boas-vindas",
            eventEyebrow: "Cerimônia",
            mapEyebrow: "Mapa",
            attireEyebrow: "Traje",
            pixEyebrow: "Presentes",
            infoCardLabels: ["Noivos", "Data", "Hor\u00e1rio", "Local", "Endere\u00e7o completo", "E-mail"],
            pixKeyLabel: "Chave PIX",
            pixBeneficiaryLabel: "Favorecido:",
            giftsEyebrow: "Carinho",
            messageNameLabel: "Seu nome",
            messageEmailLabel: "Seu e-mail (opcional)",
            messageTextLabel: "Mensagem",
            rsvpEyebrow: "RSVP",
            countdownDays: "dias",
            countdownHours: "horas",
            countdownMinutes: "min",
            countdownSeconds: "seg",
            guestNameLabel: "Primeiro e último nome",
            phoneLast4Label: "Últimos 4 dígitos do telefone",
            rsvpLegend: "Confirmação",
            attendingYesHelp: "Seu nome será registrado como confirmado.",
            attendingNoHelp: "Vamos registrar sua resposta com carinho.",
            accessEyebrow: "Acesso",
            guestPassStatusLabel: "Status",
            guestPassResponseLabel: "Resposta enviada",
            privateEyebrow: "Privado",
            adminEyebrow: "Admin",
            adminScannerEyebrow: "Scanner",
            adminManualLabel: "Validação manual",
            adminEntriesEyebrow: "Entradas",
            adminMessagesEyebrow: "Mensagens",
            adminControlsEyebrow: "Controles",
            adminControlsTitle: "Gerenciamento",
            sendLoading: "Enviando...",
            guestCountNotFound: "Convidado ainda não localizado.",
            guestCountSingular: "convidado",
            guestCountPlural: "convidados",
            guestCountFamilyLimit: "{familia}: limite máximo de {maximo} {convidados}.",
            guestPassNone: "Nenhum convidado confirmado neste dispositivo",
            guestPassWaiting: "Aguardando RSVP",
            guestIdentified: "Convidado identificado",
            entryRemove: "Remover entrada",
            messageReceived: "Recebida",
            messageNameless: "Mensagem sem nome",
            emailNotInformed: "Não informado",
            sentAt: "Enviada em",
            familyLabel: "Família",
            familyNotInformed: "Não informada",
            confirmedLabel: "Confirmados",
            phoneFinalLabel: "Telefone final",
            phoneNotInformed: "Não informado",
            waitingReply: "Aguardando resposta"
        }
    },
    en: {
        htmlLang: "en",
        config: {
            frase_principal: "By the grace of God, we are delighted to share this moment with you.",
            traje: "Formal attire",
            link_mapa_label: "Open route in Google Maps",
            textos: {
                titulo_pagina: "Wedding Invitation | Sandro Lucilene",
                subtitulo_video: "Special invitation",
                titulo_video: "A beautiful beginning",
                texto_video: "Watch the opening video and join us in celebrating this unforgettable day.",
                texto_botao_entrada: "Enter",
                hero_eyebrow: "Wedding invitation",
                hero_card_label: "Religious ceremony",
                texto_botao_confirmar: "Confirm attendance",
                texto_botao_local: "View location",
                titulo_boas_vindas: "Your presence will make this day even more memorable",
                mensagem_boas_vindas: "With love, joy, and gratitude, we created this digital invitation to share every detail of our wedding with the people who are part of our story.",
                titulo_informacoes: "Wedding information",
                texto_informacoes: "Save this moment on your calendar and find the essential details below to celebrate with us.",
                titulo_mapa: "How to get there",
                rotulo_mapa: "Event venue",
                titulo_presentes: "Messages with love",
                texto_presentes: "If you wish, leave a special message for the couple. It will be sent by email with love.",
                texto_mensagens: "We would love to receive your words, blessings, and heartfelt memories of this moment. Your message will be sent directly to our email.",
                texto_botao_enviar_mensagem: "Send message",
                texto_pix: "We suggest that your gift be a PIX donation to the church.",
                titulo_rsvp: "Confirm your attendance",
                texto_rsvp: "Fill in your details exactly as registered to validate your RSVP on the guest list.",
                texto_rsvp_prazo: "RSVP by 07/10/2026.",
                titulo_cronometro: "Countdown to the big day",
                texto_rsvp_apoio: "The system compares your name and the last 4 digits of your phone number with the guest list. The quantity field is only enabled when both are correct.",
                label_quantidade_convidados: "Number of guests in the family",
                texto_quantidade_convidados: "Select how many people from this family will attend. The limit follows the family registration in guests.json.",
                placeholder_quantidade_convidados: "Fill in name and phone to unlock options",
                texto_botao_enviar_rsvp: "Send RSVP",
                opcao_comparecer: "I will attend",
                opcao_nao_comparecer: "I won't be able to attend",
                linha_rodape: "If you have any questions, contact us by email below. We will be happy to help.",
                assinatura_rodape: "Made with love to celebrate this special day.",
                mensagem_pix_copiado: "PIX key copied successfully.",
                mensagem_convidado_nao_encontrado: "We could not find your details on the list. Please check your full name and the last 4 digits of your phone number.",
                mensagem_convidado_ja_confirmou: "This confirmation has already been recorded for this guest.",
                mensagem_campos_incompletos: "Fill in your first and last name, the last 4 digits of your phone number, and choose an RSVP option.",
                mensagem_confirmacao_enviada: "Your response has been successfully recorded. Thank you for confirming.",
                mensagem_mensagem_incompleta: "Fill in your name and write your message before sending.",
                mensagem_mensagem_enviada: "Your message has been sent with love. Thank you very much.",
                mensagem_erro_envio: "We couldn't send your RSVP right now. Please try again in a few moments.",
                mensagem_erro_mensagem: "We couldn't send your message right now. Please try again in a few moments.",
                mensagem_erro_lista: "We couldn't load the guest list. Publish the site on a server to test the RSVP with guests.json.",
                texto_botao_copiar_pix: "Copy key",
                texto_botao_ativar_som: "Turn sound on",
                texto_botao_desativar_som: "Turn sound off"
            },
            acesso_convidado: {
                titulo: "Your access QR Code",
                texto: "After confirmation on this device, your individual QR code will appear here automatically starting 1 hour before the event.",
                mensagem_sem_confirmacao: "Confirm your attendance on this device to generate your personalized QR code.",
                mensagem_aguardando_liberacao: "Your QR has not been released yet. It will appear automatically in {tempo}.",
                mensagem_qr_liberado: "Your QR is already available on this device. Present it at the entrance when you arrive.",
                mensagem_qr_nao_comparece: "Your response was recorded as an absence. Therefore, no access QR will be released on this device.",
                mensagem_qr_indisponivel: "The QR is not available at the moment.",
                mensagem_qr_sem_biblioteca: "The QR could not be rendered automatically in this browser, but the identification link remains available below.",
                mensagem_status_dispositivo: "This QR is saved in the browser used to confirm attendance. If you switch devices, you will need to confirm again on the new device or use the individual link.",
                mensagem_status_confirmado: "Confirmed for entry",
                mensagem_status_nao_comparece: "Absence recorded",
                mensagem_status_pendente: "Awaiting confirmation",
                link_identificacao: "Open guest identification"
            },
            admin: {
                titulo_acesso: "Restricted access",
                texto_acesso: "At the bottom of the page there is a discreet field to unlock the administration controls for this invitation.",
                label_codigo: "Administration code",
                placeholder_codigo: "Enter the secret code",
                botao_liberar: "Unlock panel",
                botao_sair: "Exit admin mode",
                titulo_painel: "Administrative panel",
                texto_painel: "Use this panel as this device's administrative base to track confirmations, register entries, export reports, and organize the local list.",
                titulo_scanner: "QR Code scanner",
                texto_scanner: "Point the camera at the QR or paste the encoded link manually if you need to validate a guest without a camera.",
                botao_abrir_camera: "Open camera",
                botao_fechar_camera: "Close camera",
                botao_validar_manual: "Validate code",
                placeholder_manual: "Paste the QR Code content here",
                titulo_entradas: "Confirmations and entries list",
                texto_entradas: "Each confirmation saved on this device appears here. When the QR is scanned, the entry time is also recorded.",
                titulo_mensagens: "Received messages",
                texto_mensagens: "Here you can see all the heartfelt messages sent through the website and saved to the central base.",
                botao_limpar_entradas: "Clear entries",
                botao_resetar_registros: "Reset local records",
                botao_copiar_relatorio: "Copy report",
                botao_exportar_planilha: "Download CSV",
                botao_exportar_pdf: "Generate PDF report",
                estatistica_total: "Panel records",
                estatistica_confirmados: "Confirmed",
                estatistica_pendentes: "Pending/absence",
                mensagem_codigo_invalido: "Incorrect code. Please check and try again.",
                mensagem_painel_liberado: "Admin mode unlocked on this device.",
                mensagem_camera_indisponivel: "Unable to access the camera. You can still validate the QR manually.",
                mensagem_qr_invalido: "This QR is not valid for this site's guest list.",
                mensagem_entrada_registrada: "Entry successfully registered for this guest.",
                mensagem_entrada_atualizada: "This guest had already been registered. The time was updated.",
                mensagem_registros_limpos: "The local records on this device were cleared successfully.",
                mensagem_lista_limpa: "The entries list has been cleared successfully.",
                mensagem_relatorio_copiado: "Report copied successfully.",
                mensagem_planilha_exportada: "CSV spreadsheet generated successfully.",
                mensagem_pdf_aberto: "The report preview has been opened. Use the save as PDF option.",
                texto_sem_mensagens: "No heartfelt messages have been received yet.",
                status_confirmado: "Confirmed",
                status_ausencia: "Absent",
                status_pendente: "Pending",
                status_entrada_registrada: "Entry allowed",
                status_entrada_bloqueada: "Entry blocked",
                status_entrada_nao_registrada: "Not scanned",
                texto_sem_entradas: "No confirmation or entry has been recorded on this device yet.",
                texto_sem_camera: "The camera reader is not available right now. Use manual validation to continue.",
                texto_aviso_seguranca: "As this project works without a backend, admin mode is protected only by this browser code."
            }
        },
        static: {
            openingSoundButton: "Turn sound on",
            welcomeEyebrow: "Welcome",
            eventEyebrow: "Ceremony",
            mapEyebrow: "Map",
            attireEyebrow: "Attire",
            pixEyebrow: "Gifts",
            infoCardLabels: ["Couple", "Date", "Time", "Venue", "Full address", "Email"],
            pixKeyLabel: "PIX key",
            pixBeneficiaryLabel: "Beneficiary:",
            giftsEyebrow: "Love",
            messageNameLabel: "Your name",
            messageEmailLabel: "Your email (optional)",
            messageTextLabel: "Message",
            rsvpEyebrow: "RSVP",
            countdownDays: "days",
            countdownHours: "hours",
            countdownMinutes: "min",
            countdownSeconds: "sec",
            guestNameLabel: "First and last name",
            phoneLast4Label: "Last 4 phone digits",
            rsvpLegend: "Confirmation",
            attendingYesHelp: "Your name will be recorded as confirmed.",
            attendingNoHelp: "We will record your response with care.",
            accessEyebrow: "Access",
            guestPassStatusLabel: "Status",
            guestPassResponseLabel: "Response sent",
            privateEyebrow: "Private",
            adminEyebrow: "Admin",
            adminScannerEyebrow: "Scanner",
            adminManualLabel: "Manual validation",
            adminEntriesEyebrow: "Entries",
            adminMessagesEyebrow: "Messages",
            adminControlsEyebrow: "Controls",
            adminControlsTitle: "Management",
            sendLoading: "Sending...",
            guestCountNotFound: "Guest not found yet.",
            guestCountSingular: "guest",
            guestCountPlural: "guests",
            guestCountFamilyLimit: "{familia}: maximum limit of {maximo} {convidados}.",
            guestPassNone: "No guest confirmed on this device",
            guestPassWaiting: "Awaiting RSVP",
            guestIdentified: "Identified guest",
            entryRemove: "Remove entry",
            messageReceived: "Received",
            messageNameless: "Unnamed message",
            emailNotInformed: "Not provided",
            sentAt: "Sent at",
            familyLabel: "Family",
            familyNotInformed: "Not provided",
            confirmedLabel: "Confirmed",
            phoneFinalLabel: "Phone ending",
            phoneNotInformed: "Not provided",
            waitingReply: "Awaiting response"
        }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    try {
        ensureConfigAvailable();
        initializeLanguage();
        applyConfig();
        setupOpeningScreen();
        setupCopyPix();
        setupRevealAnimations();
        setupRsvpForm();
        setupMessageForm();
        setupWeddingCountdown();
        setupGuestPassSection();
        setupAdminAccess();
        setupStorageSync();
        initializeCloudRepliesSync();
        initializeCloudMessagesSync();
    } catch (error) {
        console.error("Falha ao inicializar o convite.", error);
        showFriendlyPageError(
            "Não foi possível carregar o convite completo agora. Atualize a página e confira se todos os arquivos foram publicados no GitHub Pages."
        );
    }
});

function ensureConfigAvailable() {
    if (!window.config || typeof window.config !== "object") {
        throw new Error("config.js não carregou corretamente.");
    }
}

function initializeLanguage() {
    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    currentLanguage = storedLanguage === "en" ? "en" : "pt";
    applyLanguage(currentLanguage);
    setupLanguageSwitcher();
}

function setupLanguageSwitcher() {
    const ptButton = document.getElementById("lang-pt-btn");
    const enButton = document.getElementById("lang-en-btn");
    if (!ptButton || !enButton) {
        return;
    }

    ptButton.addEventListener("click", () => setLanguage("pt"));
    enButton.addEventListener("click", () => setLanguage("en"));
}

function setLanguage(language) {
    const nextLanguage = language === "en" ? "en" : "pt";
    currentLanguage = nextLanguage;
    localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    applyLanguage(nextLanguage);
    applyConfig();
    renderGuestPass().catch(error => console.error(error));
    renderAdminEntries();
    renderAdminMessages();
}

function applyLanguage(language) {
    const pack = LANGUAGE_CONTENT[language] || LANGUAGE_CONTENT.pt;
    const mergedConfig = deepMerge(BASE_CONFIG_SNAPSHOT, pack.config || {});
    overwriteConfig(config, mergedConfig);
    document.documentElement.lang = pack.htmlLang || "pt-BR";
    document.body.setAttribute("data-language", language);
    updateLanguageSwitcherState(language);
    applyStaticLanguage(pack.static || {});
}

function updateLanguageSwitcherState(language) {
    const ptButton = document.getElementById("lang-pt-btn");
    const enButton = document.getElementById("lang-en-btn");
    if (ptButton) {
        ptButton.classList.toggle("is-active", language === "pt");
    }
    if (enButton) {
        enButton.classList.toggle("is-active", language === "en");
    }
}

function applyStaticLanguage(copy) {
    setTextBySelector(".opening-screen__media .opening-screen__placeholder", "");
    setTextBySelector("#boas-vindas .eyebrow", copy.welcomeEyebrow);
    setTextBySelector("#informacoes .eyebrow", copy.eventEyebrow);
    setTextBySelector("#local .eyebrow", copy.mapEyebrow);
    setTextBySelector("#traje .eyebrow", copy.attireEyebrow);
    setTextBySelector("#pix .eyebrow", copy.pixEyebrow);
    setTextBySelectorAll("#informacoes .info-card__label", copy.infoCardLabels || []);
    setTextBySelector("#pix-key-label", copy.pixKeyLabel);
    setTextBySelector("#pix-beneficiary-label", copy.pixBeneficiaryLabel);
    setTextBySelector("#mensagens .eyebrow", copy.giftsEyebrow);
    setTextBySelector("label[for='message-name']", copy.messageNameLabel);
    setTextBySelector("label[for='message-email']", copy.messageEmailLabel);
    setTextBySelector("label[for='message-text']", copy.messageTextLabel);
    setTextBySelector("#rsvp .eyebrow", copy.rsvpEyebrow);
    setText("countdown-days-label", copy.countdownDays);
    setText("countdown-hours-label", copy.countdownHours);
    setText("countdown-minutes-label", copy.countdownMinutes);
    setText("countdown-seconds-label", copy.countdownSeconds);
    setTextBySelector("label[for='guest-name']", copy.guestNameLabel);
    setTextBySelector("label[for='phone-last4']", copy.phoneLast4Label);
    setTextBySelector("#rsvp-form legend", copy.rsvpLegend);
    setTextBySelectorAll(".choice-card__content small", [copy.attendingYesHelp, copy.attendingNoHelp]);
    setTextBySelector("#acesso-convidado .eyebrow", copy.accessEyebrow);
    setTextBySelectorAll(".guest-pass-grid__label", [copy.guestPassStatusLabel, copy.guestPassResponseLabel]);
    setTextBySelector("#admin-unlock .eyebrow", copy.privateEyebrow);
    setTextBySelector("#admin-panel > .section-heading .eyebrow", copy.adminEyebrow);
    const scannerEyebrow = document.querySelector("#admin-panel .admin-module:nth-of-type(1) .eyebrow");
    if (scannerEyebrow) {
        scannerEyebrow.textContent = copy.adminScannerEyebrow;
    }
    setTextBySelector("label[for='admin-manual-qr']", copy.adminManualLabel);
    const entriesEyebrow = document.querySelector("#admin-panel .admin-module:nth-of-type(2) .eyebrow");
    if (entriesEyebrow) {
        entriesEyebrow.textContent = copy.adminEntriesEyebrow;
    }
    const messagesEyebrow = document.querySelector("#admin-panel .admin-module:nth-of-type(3) .eyebrow");
    if (messagesEyebrow) {
        messagesEyebrow.textContent = copy.adminMessagesEyebrow;
    }
    const controlsEyebrow = document.querySelector("#admin-panel .admin-module:nth-of-type(4) .eyebrow");
    if (controlsEyebrow) {
        controlsEyebrow.textContent = copy.adminControlsEyebrow;
    }
    setText("admin-controls-title", copy.adminControlsTitle);
}

function setTextBySelector(selector, value) {
    const element = document.querySelector(selector);
    if (element) {
        element.textContent = value || "";
    }
}

function setTextBySelectorAll(selector, values) {
    const elements = Array.from(document.querySelectorAll(selector));
    elements.forEach((element, index) => {
        element.textContent = values[index] || "";
    });
}

function deepMerge(base, overrides) {
    const result = Array.isArray(base) ? [...base] : { ...base };
    Object.entries(overrides || {}).forEach(([key, value]) => {
        if (value && typeof value === "object" && !Array.isArray(value)) {
            result[key] = deepMerge(base?.[key] || {}, value);
        } else {
            result[key] = value;
        }
    });
    return result;
}

function overwriteConfig(target, source) {
    Object.keys(target).forEach(key => delete target[key]);
    Object.assign(target, source);
}

function showFriendlyPageError(message) {
    document.body.classList.remove("is-locked");

    const banner = document.getElementById("app-error-banner");
    if (banner) {
        banner.hidden = false;
        banner.textContent = message;
    }
}

function applyConfig() {
    document.title = config.textos.titulo_pagina;

    setText("opening-overline", config.textos.subtitulo_video);
    setText("opening-title", config.textos.titulo_video);
    setText("opening-text", config.textos.texto_video);
    setText("enter-site-btn", config.textos.texto_botao_entrada);
    setText("opening-sound-btn", config.textos.texto_botao_ativar_som || LANGUAGE_CONTENT[currentLanguage].static.openingSoundButton);

    setText("hero-overline", config.textos.hero_eyebrow);
    setText("main-phrase", config.frase_principal);
    setText("hero-card-label", config.textos.hero_card_label);
    setText("hero-date", config.data_do_evento);
    setText("hero-time", config.horario_do_evento);
    setText("hero-location", config.nome_do_local);
    setText("hero-address", config.endereco_completo);

    setLink("hero-primary-link", "#rsvp", config.textos.texto_botao_confirmar);
    setLink("hero-secondary-link", "#local", config.textos.texto_botao_local);

    setText("welcome-title", config.textos.titulo_boas_vindas);
    setText("welcome-message", config.textos.mensagem_boas_vindas);

    setText("event-section-title", config.textos.titulo_informacoes);
    setText("event-section-text", config.textos.texto_informacoes);
    setText("info-couple-names", config.nome_dos_noivos);
    setText("event-date", config.data_do_evento);
    setText("event-time", config.horario_do_evento);
    setText("event-location", config.nome_do_local);
    setText("event-address", config.endereco_completo);
    setLink("contact-email", `mailto:${config.email_contato}`, config.email_contato);

    setText("map-title", config.textos.titulo_mapa);
    setText("map-label", config.textos.rotulo_mapa);
    setText("map-venue-name", config.nome_do_local);
    setText("map-address", config.endereco_completo);
    setLink("map-link", config.link_mapa_rotas, config.link_mapa_label);

    const mapIframe = document.getElementById("map-iframe");
    if (mapIframe) {
        mapIframe.src = config.link_mapa_embed;
    }

    setText("attire-text", config.traje);
    setText("pix-title", config.textos.titulo_pix);
    setText("pix-description", config.textos.texto_pix);
    setText("pix-key", config.chave_pix_igreja);
    setText("pix-beneficiary", config.nome_favorecido_pix);
    setText("copy-pix-btn", config.textos.texto_botao_copiar_pix || "Copiar chave");

    setText("gifts-title", config.textos.titulo_presentes);
    setText("gifts-text", config.textos.texto_presentes);
    setText("message-section-copy", config.textos.texto_mensagens);
    setText("message-submit-btn", config.textos.texto_botao_enviar_mensagem);

    setText("rsvp-title", config.textos.titulo_rsvp);
    setText("rsvp-text", config.textos.texto_rsvp);
    setText("rsvp-deadline", config.textos.texto_rsvp_prazo);
    setText("rsvp-hint", config.textos.texto_rsvp_apoio);
    setText("countdown-title", config.textos.titulo_cronometro);
    setText("guest-count-label", config.textos.label_quantidade_convidados);
    setText("guest-count-help", config.textos.texto_quantidade_convidados);
    setText("guest-count-placeholder", config.textos.placeholder_quantidade_convidados);
    setText("attending-yes-label", config.textos.opcao_comparecer);
    setText("attending-no-label", config.textos.opcao_nao_comparecer);
    setText("rsvp-submit-btn", config.textos.texto_botao_enviar_rsvp);

    setText("guest-pass-title", config.acesso_convidado.titulo);
    setText("guest-pass-text", config.acesso_convidado.texto);
    setText("guest-pass-help", config.acesso_convidado.mensagem_status_dispositivo);
    setText("guest-pass-link", config.acesso_convidado.link_identificacao);

    setText("admin-access-trigger", config.admin.titulo_acesso);
    setText("admin-access-title", config.admin.titulo_acesso);
    setText("admin-access-text", config.admin.texto_acesso);
    setText("admin-code-label", config.admin.label_codigo);
    setPlaceholder("admin-code", config.admin.placeholder_codigo);
    setText("admin-unlock-btn", config.admin.botao_liberar);
    setText("admin-panel-title", config.admin.titulo_painel);
    setText("admin-panel-text", config.admin.texto_painel);
    setText("admin-stat-total-label", config.admin.estatistica_total);
    setText("admin-stat-confirmed-label", config.admin.estatistica_confirmados);
    setText("admin-stat-pending-label", config.admin.estatistica_pendentes);
    setText("admin-scanner-title", config.admin.titulo_scanner);
    setText("admin-scanner-text", config.admin.texto_scanner);
    setText("admin-start-scan-btn", config.admin.botao_abrir_camera);
    setText("admin-stop-scan-btn", config.admin.botao_fechar_camera);
    setText("admin-reader-hint", config.admin.texto_sem_camera);
    setPlaceholder("admin-manual-qr", config.admin.placeholder_manual);
    setText("admin-validate-manual-btn", config.admin.botao_validar_manual);
    setText("admin-entries-title", config.admin.titulo_entradas);
    setText("admin-entries-text", config.admin.texto_entradas);
    setText("admin-messages-title", config.admin.titulo_mensagens);
    setText("admin-messages-text", config.admin.texto_mensagens);
    setText("admin-security-text", config.admin.texto_aviso_seguranca);
    setText("admin-clear-entries-btn", config.admin.botao_limpar_entradas);
    setText("admin-reset-storage-btn", config.admin.botao_resetar_registros);
    setText("admin-copy-report-btn", config.admin.botao_copiar_relatorio);
    setText("admin-export-csv-btn", config.admin.botao_exportar_planilha);
    setText("admin-export-pdf-btn", config.admin.botao_exportar_pdf);
    setText("admin-logout-btn", config.admin.botao_sair);

    setText(
        "footer-contact-line",
        `${config.textos.linha_rodape} E-mail: ${config.email_contato}`
    );
    setText("footer-signature", config.textos.assinatura_rodape);

    const qrWrapper = document.getElementById("pix-qr-wrapper");
    const qrImage = document.getElementById("pix-qr-image");
    if (config.qr_code_pix) {
        qrImage.src = config.qr_code_pix;
        qrWrapper.hidden = false;
    }
}

function setupWeddingCountdown() {
    updateWeddingCountdown();

    if (weddingCountdownTimer) {
        window.clearInterval(weddingCountdownTimer);
    }

    weddingCountdownTimer = window.setInterval(() => {
        updateWeddingCountdown();
    }, 1000);
}

function updateWeddingCountdown() {
    const eventDate = getCountdownDateTime();
    if (!eventDate) {
        return;
    }

    const diff = Math.max(eventDate.getTime() - Date.now(), 0);
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    setText("countdown-days", String(days));
    setText("countdown-hours", String(hours).padStart(2, "0"));
    setText("countdown-minutes", String(minutes).padStart(2, "0"));
    setText("countdown-seconds", String(seconds).padStart(2, "0"));
}

function getCountdownDateTime() {
    const explicitValue = String(config.data_hora_cronometro || "").trim();
    if (explicitValue) {
        const [datePart, timePart = "00:00"] = explicitValue.split(/\s+/);
        const parsedDate = buildDateTimeFromParts(datePart, timePart);
        if (parsedDate) {
            return parsedDate;
        }
    }

    return getEventDateTime();
}

function setupOpeningScreen() {
    const openingScreen = document.getElementById("opening-screen");
    const openingVideo = document.getElementById("opening-video");
    const openingVideoSource = document.getElementById("opening-video-source");
    const openingPlaceholder = document.getElementById("opening-placeholder");
    const enterButton = document.getElementById("enter-site-btn");
    const soundButton = document.getElementById("opening-sound-btn");

    if (!openingScreen || !openingVideo || !openingVideoSource || !openingPlaceholder || !enterButton) {
        return;
    }

    if (!config.abrir_com_video) {
        hideOpeningScreen();
        return;
    }

    openingScreen.focus();

    if (config.video_dos_noivos) {
        openingVideoSource.src = config.video_dos_noivos;
        openingVideo.muted = true;

        if (config.video_capa) {
            openingVideo.poster = config.video_capa;
        }

        openingVideo.load();
        openingVideo.play().catch(() => {
            // Alguns navegadores bloqueiam autoplay sem interacao.
        });
    } else {
        openingVideo.hidden = true;
        openingPlaceholder.hidden = false;
        if (soundButton) {
            soundButton.hidden = true;
        }
    }

    if (soundButton) {
        soundButton.addEventListener("click", async () => {
            const shouldUnmute = openingVideo.muted;
            openingVideo.muted = !shouldUnmute;
            soundButton.textContent = shouldUnmute
                ? (config.textos.texto_botao_desativar_som || "Desativar som")
                : (config.textos.texto_botao_ativar_som || "Ativar som");

            if (shouldUnmute) {
                try {
                    openingVideo.volume = 1;
                    await openingVideo.play();
                } catch (error) {
                    console.error(error);
                }
            }
        });
    }

    enterButton.addEventListener("click", () => {
        hideOpeningScreen();
    });

    openingScreen.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            hideOpeningScreen();
        }
    });
}

function hideOpeningScreen() {
    const openingScreen = document.getElementById("opening-screen");
    const openingVideo = document.getElementById("opening-video");

    if (!openingScreen) {
        return;
    }

    document.body.classList.remove("is-locked");
    openingScreen.classList.add("is-hidden");

    if (openingVideo) {
        openingVideo.pause();
    }
}

function setupCopyPix() {
    const button = document.getElementById("copy-pix-btn");
    if (!button) {
        return;
    }

    button.addEventListener("click", async () => {
        try {
            await copyToClipboard(config.chave_pix_igreja);
            button.textContent = config.textos.mensagem_pix_copiado;

            window.setTimeout(() => {
                button.textContent = config.textos.texto_botao_copiar_pix || "Copiar chave";
            }, 2200);
        } catch (error) {
            console.error(error);
        }
    });
}

function setupRevealAnimations() {
    const revealItems = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
        revealItems.forEach(item => item.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    revealItems.forEach(item => observer.observe(item));
}

function setupRsvpForm() {
    const form = document.getElementById("rsvp-form");
    const message = document.getElementById("rsvp-message");
    const nameInput = document.getElementById("guest-name");
    const phoneInput = document.getElementById("phone-last4");
    const guestCountSelect = document.getElementById("guest-count");
    const submitButton = document.getElementById("rsvp-submit-btn");

    if (!form || !message || !nameInput || !phoneInput || !guestCountSelect || !submitButton) {
        return;
    }

    const attendanceInputs = Array.from(form.querySelectorAll('input[name="attending"]'));

    phoneInput.addEventListener("input", () => {
        phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 4);
    });

    nameInput.addEventListener("input", () => {
        syncGuestCountOptions(form).catch(error => console.error(error));
    });

    phoneInput.addEventListener("input", () => {
        syncGuestCountOptions(form).catch(error => console.error(error));
    });

    attendanceInputs.forEach(input => {
        input.addEventListener("change", () => {
            updateGuestCountAvailability(form);
        });
    });

    updateGuestCountAvailability(form);

    form.addEventListener("submit", async event => {
        event.preventDefault();
        clearStatusMessage(message);

        const name = form.elements.nome.value.trim();
        const phoneLast4 = normalizeLast4Digits(form.elements.telefone_ultimos4.value);
        const attendance = form.elements.attending.value;
        const guestCount = Number(form.elements.quantidade_convidados.value || 0);

        if (!name || phoneLast4.length !== 4 || !attendance) {
            setStatusMessage(message, config.textos.mensagem_campos_incompletos, "error");
            return;
        }

        setSubmitState(submitButton, true);

        try {
            const guests = await loadGuests();
            const guest = findGuestMatch(guests, name, phoneLast4);

            if (!guest) {
                setStatusMessage(message, config.textos.mensagem_convidado_nao_encontrado, "error");
                return;
            }

            if (hasExistingReply(guest)) {
                setStatusMessage(message, config.textos.mensagem_convidado_ja_confirmou, "warning");
                return;
            }

            const maxGuests = getGuestMaxGuests(guest);
            if (attendance === "sim" && (!guestCount || guestCount > maxGuests)) {
                setStatusMessage(message, config.textos.texto_quantidade_convidados, "warning");
                return;
            }

            const payload = buildSubmissionPayload(guest, attendance, attendance === "sim" ? guestCount : 0);
            await sendRsvp(payload);
            storeGuestReply(guest, payload);
            storeDeviceGuestPass(payload);
            renderAdminEntries();
            renderGuestPass().catch(scanError => {
                console.error(scanError);
            });

            setStatusMessage(message, config.textos.mensagem_confirmacao_enviada, "success");
            form.reset();
            resetGuestCountOptions(guestCountSelect, config.textos.placeholder_quantidade_convidados);
            document.getElementById("guest-count-help").textContent = config.textos.texto_quantidade_convidados;
            updateGuestCountAvailability(form);
        } catch (error) {
            console.error(error);

            const friendlyMessage =
                error && error.code === "guest_list_unavailable"
                    ? config.textos.mensagem_erro_lista
                    : config.textos.mensagem_erro_envio;

            setStatusMessage(message, friendlyMessage, "error");
        } finally {
            setSubmitState(submitButton, false);
        }
    });
}

function setupMessageForm() {
    const form = document.getElementById("message-form");
    const status = document.getElementById("message-form-status");
    const submitButton = document.getElementById("message-submit-btn");

    if (!form) {
        return;
    }

    form.addEventListener("submit", async event => {
        event.preventDefault();
        clearStatusMessage(status);

        const name = form.elements.nome_remetente.value.trim();
        const email = form.elements.email_remetente.value.trim();
        const message = form.elements.mensagem_carinhosa.value.trim();

        if (!name || !message) {
            setStatusMessage(status, config.textos.mensagem_mensagem_incompleta, "error");
            return;
        }

        setMessageSubmitState(submitButton, true);

        try {
            await sendCareMessage({
                nome_remetente: name,
                email_remetente: email,
                mensagem_carinhosa: message,
                evento: config.nome_dos_noivos,
                tipo_envio: "mensagem-carinhosa"
            });

            setStatusMessage(status, config.textos.mensagem_mensagem_enviada, "success");
            form.reset();
        } catch (error) {
            console.error(error);
            setStatusMessage(status, config.textos.mensagem_erro_mensagem, "error");
        } finally {
            setMessageSubmitState(submitButton, false);
        }
    });
}

async function syncGuestCountOptions(form) {
    const name = form.elements.nome.value.trim();
    const phoneLast4 = normalizeLast4Digits(form.elements.telefone_ultimos4.value);
    const select = form.elements.quantidade_convidados;
    const help = document.getElementById("guest-count-help");

    if (!name || phoneLast4.length !== 4) {
        resetGuestCountOptions(select, config.textos.placeholder_quantidade_convidados);
        help.textContent = config.textos.texto_quantidade_convidados;
        updateGuestCountAvailability(form);
        return;
    }

    const guests = await loadGuests();
    const guest = findGuestMatch(guests, name, phoneLast4);

    if (!guest) {
        resetGuestCountOptions(select, LANGUAGE_CONTENT[currentLanguage].static.guestCountNotFound);
        help.textContent = config.textos.texto_quantidade_convidados;
        updateGuestCountAvailability(form);
        return;
    }

    const maxGuests = getGuestMaxGuests(guest);
    const familyName = guest.familia || guest.nome;
    const previousValue = Number(select.value || 0);
    select.innerHTML = "";

    for (let count = 1; count <= maxGuests; count += 1) {
        const option = document.createElement("option");
        option.value = String(count);
        option.textContent = `${count} ${count > 1 ? LANGUAGE_CONTENT[currentLanguage].static.guestCountPlural : LANGUAGE_CONTENT[currentLanguage].static.guestCountSingular}`;
        select.appendChild(option);
    }

    select.value = previousValue && previousValue <= maxGuests ? String(previousValue) : "1";
    help.textContent = LANGUAGE_CONTENT[currentLanguage].static.guestCountFamilyLimit
        .replace("{familia}", familyName)
        .replace("{maximo}", String(maxGuests))
        .replace("{convidados}", maxGuests > 1 ? LANGUAGE_CONTENT[currentLanguage].static.guestCountPlural : LANGUAGE_CONTENT[currentLanguage].static.guestCountSingular);
    updateGuestCountAvailability(form);
}

function resetGuestCountOptions(select, placeholder) {
    select.innerHTML = "";
    const option = document.createElement("option");
    option.value = "";
    option.textContent = placeholder;
    select.appendChild(option);
    select.value = "";
}

function updateGuestCountAvailability(form) {
    const select = form.elements.quantidade_convidados;
    const attendance = form.elements.attending.value;
    const hasValidOptions = select.options.length > 0 && select.options[0].value !== "";
    const shouldEnable = hasValidOptions;

    select.disabled = !shouldEnable;

    if (shouldEnable && !select.value) {
        select.value = select.options[0].value;
    }

    if (!shouldEnable) {
        select.value = "";
    }
}

function setupGuestPassSection() {
    if (!document.getElementById("guest-pass-link")) {
        return;
    }

    renderGuestPass().catch(error => {
        console.error(error);
    });

    if (guestPassRefreshTimer) {
        window.clearInterval(guestPassRefreshTimer);
    }

    guestPassRefreshTimer = window.setInterval(() => {
        renderGuestPass().catch(error => {
            console.error(error);
        });
    }, 30000);
}

function setupAdminAccess() {
    const trigger = document.getElementById("admin-access-trigger");
    const unlockWrapper = document.getElementById("admin-unlock");
    const accessForm = document.getElementById("admin-access-form");
    const codeInput = document.getElementById("admin-code");
    const startScanButton = document.getElementById("admin-start-scan-btn");
    const stopScanButton = document.getElementById("admin-stop-scan-btn");
    const validateManualButton = document.getElementById("admin-validate-manual-btn");
    const clearEntriesButton = document.getElementById("admin-clear-entries-btn");
    const resetStorageButton = document.getElementById("admin-reset-storage-btn");
    const copyReportButton = document.getElementById("admin-copy-report-btn");
    const exportCsvButton = document.getElementById("admin-export-csv-btn");
    const exportPdfButton = document.getElementById("admin-export-pdf-btn");
    const logoutButton = document.getElementById("admin-logout-btn");

    if (
        !trigger ||
        !unlockWrapper ||
        !accessForm ||
        !codeInput ||
        !startScanButton ||
        !stopScanButton ||
        !validateManualButton ||
        !clearEntriesButton ||
        !resetStorageButton ||
        !copyReportButton ||
        !exportCsvButton ||
        !exportPdfButton ||
        !logoutButton
    ) {
        return;
    }

    trigger.addEventListener("click", () => {
        const willExpand = unlockWrapper.hidden;
        unlockWrapper.hidden = !unlockWrapper.hidden;
        trigger.setAttribute("aria-expanded", String(willExpand));

        if (willExpand) {
            codeInput.focus();
        }
    });

    accessForm.addEventListener("submit", event => {
        event.preventDefault();
        const attemptedCode = codeInput.value.trim();

        if (attemptedCode !== config.admin.codigo_acesso) {
            setStatusMessage(
                document.getElementById("admin-access-message"),
                config.admin.mensagem_codigo_invalido,
                "error"
            );
            return;
        }

        setAdminSession(true);
        codeInput.value = "";
        setStatusMessage(
            document.getElementById("admin-access-message"),
            config.admin.mensagem_painel_liberado,
            "success"
        );
        showAdminPanel();
    });

    startScanButton.addEventListener("click", () => {
        startAdminScanner();
    });

    stopScanButton.addEventListener("click", () => {
        stopAdminScanner();
    });

    validateManualButton.addEventListener("click", () => {
        const manualInput = document.getElementById("admin-manual-qr");
        processAdminQrPayload(manualInput.value);
    });

    clearEntriesButton.addEventListener("click", () => {
        localStorage.removeItem(config.armazenamento_admin_entradas);
        renderAdminEntries();
        setStatusMessage(
            document.getElementById("admin-controls-message"),
            config.admin.mensagem_lista_limpa,
            "success"
        );
    });

    resetStorageButton.addEventListener("click", () => {
        resetLocalSiteRecords();
        renderGuestPass().catch(error => console.error(error));
        renderAdminEntries();
        setStatusMessage(
            document.getElementById("admin-controls-message"),
            config.admin.mensagem_registros_limpos,
            "success"
        );
    });

    copyReportButton.addEventListener("click", async () => {
        const report = buildAdminReport();
        await copyToClipboard(report);
        setStatusMessage(
            document.getElementById("admin-controls-message"),
            config.admin.mensagem_relatorio_copiado,
            "success"
        );
    });

    exportCsvButton.addEventListener("click", () => {
        downloadAdminSpreadsheet();
        setStatusMessage(
            document.getElementById("admin-controls-message"),
            config.admin.mensagem_planilha_exportada,
            "success"
        );
    });

    exportPdfButton.addEventListener("click", () => {
        openAdminPdfReport();
        setStatusMessage(
            document.getElementById("admin-controls-message"),
            config.admin.mensagem_pdf_aberto,
            "success"
        );
    });

    logoutButton.addEventListener("click", async () => {
        await stopAdminScanner();
        setAdminSession(false);
        showAdminPanel();
    });

    if (isAdminSessionActive()) {
        showAdminPanel();
    } else {
        renderAdminEntries();
    }
}

function setupStorageSync() {
    window.addEventListener("storage", event => {
        const relevantKeys = [
            config.armazenamento_local_rsvp,
            config.armazenamento_local_qr,
            config.armazenamento_admin_entradas,
            config.armazenamento_admin_sessao
        ];

        if (!relevantKeys.includes(event.key)) {
            return;
        }

        renderGuestPass().catch(error => {
            console.error(error);
        });

        if (event.key === config.armazenamento_admin_sessao) {
            showAdminPanel();
            return;
        }

        renderAdminEntries();
    });
}

function initializeCloudRepliesSync() {
    if (!isFirebaseReady()) {
        return;
    }

    const collectionName = getCloudRepliesCollectionName();

    cloudRepliesUnsubscribe = window.firebaseDb
        .collection(collectionName)
        .onSnapshot(
            snapshot => {
                const nextMap = {};

                snapshot.forEach(doc => {
                    const data = doc.data() || {};
                    const guestId = String(data.convidado_id || doc.id || "").trim();

                    if (!guestId) {
                        return;
                    }

                    nextMap[guestId] = {
                        ...data,
                        convidado_id: guestId
                    };
                });

                cloudRepliesMap = nextMap;
                renderAdminEntries();
            },
            error => {
                console.error("Não foi possível sincronizar confirmações do Firebase.", error);
            }
        );
}

function initializeCloudMessagesSync() {
    if (!isFirebaseReady()) {
        return;
    }

    const collectionName = getCloudMessagesCollectionName();

    cloudMessagesUnsubscribe = window.firebaseDb
        .collection(collectionName)
        .orderBy("data_hora_iso", "desc")
        .onSnapshot(
            snapshot => {
                cloudMessages = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                renderAdminMessages();
            },
            error => {
                console.error("Não foi possível sincronizar mensagens do Firebase.", error);
            }
        );
}

function showAdminPanel() {
    const panel = document.getElementById("admin-panel");
    const unlockWrapper = document.getElementById("admin-unlock");
    const accessMessage = document.getElementById("admin-access-message");

    if (isAdminSessionActive()) {
        panel.hidden = false;
        unlockWrapper.hidden = true;
        document.getElementById("admin-access-trigger").setAttribute("aria-expanded", "false");
        clearStatusMessage(accessMessage);
        renderAdminEntries();
        renderAdminMessages();
        return;
    }

    panel.hidden = true;
    unlockWrapper.hidden = false;
}

function isAdminSessionActive() {
    return localStorage.getItem(config.armazenamento_admin_sessao) === "1";
}

function setAdminSession(value) {
    if (value) {
        localStorage.setItem(config.armazenamento_admin_sessao, "1");
        return;
    }

    localStorage.removeItem(config.armazenamento_admin_sessao);
}

async function startAdminScanner() {
    const scanMessage = document.getElementById("admin-scan-message");
    const reader = document.getElementById("admin-reader");

    if (!("Html5Qrcode" in window)) {
        setStatusMessage(scanMessage, config.admin.mensagem_camera_indisponivel, "warning");
        return;
    }

    if (adminScannerActive) {
        return;
    }

    try {
        reader.hidden = false;
        adminScanner = adminScanner || new Html5Qrcode("admin-reader");

        await adminScanner.start(
            { facingMode: "environment" },
            {
                fps: 10,
                qrbox: { width: 220, height: 220 },
                aspectRatio: 1
            },
            decodedText => {
                const now = Date.now();
                if (decodedText === lastAdminScanValue && now - lastAdminScanTimestamp < 2500) {
                    return;
                }

                lastAdminScanValue = decodedText;
                lastAdminScanTimestamp = now;
                processAdminQrPayload(decodedText);
            },
            () => {}
        );

        adminScannerActive = true;
        clearStatusMessage(scanMessage);
    } catch (error) {
        console.error(error);
        reader.hidden = true;
        setStatusMessage(scanMessage, config.admin.mensagem_camera_indisponivel, "warning");
    }
}

async function stopAdminScanner() {
    const reader = document.getElementById("admin-reader");

    if (!adminScanner || !adminScannerActive) {
        reader.hidden = true;
        return;
    }

    try {
        await adminScanner.stop();
        await adminScanner.clear();
    } catch (error) {
        console.error(error);
    } finally {
        adminScannerActive = false;
        adminScanner = null;
        reader.hidden = true;
    }
}

async function processAdminQrPayload(rawValue) {
    const scanMessage = document.getElementById("admin-scan-message");
    const payload = String(rawValue || "").trim();

    if (!payload) {
        setStatusMessage(scanMessage, config.admin.mensagem_qr_invalido, "error");
        return;
    }

    try {
        const parsedEntry = await parseAdminQrPayload(payload);
        const wasUpdated = registerAdminEntry(parsedEntry);
        renderAdminEntries();
        setStatusMessage(
            scanMessage,
            wasUpdated ? config.admin.mensagem_entrada_atualizada : config.admin.mensagem_entrada_registrada,
            parsedEntry.canEnter ? "success" : "warning"
        );
        document.getElementById("admin-manual-qr").value = "";
    } catch (error) {
        console.error(error);
        setStatusMessage(scanMessage, config.admin.mensagem_qr_invalido, "error");
    }
}

async function parseAdminQrPayload(payload) {
    const normalizedUrl = new URL(payload, getPublicBaseUrl());
    const guestId = normalizedUrl.searchParams.get("guest");
    const statusValue = normalizedUrl.searchParams.get("status");

    if (!guestId) {
        throw new Error("QR inválido");
    }

    const guests = await loadGuests();
    const guest = guests.find(item => getGuestId(item) === guestId || String(item.id || "") === guestId);

    if (!guest) {
        throw new Error("Convidado não encontrado");
    }

    const knownReply = getMergedRepliesMap()[guestId] || null;
    const resolvedStatus = statusValue || knownReply?.resposta_valor || guest.status;
    const guestState = resolveAdminGuestState(resolvedStatus);
    const now = new Date();

    return {
        guestId,
        guestName: guest.nome,
        familyName: guest.familia || guest.nome,
        guestPhoneFinal: normalizeLast4Digits(guest.telefone_ultimos4),
        maxGuests: getGuestMaxGuests(guest),
        statusValue: normalizeStatus(resolvedStatus),
        statusLabel: guestState.statusLabel,
        canEnter: guestState.canEnter,
        entryLabel: guestState.entryLabel,
        scannedAtISO: now.toISOString(),
        scannedAtDisplay: now.toLocaleString("pt-BR"),
        rawPayload: payload
    };
}

function resolveAdminGuestState(statusValue) {
    const normalizedStatus = normalizeStatus(statusValue);

    if (["sim", "confirmado", "confirmada", "presente"].includes(normalizedStatus)) {
        return {
            statusLabel: config.admin.status_confirmado,
            entryLabel: config.admin.status_entrada_registrada,
            canEnter: true
        };
    }

    if (["nao", "não", "nao_confirmado", "recusado", "recusada", "ausente"].includes(normalizedStatus)) {
        return {
            statusLabel: config.admin.status_ausencia,
            entryLabel: config.admin.status_entrada_bloqueada,
            canEnter: false
        };
    }

    return {
        statusLabel: config.admin.status_pendente,
        entryLabel: config.admin.status_entrada_bloqueada,
        canEnter: false
    };
}

function registerAdminEntry(entry) {
    const entries = getAdminEntries();
    const existingEntry = entries.find(item => item.guestId === entry.guestId);

    if (existingEntry) {
        existingEntry.statusValue = entry.statusValue;
        existingEntry.statusLabel = entry.statusLabel;
        existingEntry.canEnter = entry.canEnter;
        existingEntry.entryLabel = entry.entryLabel;
        existingEntry.lastScannedAtISO = entry.scannedAtISO;
        existingEntry.lastScannedAtDisplay = entry.scannedAtDisplay;
        existingEntry.scans = Number(existingEntry.scans || 1) + 1;
        saveAdminEntries(entries);
        return true;
    }

    entries.push({
        ...entry,
        firstScannedAtISO: entry.scannedAtISO,
        firstScannedAtDisplay: entry.scannedAtDisplay,
        lastScannedAtISO: entry.scannedAtISO,
        lastScannedAtDisplay: entry.scannedAtDisplay,
        scans: 1
    });

    saveAdminEntries(entries);
    return false;
}

function renderAdminEntries() {
    const registry = buildAdminRegistry();

    const list = document.getElementById("admin-entries-list");
    if (!list) {
        return;
    }

    const total = registry.length;
    const confirmed = registry.filter(item => item.rsvpState === "confirmed").length;
    const pending = total - confirmed;

    setText("admin-stat-total", String(total));
    setText("admin-stat-confirmed", String(confirmed));
    setText("admin-stat-pending", String(pending));

    list.innerHTML = "";

    if (!registry.length) {
        const emptyState = document.createElement("p");
        emptyState.className = "admin-entry__meta";
        emptyState.textContent = config.admin.texto_sem_entradas;
        list.appendChild(emptyState);
        return;
    }

    registry.forEach(entry => {
        const item = document.createElement("article");
        item.className = "admin-entry";

        const top = document.createElement("div");
        top.className = "admin-entry__top";

        const name = document.createElement("h4");
        name.className = "admin-entry__name";
        name.textContent = entry.guestName;

        const badges = document.createElement("div");
        badges.className = "utility-actions utility-actions--centered";

        const statusBadge = document.createElement("span");
        statusBadge.className = `status-badge status-badge--${entry.rsvpTone}`;
        statusBadge.textContent = entry.rsvpLabel;

        const accessBadge = document.createElement("span");
        accessBadge.className = `status-badge status-badge--${entry.entryTone}`;
        accessBadge.textContent = entry.entryLabel;

        badges.append(statusBadge, accessBadge);
        top.append(name, badges);

        const metaOne = document.createElement("p");
        metaOne.className = "admin-entry__meta";
        metaOne.textContent = entry.rsvpMeta;

        const metaTwo = document.createElement("p");
        metaTwo.className = "admin-entry__meta";
        metaTwo.textContent = entry.entryMeta;

        const metaThree = document.createElement("p");
        metaThree.className = "admin-entry__meta";
        metaThree.textContent = `Família: ${entry.familyName || "Não informada"} | Confirmados: ${entry.confirmedGuests}/${entry.maxGuests} | Telefone final: ${entry.guestPhoneFinal || "Não informado"} | ID: ${entry.guestId}`;

        const actions = document.createElement("div");
        actions.className = "admin-entry__actions";

        if (entry.hasEntryLog) {
            const removeButton = document.createElement("button");
            removeButton.type = "button";
            removeButton.className = "button button--ghost button--small";
            removeButton.textContent = "Remover entrada";
            removeButton.addEventListener("click", () => {
                removeAdminEntry(entry.guestId);
            });

            actions.appendChild(removeButton);
        }

        item.append(top, metaOne, metaTwo, metaThree, actions);
        list.appendChild(item);
    });
}

function renderAdminMessages() {
    const list = document.getElementById("admin-messages-list");

    if (!list) {
        return;
    }

    list.innerHTML = "";

    if (!cloudMessages.length) {
        const emptyState = document.createElement("p");
        emptyState.className = "admin-entry__meta";
        emptyState.textContent = config.admin.texto_sem_mensagens;
        list.appendChild(emptyState);
        return;
    }

    cloudMessages.forEach(message => {
        const item = document.createElement("article");
        item.className = "admin-entry";

        const top = document.createElement("div");
        top.className = "admin-entry__top";

        const name = document.createElement("h4");
        name.className = "admin-entry__name";
        name.textContent = message.nome_remetente || "Mensagem sem nome";

        const badge = document.createElement("span");
        badge.className = "status-badge status-badge--success";
        badge.textContent = "Recebida";

        top.append(name, badge);

        const metaOne = document.createElement("p");
        metaOne.className = "admin-entry__meta";
        metaOne.textContent = `E-mail: ${message.email_remetente || "Não informado"} | Enviada em ${formatAdminMessageDate(message.data_hora_iso)}`;

        const metaTwo = document.createElement("p");
        metaTwo.className = "admin-entry__meta";
        metaTwo.textContent = message.mensagem_carinhosa || "";

        item.append(top, metaOne, metaTwo);
        list.appendChild(item);
    });
}

function buildAdminRegistry() {
    const repliesMap = getMergedRepliesMap();
    const entries = getAdminEntries();
    const entriesMap = new Map(entries.map(entry => [entry.guestId, entry]));
    const guestIds = new Set([
        ...Object.keys(repliesMap),
        ...entries.map(entry => entry.guestId)
    ]);

    return Array.from(guestIds)
        .map(guestId => {
            const reply = repliesMap[guestId] || null;
            const entry = entriesMap.get(guestId) || null;
            const rsvpSource = reply ? reply.resposta_valor : entry ? entry.statusValue : "";
            const rsvpInfo = resolveAdminRsvpInfo(rsvpSource);

            return {
                guestId,
                guestName: reply?.nome_convidado || entry?.guestName || "Convidado identificado",
                familyName: reply?.familia || entry?.familyName || "",
                guestPhoneFinal: reply?.telefone_final || entry?.guestPhoneFinal || "",
                maxGuests: Number(reply?.maximo_convidados || entry?.maxGuests || 1),
                confirmedGuests: Number(reply?.quantidade_convidados || 0),
                rsvpState: rsvpInfo.state,
                rsvpLabel: rsvpInfo.label,
                rsvpTone: rsvpInfo.tone,
                rsvpMeta: reply
                    ? `RSVP: ${reply.resposta} | Quantidade: ${reply.quantidade_convidados || 0}/${reply.maximo_convidados || 1} | Respondido em ${reply.data_hora_resposta || "horário não disponível"}`
                    : "RSVP: nenhuma confirmação registrada neste dispositivo.",
                entryLabel: entry
                    ? entry.entryLabel
                    : config.admin.status_entrada_nao_registrada,
                entryTone: entry
                    ? entry.canEnter
                        ? "success"
                        : "warning"
                    : "warning",
                entryMeta: entry
                    ? `Último acesso: ${entry.lastScannedAtDisplay} | Escaneado ${entry.scans} vez(es)`
                    : "Entrada: ainda não registrada neste dispositivo.",
                hasEntryLog: Boolean(entry)
            };
        })
        .sort((first, second) => {
            const firstDate = getRegistrySortTime(first, repliesMap, entriesMap);
            const secondDate = getRegistrySortTime(second, repliesMap, entriesMap);
            return secondDate - firstDate;
        });
}

function getRegistrySortTime(item, repliesMap, entriesMap) {
    const reply = repliesMap[item.guestId];
    const entry = entriesMap.get(item.guestId);

    return Math.max(
        new Date(reply?.data_hora_iso || 0).getTime(),
        new Date(entry?.lastScannedAtISO || 0).getTime(),
        0
    );
}

function resolveAdminRsvpInfo(statusValue) {
    const normalizedStatus = normalizeStatus(statusValue);

    if (["sim", "confirmado", "confirmada", "presente"].includes(normalizedStatus)) {
        return {
            state: "confirmed",
            label: config.admin.status_confirmado,
            tone: "success"
        };
    }

    if (["nao", "não", "nao_confirmado", "recusado", "recusada", "ausente"].includes(normalizedStatus)) {
        return {
            state: "absent",
            label: config.admin.status_ausencia,
            tone: "danger"
        };
    }

    return {
        state: "pending",
        label: config.admin.status_pendente,
        tone: "warning"
    };
}

function removeAdminEntry(guestId) {
    const updatedEntries = getAdminEntries().filter(entry => entry.guestId !== guestId);
    saveAdminEntries(updatedEntries);
    renderAdminEntries();
}

function getAdminEntries() {
    try {
        return JSON.parse(localStorage.getItem(config.armazenamento_admin_entradas) || "[]");
    } catch (error) {
        return [];
    }
}

function saveAdminEntries(entries) {
    localStorage.setItem(config.armazenamento_admin_entradas, JSON.stringify(entries));
}

function buildAdminReport() {
    const registry = buildAdminRegistry();

    if (!registry.length) {
        return `${config.nome_dos_noivos}\n${config.admin.texto_sem_entradas}`;
    }

    const lines = [
        `${config.nome_dos_noivos}`,
        `Relatório de entradas`,
        ``
    ];

    registry.forEach(entry => {
        lines.push(
            `${entry.guestName} | Família: ${entry.familyName || "-"} | Confirmados: ${entry.confirmedGuests}/${entry.maxGuests} | RSVP: ${entry.rsvpLabel} | Entrada: ${entry.entryLabel} | ${entry.entryMeta}`
        );
    });

    return lines.join("\n");
}

function resetLocalSiteRecords() {
    localStorage.removeItem(config.armazenamento_local_rsvp);
    localStorage.removeItem(config.armazenamento_local_qr);
    localStorage.removeItem(config.armazenamento_admin_entradas);
}

async function renderGuestPass() {
    const pass = getDeviceGuestPass();
    const link = document.getElementById("guest-pass-link");

    if (!link) {
        return;
    }

    if (!pass) {
        setGuestPassBadge("QR indisponível", "warning");
        setText("guest-pass-name", LANGUAGE_CONTENT[currentLanguage].static.guestPassNone);
        setText("guest-pass-status", config.acesso_convidado.mensagem_status_pendente);
        setText("guest-pass-response", LANGUAGE_CONTENT[currentLanguage].static.guestPassWaiting);
        setText("guest-pass-message", config.acesso_convidado.mensagem_sem_confirmacao);
        setText("guest-pass-help", config.acesso_convidado.mensagem_status_dispositivo);
        renderGuestPassPlaceholder(config.acesso_convidado.mensagem_sem_confirmacao);
        link.hidden = true;
        return;
    }

    const responseInfo = resolveResponseInfo(pass.resposta_valor);
    const guests = await loadGuests().catch(() => []);
    const matchedGuest = guests.find(guest => getGuestId(guest) === pass.convidado_id) || null;
    const releaseInfo = getGuestPassReleaseInfo(matchedGuest);
    const guestStatusUrl = buildGuestStatusUrl(pass.convidado_id, pass.resposta_valor);

    setText("guest-pass-name", pass.nome_convidado || LANGUAGE_CONTENT[currentLanguage].static.guestIdentified);
    setText("guest-pass-status", responseInfo.siteLabel);
    setText("guest-pass-response", pass.resposta || responseInfo.responseText);
    setText("guest-pass-help", config.acesso_convidado.mensagem_status_dispositivo);

    if (responseInfo.tone === "danger") {
        setGuestPassBadge("Ausência registrada", "danger");
        setText("guest-pass-message", config.acesso_convidado.mensagem_qr_nao_comparece);
        renderGuestPassPlaceholder(config.acesso_convidado.mensagem_qr_nao_comparece);
        link.hidden = true;
        return;
    }

    link.hidden = false;
    link.href = guestStatusUrl;
    link.textContent = config.acesso_convidado.link_identificacao;

    if (releaseInfo.isExpired) {
        setGuestPassBadge("QR indisponível", "warning");
        setText("guest-pass-message", config.acesso_convidado.mensagem_qr_indisponivel);
        renderGuestPassPlaceholder(config.acesso_convidado.mensagem_qr_indisponivel);
        return;
    }

    if (!releaseInfo.isReleased) {
        setGuestPassBadge("Aguardando liberação", "warning");
        setText(
            "guest-pass-message",
            config.acesso_convidado.mensagem_aguardando_liberacao.replace("{tempo}", releaseInfo.remainingText)
        );
        renderGuestPassPlaceholder(
            config.acesso_convidado.mensagem_aguardando_liberacao.replace("{tempo}", releaseInfo.remainingText)
        );
        return;
    }

    setGuestPassBadge("QR liberado", responseInfo.tone);
    setText("guest-pass-message", config.acesso_convidado.mensagem_qr_liberado);

    if (!("QRCode" in window)) {
        renderGuestPassPlaceholder(config.acesso_convidado.mensagem_qr_sem_biblioteca);
        return;
    }

    renderGuestPassQr(guestStatusUrl);
}

function renderGuestPassQr(url) {
    const preview = document.getElementById("guest-pass-qr");
    preview.innerHTML = "";

    new QRCode(preview, {
        text: url,
        width: 240,
        height: 240,
        colorDark: "#243022",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
}

function renderGuestPassPlaceholder(text) {
    const preview = document.getElementById("guest-pass-qr");
    preview.innerHTML = "";

    const placeholder = document.createElement("p");
    placeholder.className = "guest-pass-placeholder";
    placeholder.textContent = text;

    preview.appendChild(placeholder);
}

function setGuestPassBadge(text, tone) {
    const badge = document.getElementById("guest-pass-badge");
    badge.textContent = text;
    badge.className = `status-badge status-badge--${tone}`;
}

function getGuestPassReleaseInfo(guest) {
    if (guest && guest.qr_liberado === true) {
        return {
            isReleased: true,
            isExpired: false,
            remainingText: "agora"
        };
    }

    const eventDate = getEventDateTime();

    if (!eventDate) {
        return {
            isReleased: true,
            isExpired: false,
            remainingText: "agora"
        };
    }

    const hoursBefore = Number(config.acesso_convidado.liberar_qr_horas_antes || 0);
    const releaseDate = new Date(eventDate.getTime() - hoursBefore * 60 * 60 * 1000);
    const now = new Date();
    const keepAfterEvent = config.acesso_convidado.mostrar_qr_apos_evento !== false;
    const isExpired = now > eventDate && !keepAfterEvent;

    return {
        isReleased: now >= releaseDate && !isExpired,
        isExpired,
        remainingText: formatRemainingTime(releaseDate.getTime() - now.getTime())
    };
}

function getEventDateTime() {
    return buildDateTimeFromParts(config.data_do_evento, config.horario_do_evento);
}

function buildDateTimeFromParts(dateValue, timeValue) {
    const dateParts = String(dateValue || "").split("/");
    const timeParts = String(timeValue || "").split(":");

    if (dateParts.length !== 3) {
        return null;
    }

    const day = Number(dateParts[0]);
    const month = Number(dateParts[1]) - 1;
    const year = Number(dateParts[2]);
    const hour = Number(timeParts[0] || 0);
    const minute = Number(timeParts[1] || 0);

    const date = new Date(year, month, day, hour, minute, 0, 0);
    return Number.isNaN(date.getTime()) ? null : date;
}

function formatRemainingTime(milliseconds) {
    if (milliseconds <= 0) {
        return "agora";
    }

    const totalMinutes = Math.ceil(milliseconds / 60000);
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;
    const parts = [];

    if (days) {
        parts.push(`${days} dia${days > 1 ? "s" : ""}`);
    }

    if (hours) {
        parts.push(`${hours} hora${hours > 1 ? "s" : ""}`);
    }

    if (minutes || !parts.length) {
        parts.push(`${minutes} min`);
    }

    return parts.slice(0, 2).join(" e ");
}

async function loadGuests() {
    if (guestsCache) {
        return guestsCache;
    }

    const response = await fetch("guests.json", { cache: "no-store" });
    if (!response.ok) {
        const error = new Error("Não foi possível carregar guests.json");
        error.code = "guest_list_unavailable";
        throw error;
    }

    const data = await response.json();
    const guests = Array.isArray(data) ? data : data.convidados;

    if (!Array.isArray(guests)) {
        const error = new Error("Formato inválido em guests.json");
        error.code = "guest_list_unavailable";
        throw error;
    }

    guestsCache = guests;
    return guestsCache;
}

function findGuestMatch(guests, name, phoneLast4) {
    const normalizedName = normalizeName(name);

    return guests.find(guest => {
        return (
            normalizeName(guest.nome) === normalizedName &&
            normalizeLast4Digits(guest.telefone_ultimos4) === phoneLast4
        );
    });
}

function hasExistingReply(guest) {
    const guestStatus = String(guest.status || "").trim().toLowerCase();
    const responses = getMergedRepliesMap();
    const alreadyAnswered = Boolean(guestStatus) && guestStatus !== "pendente";
    return alreadyAnswered || Boolean(responses[getGuestId(guest)]);
}

function buildSubmissionPayload(guest, attendance, guestCount) {
    const now = new Date();

    return {
        convidado_id: getGuestId(guest),
        nome_convidado: guest.nome,
        familia: guest.familia || guest.nome,
        telefone_final: normalizeLast4Digits(guest.telefone_ultimos4),
        quantidade_convidados: attendance === "sim" ? Number(guestCount || 1) : 0,
        maximo_convidados: getGuestMaxGuests(guest),
        resposta: attendance === "sim" ? config.textos.opcao_comparecer : config.textos.opcao_nao_comparecer,
        resposta_valor: attendance,
        data_hora_resposta: now.toLocaleString("pt-BR"),
        data_hora_iso: now.toISOString(),
        evento: config.nome_dos_noivos,
        local: config.nome_do_local
    };
}

async function sendRsvp(payload) {
    const tasks = [];

    if (shouldSendToFormspree()) {
        tasks.push(sendToFormspree(payload));
    }

    if (isFirebaseReady()) {
        tasks.push(saveReplyToCloud(payload));
    }

    if (!tasks.length) {
        return Promise.resolve({
            success: true,
            storage: "local-device",
            payload
        });
    }

    await Promise.all(tasks);

    return {
        success: true,
        storage: shouldSendToFormspree() && isFirebaseReady() ? "formspree+firebase" : "integrated",
        payload
    };
}

async function sendCareMessage(payload) {
    const enrichedPayload = {
        ...payload,
        data_hora_iso: new Date().toISOString(),
        data_hora_formatada: new Date().toLocaleString("pt-BR")
    };

    const tasks = [];

    if (shouldSendToFormspree()) {
        tasks.push(sendToFormspree(enrichedPayload));
    }

    if (isFirebaseReady()) {
        tasks.push(saveMessageToCloud(enrichedPayload));
    }

    if (!tasks.length) {
        throw new Error("Nenhum serviço de mensagem configurado.");
    }

    await Promise.all(tasks);
    return { success: true, payload: enrichedPayload };
}

function shouldSendToFormspree() {
    const service = config.servico_confirmacoes || {};
    return normalizeStatus(service.tipo) === "formspree" && Boolean(String(service.endpoint_formspree || "").trim());
}

async function sendToFormspree(payload) {
    const service = config.servico_confirmacoes || {};
    const endpoint = String(service.endpoint_formspree || "").trim();

    if (!endpoint) {
        return;
    }

    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
        formData.append(key, value == null ? "" : String(value));
    });

    if (payload.email_remetente) {
        formData.append("email", String(payload.email_remetente));
        formData.append("_replyto", String(payload.email_remetente));
    }

    formData.append("_subject", service.assunto || `Nova confirmação de presença - ${config.nome_dos_noivos}`);

    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            Accept: "application/json"
        },
        body: formData
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.ok === false || result.success === false) {
        throw new Error(result.error || result.message || "Falha ao enviar para o Formspree.");
    }
}

async function saveReplyToCloud(payload) {
    const guestId = String(payload.convidado_id || "").trim();

    if (!guestId || !isFirebaseReady()) {
        return;
    }

    await window.firebaseDb
        .collection(getCloudRepliesCollectionName())
        .doc(guestId)
        .set(
            {
                ...payload,
                origem: "site",
                atualizado_em_iso: new Date().toISOString()
            },
            { merge: true }
        );
}

async function saveMessageToCloud(payload) {
    if (!isFirebaseReady()) {
        return;
    }

    await window.firebaseDb.collection(getCloudMessagesCollectionName()).add({
        ...payload,
        origem: "site"
    });
}

function storeGuestReply(guest, payload) {
    const responses = getStoredReplies();
    responses[getGuestId(guest)] = payload;
    localStorage.setItem(config.armazenamento_local_rsvp, JSON.stringify(responses));
}

function storeDeviceGuestPass(payload) {
    localStorage.setItem(config.armazenamento_local_qr, JSON.stringify(payload));
}

function getStoredReplies() {
    try {
        return JSON.parse(localStorage.getItem(config.armazenamento_local_rsvp) || "{}");
    } catch (error) {
        return {};
    }
}

function getMergedRepliesMap() {
    return {
        ...cloudRepliesMap,
        ...getStoredReplies()
    };
}

function getDeviceGuestPass() {
    try {
        const storedPass = JSON.parse(localStorage.getItem(config.armazenamento_local_qr) || "null");
        if (storedPass && storedPass.convidado_id) {
            return storedPass;
        }
    } catch (error) {
            // Ignora JSON inválido e tenta fallback abaixo.
    }

    const replies = Object.values(getStoredReplies())
        .filter(item => item && item.convidado_id)
        .sort((first, second) => {
            return new Date(second.data_hora_iso || 0).getTime() - new Date(first.data_hora_iso || 0).getTime();
        });

    return replies[0] || null;
}

function buildGuestStatusUrl(guestId, statusValue) {
    const baseUrl = getPublicBaseUrl();
    const url = new URL("guest-status.html", baseUrl);
    url.searchParams.set("guest", guestId);

    if (statusValue) {
        url.searchParams.set("status", statusValue);
    }

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

function getGuestId(guest) {
    if (guest.id) {
        return String(guest.id);
    }

    return `${normalizeName(guest.nome)}-${normalizeLast4Digits(guest.telefone_ultimos4)}`;
}

function resolveResponseInfo(statusValue) {
    const normalizedStatus = normalizeStatus(statusValue);

    if (["sim", "confirmado", "confirmada", "presente"].includes(normalizedStatus)) {
        return {
            siteLabel: config.acesso_convidado.mensagem_status_confirmado,
            responseText: config.textos.opcao_comparecer,
            tone: "success"
        };
    }

    if (["nao", "nao_confirmado", "recusado", "recusada", "ausente"].includes(normalizedStatus)) {
        return {
            siteLabel: config.acesso_convidado.mensagem_status_nao_comparece,
            responseText: config.textos.opcao_nao_comparecer,
            tone: "danger"
        };
    }

    return {
        siteLabel: config.acesso_convidado.mensagem_status_pendente,
        responseText: "Aguardando resposta",
        tone: "warning"
    };
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

function setSubmitState(button, isLoading) {
    button.disabled = isLoading;
    button.textContent = isLoading ? LANGUAGE_CONTENT[currentLanguage].static.sendLoading : config.textos.texto_botao_enviar_rsvp;
}

function setMessageSubmitState(button, isLoading) {
    button.disabled = isLoading;
    button.textContent = isLoading ? LANGUAGE_CONTENT[currentLanguage].static.sendLoading : config.textos.texto_botao_enviar_mensagem;
}

function setStatusMessage(target, text, type) {
    target.textContent = text;
    target.className = `form-status is-${type}`;
}

function clearStatusMessage(target) {
    target.textContent = "";
    target.className = "form-status";
}

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value || "";
    }
}

function setLink(id, href, text) {
    const element = document.getElementById(id);
    if (!element) {
        return;
    }

    element.href = href || "#";
    element.textContent = text || "";
}

function setPlaceholder(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.placeholder = value || "";
    }
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

function normalizeLast4Digits(value) {
    return String(value || "").replace(/\D/g, "").slice(-4);
}

function getGuestMaxGuests(guest) {
    const value = Number(guest?.maximo_convidados || guest?.limite_convidados || guest?.quantidade_maxima || 1);
    return Number.isFinite(value) && value > 0 ? Math.floor(value) : 1;
}

function buildAdminExportRows() {
    return buildAdminRegistry().map(entry => ({
        nome: entry.guestName,
        familia: entry.familyName || "",
        quantidade_confirmada: entry.confirmedGuests,
        limite_familia: entry.maxGuests,
        rsvp: entry.rsvpLabel,
        entrada: entry.entryLabel,
        telefone_final: entry.guestPhoneFinal || "",
        id: entry.guestId,
        detalhes_rsvp: entry.rsvpMeta,
        detalhes_entrada: entry.entryMeta
    }));
}

function downloadAdminSpreadsheet() {
    const rows = buildAdminExportRows();
    const headers = [
        "Nome",
        "Família",
        "Quantidade confirmada",
        "Limite da família",
        "RSVP",
        "Entrada",
        "Telefone final",
        "ID",
        "Detalhes RSVP",
        "Detalhes entrada"
    ];

    const csvLines = [headers.join(";")];
    rows.forEach(row => {
        csvLines.push([
            row.nome,
            row.familia,
            row.quantidade_confirmada,
            row.limite_familia,
            row.rsvp,
            row.entrada,
            row.telefone_final,
            row.id,
            row.detalhes_rsvp,
            row.detalhes_entrada
        ].map(escapeCsvValue).join(";"));
    });

    downloadTextFile(`\uFEFF${csvLines.join("\n")}`, "relatorio-confirmacoes.csv", "text/csv;charset=utf-8;");
}

function openAdminPdfReport() {
    const registry = buildAdminRegistry();
    const reportWindow = window.open("", "_blank", "noopener,noreferrer");

    if (!reportWindow) {
        throw new Error("Não foi possível abrir a janela do relatório.");
    }

    const rowsHtml = registry.length
        ? registry.map(entry => `
            <tr>
                <td>${escapeHtml(entry.guestName)}</td>
                <td>${escapeHtml(entry.familyName || "-")}</td>
                <td>${entry.confirmedGuests}/${entry.maxGuests}</td>
                <td>${escapeHtml(entry.rsvpLabel)}</td>
                <td>${escapeHtml(entry.entryLabel)}</td>
                <td>${escapeHtml(entry.entryMeta)}</td>
            </tr>
        `).join("")
        : `<tr><td colspan="6">${escapeHtml(config.admin.texto_sem_entradas)}</td></tr>`;

    reportWindow.document.open();
    reportWindow.document.write(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <title>Relatório administrativo</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 32px; color: #222; }
                h1 { margin-bottom: 8px; }
                p { margin: 0 0 18px; }
                table { width: 100%; border-collapse: collapse; font-size: 12px; }
                th, td { border: 1px solid #ccc; padding: 8px; text-align: left; vertical-align: top; }
                th { background: #f1ece4; }
            </style>
        </head>
        <body>
            <h1>${escapeHtml(config.nome_dos_noivos)}</h1>
            <p>Relatório administrativo gerado em ${escapeHtml(new Date().toLocaleString("pt-BR"))}</p>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Família</th>
                        <th>Confirmados</th>
                        <th>RSVP</th>
                        <th>Entrada</th>
                        <th>Detalhes</th>
                    </tr>
                </thead>
                <tbody>${rowsHtml}</tbody>
            </table>
        </body>
        </html>
    `);
    reportWindow.document.close();
    reportWindow.focus();
    reportWindow.print();
}

function escapeCsvValue(value) {
    const text = String(value ?? "");
    return `"${text.replace(/"/g, "\"\"")}"`;
}

function downloadTextFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function isFirebaseReady() {
    return Boolean(window.firebaseDb && config.firebase && config.firebase.habilitado === true);
}

function getCloudRepliesCollectionName() {
    return String(config.firebase?.collection_confirmacoes || "confirmacoes").trim() || "confirmacoes";
}

function getCloudMessagesCollectionName() {
    return String(config.firebase?.collection_mensagens || "mensagens").trim() || "mensagens";
}

function formatAdminMessageDate(value) {
    if (!value) {
        return "data não informada";
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString("pt-BR");
}
