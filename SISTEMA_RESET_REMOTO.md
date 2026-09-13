# Sistema de Reset Remoto por QR Code

## Análise Atual

### 1. Identificação de Convidados (QR Codes)
- **guests.json**: Lista centralizada com IDs (`id`), nomes, telefone (últimos 4), status e `qr_liberado` (bool)
- **Script de geração**: `script.js` gera QR codes com base em `guest-status.html?guest={id}&status={status}`
- **Validação**: Nome + 4 últimos dígitos do telefone
- **Armazenamento local**: `localStorage` com chave `config.armazenamento_local_rsvp` e `config.armazenamento_local_qr`

### 2. Bloqueios Implementados
Os dados estão salvos em localStorage:
- `casamento-sandro-lucilene-rsvp-v2`: Confirmações e respostas
- `casamento-sandro-lucilene-guest-pass-v2`: Status do QR (liberado/bloqueado por convidado)
- `casamento-sandro-lucilene-admin-session-v1`: Sessão admin
- `casamento-sandro-lucilene-admin-entry-log-v1`: Log de entradas

### 3. Fluxo de QR Code Atual
1. Convidado confirma presença no dispositivo
2. Dados salvos em localStorage local
3. QR gerado se confirmado e liberado por horário
4. Scanner no dispositivo de entrada valida o QR
5. Entrada registrada em localStorage

---

## Solução: Reset Remoto Individual com `accessVersion`

### Conceito
Um campo `accessVersion` será adicionado a cada convidado em `guests.json`. O navegador armazenará a versão conhecida por convidado. Quando a versão no servidor for maior que a do navegador, o sistema limpa apenas os dados de bloqueio daquele convidado.

### Implementação

#### 1. Estrutura de guests.json
```json
{
  "id": "marcos-peres",
  "nome": "Marcos Peres",
  "telefone_ultimos4": "0304",
  "qr_liberado": true,
  "accessVersion": 1  // ← NOVO CAMPO
}
```

#### 2. LocalStorage do Navegador
Novo chave para rastrear versões por convidado:
```javascript
// Chave: casamento-sandro-lucilene-guest-versions
{
  "marcos-peres": 1,
  "paulo-garcia": 1,
  "hugo-mota": 1
}
```

#### 3. Dados Limpos no Reset
Apenas para o convidado afetado:
- Entrada removida do log (`admin-entry-log-v1`)
- Status do QR resetado (`guest-pass-v2`)
- Confirmação pode ser mantida ou removida (configurável)

Dados preservados:
- Confirmações globais (Firebase/Formspree)
- Sessão admin
- Outros convidados

#### 4. Fluxo de Verificação
```
Usuário acessa guest-status.html?guest={id}
    ↓
Carregar guests.json
    ↓
Comparar: guests.json[guest].accessVersion > localStorage[guest]
    ↓
Se SIM: Executar reset (limpar bloqueios)
Se NÃO: Continuar normalmente
    ↓
Atualizar localStorage com nova versão
```

---

## Benefícios

✅ **Reset sem contato físico**: Modificar apenas `guests.json` no servidor  
✅ **Granularidade individual**: Apenas convidado afetado é resetado  
✅ **Segurança**: Não apaga dados globais ou de outros convidados  
✅ **Reversível**: Basta incrementar o número novamente se necessário  
✅ **Transparente**: Convidado vê automática atualização ao acessar QR  

---

## Casos de Uso

1. **Convidado bloqueado por erro**: Incrementar `accessVersion` de 1 para 2
2. **Teste de scanner falhado**: Reset rápido sem contactar convidado
3. **Dispositivo trocado**: Convidado acessa QR novamente e libera
4. **Auditoria de segurança**: Resetta acesso de um grupo incrementando versões em batch

