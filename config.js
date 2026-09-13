// Edite este arquivo para alterar os textos, links e dados principais do convite.
// A lista de convidados fica separada em guests.json.

const config = window.config = {
    base_url_publico: "https://darthvagem2.github.io/CasamentoLS/",
    nome_dos_noivos: "Sandro Lucilene",
    frase_principal: "Com a graça de Deus, temos o prazer de compartilhar este momento convosco.",
    data_do_evento: "19/09/2026",
    horario_do_evento: "16:30",
    data_hora_cronometro: "19/09/2026 16:30",
    nome_do_local: "Igreja de Nossa Senhora da Glória do Outeiro",
    endereco_completo: "Pça. Nossa Sra. da Glória, 26 - Glória, Rio de Janeiro - RJ",
    email_contato: "confirmarcasamentols@gmail.com",
    traje: "Traje passeio completo",
    data_limite_confirmacao: "10/07/2026",
    chave_pix_igreja: "27.003.102/0001-17",
    nome_favorecido_pix: "Imperial Irmandade de N. S. da Glória do Outeiro",
    email_que_recebe_confirmacoes: "confirmarcasamentols@gmail.com",

    video_dos_noivos: "assets/opening-video.mp4",
    video_capa: "",
    abrir_com_video: true,

    link_mapa_embed:
        "https://www.google.com/maps?q=Igreja%20de%20Nossa%20Senhora%20da%20Gloria%20do%20Outeiro%2C%20Pca.%20Nossa%20Sra.%20da%20Gloria%2C%2026%20-%20Gloria%2C%20Rio%20de%20Janeiro&output=embed",
    link_mapa_rotas:
        "https://www.google.com/maps/search/?api=1&query=Igreja%20de%20Nossa%20Senhora%20da%20Gloria%20do%20Outeiro%2C%20Pca.%20Nossa%20Sra.%20da%20Gloria%2C%2026%20-%20Gloria%2C%20Rio%20de%20Janeiro",
    link_mapa_label: "Abrir rota no Google Maps",

    qr_code_pix: "",

    textos: {
        titulo_pagina: "Convite de Casamento | Sandro Lucilene",
        subtitulo_video: "Convite especial",
        titulo_video: "Um começo cheio de amor",
        texto_video: "Assista ao vídeo de abertura e entre para celebrar conosco este dia inesquecível.",
        texto_botao_entrada: "Entrar",
        hero_eyebrow: "Convite de casamento",
        hero_card_label: "Cerimônia religiosa",
        texto_botao_confirmar: "Confirmar presença",
        texto_botao_local: "Ver local",
        titulo_boas_vindas: "A sua presença tornará este dia ainda mais memorável",
        mensagem_boas_vindas:
            "Com muito amor, alegria e gratidão, preparamos este convite digital para compartilhar cada detalhe do nosso casamento com as pessoas que fazem parte da nossa história.",
        titulo_informacoes: "Informações do casamento",
        texto_informacoes:
            "Reserve este momento em sua agenda e encontre abaixo os detalhes essenciais para viver este dia conosco.",
        titulo_mapa: "Como chegar",
        rotulo_mapa: "Local do evento",
        titulo_traje: "",
        titulo_presentes: "Mensagens com carinho",
        texto_presentes:
            "Se desejar, deixe uma mensagem especial para os noivos. Ela será enviada por e-mail com todo carinho.",
        texto_mensagens:
            "Vamos adorar receber palavras, bênçãos e lembranças afetivas deste momento. Sua mensagem chegará diretamente ao nosso e-mail.",
        texto_botao_enviar_mensagem: "Enviar mensagem",
        titulo_pix: "",
        texto_pix:
            "Sugerimos que seu presente seja na forma de doação via PIX para a igreja.",
        titulo_rsvp: "Confirme sua presença",
        texto_rsvp:
            "Preencha seus dados exatamente como foram cadastrados para validar sua confirmação na lista de convidados.",
        texto_rsvp_prazo: "Confirmação até o dia 10/07/2026.",
        titulo_cronometro: "Contagem para o grande dia",
        texto_rsvp_apoio:
            "O sistema compara o nome e os 4 últimos dígitos do telefone com a lista de convidados. A quantidade só é liberada quando as duas informações estiverem corretas.",
        label_quantidade_convidados: "Quantidade de convidados da família",
        texto_quantidade_convidados:
            "Selecione quantas pessoas desta família vão comparecer. O limite segue o cadastro da família em guests.json.",
        placeholder_quantidade_convidados: "Preencha nome e telefone para liberar as opções",
        texto_botao_enviar_rsvp: "Enviar confirmação",
        opcao_comparecer: "Vou comparecer",
        opcao_nao_comparecer: "Não poderei comparecer",
        linha_rodape:
            "Para dúvidas, fale conosco pelo e-mail abaixo. Ficaremos felizes em ajudar.",
        assinatura_rodape: "Feito com carinho para celebrar esse grande dia.",
        mensagem_pix_copiado: "Chave PIX copiada com sucesso.",
        mensagem_convidado_nao_encontrado:
            "Não encontramos seus dados na lista. Confira o nome completo e os 4 últimos dígitos do telefone.",
        mensagem_convidado_ja_confirmou:
            "Esta confirmação já foi registrada anteriormente para este convidado.",
        mensagem_campos_incompletos:
            "Preencha o nome completo, os 4 últimos dígitos do telefone e escolha uma opção de confirmação.",
        mensagem_confirmacao_enviada:
            "Sua resposta foi registrada com sucesso. Muito obrigado por confirmar.",
        mensagem_mensagem_incompleta:
            "Preencha seu nome e escreva sua mensagem para enviar.",
        mensagem_mensagem_enviada:
            "Sua mensagem foi enviada com carinho. Muito obrigado.",
        mensagem_erro_envio:
            "Não foi possível enviar sua confirmação agora. Tente novamente em alguns instantes.",
        mensagem_erro_mensagem:
            "Não foi possível enviar sua mensagem agora. Tente novamente em alguns instantes.",
        mensagem_erro_lista:
            "Não foi possível carregar a lista de convidados. Publique o site em um servidor para testar o RSVP com guests.json."
    },

    servico_confirmacoes: {
        tipo: "formspree",
        endpoint_formspree: "https://formspree.io/f/mreonlqq",
        endpoint_personalizado: "",
        assunto: "Nova confirmação de presença - Sandro e Lucilene",
        desabilitar_captcha: false,
        template: "table"
    },

    firebase: {
        habilitado: true,
        collection_confirmacoes: "confirmacoes",
        collection_mensagens: "mensagens",
        config: {
            apiKey: "AIzaSyAnrHCXauInS0kYM-9sjfmUbpLeJFjYg2M",
            authDomain: "casamento-ls.firebaseapp.com",
            projectId: "casamento-ls",
            storageBucket: "casamento-ls.firebasestorage.app",
            messagingSenderId: "317962393576",
            appId: "1:317962393576:web:eea879c17e78dd7591365d"
        }
    },

    acesso_convidado: {
        liberar_qr_horas_antes: 1,
        mostrar_qr_apos_evento: true,
        titulo: "Seu QR Code de acesso",
        texto:
            "Depois da confirmação neste dispositivo, o seu QR individual aparecerá aqui automaticamente a partir de 1 hora antes do evento.",
        mensagem_sem_confirmacao:
            "Confirme sua presença neste dispositivo para gerar seu QR personalizado.",
        mensagem_aguardando_liberacao:
            "Seu QR ainda não foi liberado. Ele aparecerá automaticamente em {tempo}.",
        mensagem_qr_liberado:
            "Seu QR já está liberado neste dispositivo. Apresente-o na entrada quando chegar.",
        mensagem_qr_nao_comparece:
            "Sua resposta foi registrada como ausência. Por isso, nenhum QR de acesso será liberado neste dispositivo.",
        mensagem_qr_indisponivel:
            "O QR não está disponível neste momento.",
        mensagem_qr_sem_biblioteca:
            "Não foi possível renderizar o QR automaticamente neste navegador, mas o link de identificação continua disponível abaixo.",
        mensagem_status_dispositivo:
            "Este QR fica salvo no navegador usado para confirmar a presença. Se trocar de aparelho, será preciso confirmar novamente no novo dispositivo ou usar o link individual.",
        mensagem_status_confirmado: "Confirmado para entrada",
        mensagem_status_nao_comparece: "Resposta registrada como ausência",
        mensagem_status_pendente: "Aguardando confirmação",
        link_identificacao: "Abrir identificação do convidado"
    },

    admin: {
        codigo_acesso: "LStheBest",
        titulo_acesso: "Acesso reservado",
        texto_acesso:
            "No fim da página existe um campo discreto para liberar os controles de administração deste convite.",
        label_codigo: "Código de administração",
        placeholder_codigo: "Digite o código secreto",
        botao_liberar: "Liberar painel",
        botao_sair: "Encerrar modo admin",
        titulo_painel: "Painel administrativo",
        texto_painel:
            "Use este painel como base administrativa deste dispositivo para acompanhar confirmações, registrar entradas, exportar relatórios e organizar a lista local.",
        titulo_scanner: "Leitor de QR Code",
        texto_scanner:
            "Aponte a câmera para o QR ou cole manualmente o link codificado caso precise validar um convidado sem câmera.",
        botao_abrir_camera: "Abrir câmera",
        botao_fechar_camera: "Fechar câmera",
        botao_validar_manual: "Validar código",
        placeholder_manual: "Cole aqui o conteúdo do QR Code",
        titulo_entradas: "Lista de confirmações e entradas",
        texto_entradas:
            "Cada confirmação salva neste dispositivo aparece aqui. Quando o QR é escaneado, o horário de entrada também é registrado.",
        titulo_mensagens: "Mensagens recebidas",
        texto_mensagens:
            "Aqui você acompanha todas as mensagens carinhosas enviadas pelo site e salvas na base central.",
        titulo_controles: "Controles rápidos",
        botao_limpar_entradas: "Limpar entradas",
        botao_resetar_registros: "Resetar registros locais",
        botao_copiar_relatorio: "Copiar relatório",
        botao_exportar_planilha: "Baixar planilha CSV",
        botao_exportar_pdf: "Gerar relatório PDF",
        estatistica_total: "Registros no painel",
        estatistica_confirmados: "Confirmados",
        estatistica_pendentes: "Pendentes/ausência",
        mensagem_codigo_invalido: "Código incorreto. Verifique e tente novamente.",
        mensagem_painel_liberado: "Modo admin liberado neste dispositivo.",
        mensagem_camera_indisponivel:
            "Não foi possível acessar a câmera. Você ainda pode validar o QR manualmente.",
        mensagem_qr_invalido:
            "Este QR não é válido para a lista de convidados deste site.",
        mensagem_entrada_registrada:
            "Entrada registrada com sucesso para este convidado.",
        mensagem_entrada_atualizada:
            "Este convidado já havia sido registrado. O horário foi atualizado.",
        mensagem_registros_limpos:
            "Os registros locais deste dispositivo foram limpos com sucesso.",
        mensagem_lista_limpa: "A lista de entradas foi limpa com sucesso.",
        mensagem_relatorio_copiado: "Relatório copiado com sucesso.",
        mensagem_planilha_exportada: "Planilha CSV gerada com sucesso.",
        mensagem_pdf_aberto: "A visualização do relatório foi aberta. Use a opção de salvar como PDF.",
        texto_sem_mensagens: "Nenhuma mensagem carinhosa foi recebida ainda.",
        status_confirmado: "Confirmado",
        status_ausencia: "Ausência",
        status_pendente: "Pendente",
        status_entrada_registrada: "Entrada liberada",
        status_entrada_bloqueada: "Entrada bloqueada",
        status_entrada_nao_registrada: "Sem escaneamento",
        texto_sem_entradas: "Nenhuma confirmação ou entrada foi registrada ainda neste dispositivo.",
        texto_sem_camera:
            "O leitor de câmera não está disponível agora. Use a validação manual para continuar.",
        texto_aviso_seguranca:
            "Como este projeto funciona sem backend, o modo admin fica protegido apenas por este código no navegador."
    },

    whatsapp: {
        modo_envio: "link",
        api_endpoint: "",
        titulo_admin: "Envio de QR por WhatsApp",
        texto_admin:
            "Busque um convidado pelo número de WhatsApp para gerar um QR Code individual, abrir a conversa e enviar o acesso personalizado. Os números completos ficam em private/guest-contacts.json para facilitar separar esse arquivo da publicação.",
        campo_busca: "Número de WhatsApp",
        placeholder_busca: "Ex.: 5521999999999",
        botao_buscar: "Buscar convidado",
        botao_copiar_link: "Copiar link do QR",
        botao_baixar_qr: "Baixar QR",
        botao_whatsapp: "Abrir WhatsApp",
        botao_compartilhar: "Compartilhar QR",
        botao_api: "Enviar via API",
        titulo_status: "Convite identificado",
        texto_status:
            "Este QR identifica o convidado e informa se a presença já foi confirmada no sistema.",
        botao_ouvir_novamente: "Ouvir novamente",
        mensagem_busca_vazia: "Digite o número de WhatsApp para localizar o convidado.",
        mensagem_convidado_nao_encontrado:
            "Nenhum convidado foi encontrado com esse número de WhatsApp.",
        mensagem_link_copiado: "Link do QR copiado com sucesso.",
        mensagem_api_sucesso: "Solicitação enviada para a API de WhatsApp com sucesso.",
        mensagem_api_erro: "Não foi possível enviar pela API configurada.",
        mensagem_qr_invalido: "Este QR Code não corresponde a nenhum convidado cadastrado.",
        mensagem_status_confirmado: "Confirmada",
        mensagem_status_nao_confirmado: "Não confirmada",
        mensagem_status_pendente: "Ainda não confirmada",
        fala_confirmado: "{nome}. Presença confirmada.",
        fala_nao_confirmado: "{nome}. Presença não confirmada.",
        fala_pendente: "{nome}. Presença ainda não confirmada.",
        mensagem_whatsapp:
            "Olá, {nome}! Aqui está o seu QR Code personalizado do casamento de {evento}.\\n\\nAbra seu link individual: {link}\\n\\nStatus atual: {status}.\\n\\nSe preferir, você também pode receber a imagem do QR anexada nesta conversa."
    },

    armazenamento_local_rsvp: "casamento-sandro-lucilene-rsvp-v2",
    armazenamento_local_qr: "casamento-sandro-lucilene-guest-pass-v2",
    armazenamento_admin_sessao: "casamento-sandro-lucilene-admin-session-v1",
    armazenamento_admin_entradas: "casamento-sandro-lucilene-admin-entry-log-v1"
};
