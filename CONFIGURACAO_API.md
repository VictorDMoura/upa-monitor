# 📱 Configuração da API NovoSGA com OAuth2

Documentação completa para integrar o aplicativo React Native com a API do NovoSGA usando autenticação OAuth2.

---

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Configuração do Backend (NovoSGA)](#configuração-do-backend-novosga)
3. [Configuração do Frontend (React Native)](#configuração-do-frontend-react-native)
4. [Configuração de Rede](#configuração-de-rede)
5. [Testando a Integração](#testando-a-integração)
6. [Troubleshooting](#troubleshooting)
7. [Segurança](#segurança)
8. [Checklist](#checklist-de-configuração)

---

## 🔧 Pré-requisitos

### Backend
- WSL2 (Ubuntu) instalado no Windows
- PHP 8.x
- Composer
- Docker e Docker Compose
- NovoSGA instalado

### Frontend
- Node.js 18+
- Expo CLI
- React Native configurado
- Celular com Expo Go instalado

---

## ⚙️ Configuração do Backend (NovoSGA)

### 1. Configurar CORS

O CORS permite que o app mobile acesse a API.

**No WSL (Ubuntu):**

```bash
cd /caminho/para/novosga

# Instalar pacote CORS
composer require nelmio/cors-bundle
```

**Criar arquivo de configuração:**

```bash
nano config/packages/nelmio_cors.yaml
```

**Conteúdo do arquivo:**

```yaml
nelmio_cors:
    defaults:
        origin_regex: true
        allow_origin: ['*']
        allow_methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'PATCH', 'DELETE']
        allow_headers: ['Content-Type', 'Authorization', 'X-Requested-With']
        expose_headers: ['Link']
        max_age: 3600
    paths:
        '^/api/':
            allow_origin: ['*']
            allow_headers: ['*']
            allow_methods: ['POST', 'PUT', 'GET', 'DELETE', 'PATCH', 'OPTIONS']
            max_age: 3600
```

**Salvar:** `Ctrl+O`, `Enter`, `Ctrl+X`

**Limpar cache:**

```bash
php bin/console cache:clear
```

### 2. Verificar Credenciais OAuth2

As credenciais padrão estão em `src/DataFixtures/AppFixtures.php`:

- **Client ID:** Definido nas fixtures
- **Client Secret:** Definido nas fixtures
- **Username:** Definido nas fixtures
- **Password:** Definido nas fixtures

⚠️ **IMPORTANTE:** Em produção, altere essas credenciais para valores seguros!

### 3. Iniciar Serviços

**Iniciar Docker (PostgreSQL e Mercure):**

```bash
cd /caminho/para/novosga
docker-compose up -d
```

**Verificar se está rodando:**

```bash
docker ps
```

Deve mostrar containers do PostgreSQL e Mercure rodando.

**Iniciar servidor PHP:**

```bash
php -S 0.0.0.0:8000 -t public
```

Deve aparecer:
```
PHP 8.x Development Server (http://0.0.0.0:8000) started
```

⚠️ **Mantenha esse terminal aberto!** O servidor precisa ficar rodando.

---

## 📱 Configuração do Frontend (React Native)

### 1. Estrutura do Projeto

```
upa-monitor/
├── App.js                    # Componente principal com OAuth2
├── src/
│   └── utils/
│       └── constants.js      # Configurações da API
├── package.json
└── CONFIGURACAO_API.md       # Esta documentação
```

### 2. Configurar Credenciais

**Arquivo: `src/utils/constants.js`**

```javascript
// CONFIGURAÇÃO DA API - ALTERE O IP AQUI!
export const API_BASE_URL = 'http://SEU_IP:8000';
export const API_URL = `${API_BASE_URL}/api`;
export const USE_API = true; // false para usar dados mockados

// Credenciais OAuth2
export const OAUTH_CLIENT_ID = 'seu_client_id';
export const OAUTH_CLIENT_SECRET = 'seu_client_secret';
export const OAUTH_USERNAME = 'seu_usuario';
export const OAUTH_PASSWORD = 'sua_senha';
```

**⚠️ Substitua:**
- `SEU_IP` pelo IP da sua máquina Windows
- As credenciais OAuth2 pelas definidas no NovoSGA

### 3. Implementação OAuth2

**No `App.js`, a função de autenticação:**

```javascript
const getAccessToken = async () => {
  try {
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('client_id', OAUTH_CLIENT_ID);
    formData.append('client_secret', OAUTH_CLIENT_SECRET);
    formData.append('username', OAUTH_USERNAME);
    formData.append('password', OAUTH_PASSWORD);

    const response = await fetch(`${API_URL}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro OAuth2:', errorText);
      throw new Error('Erro na autenticação OAuth2');
    }

    const data = await response.json();
    return data.access_token;
  } catch (err) {
    console.error('Erro ao obter token:', err);
    throw err;
  }
};
```

**Usar o token nas requisições:**

```javascript
const loadUpas = async () => {
  try {
    // Obter token OAuth2
    const token = await getAccessToken();

    // Headers com autenticação
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    // Fazer requisições autenticadas
    const response = await fetch(`${API_URL}/unidades`, { headers });
    const data = await response.json();
    
    // Processar dados...
  } catch (err) {
    console.error('Erro:', err);
    // Fallback para dados mockados
  }
};
```

---

## 🌐 Configuração de Rede

### Problema: Celular não acessa o servidor

O celular precisa acessar o servidor através do IP da máquina Windows, mas o WSL tem um IP interno diferente.

### Solução: Port Forwarding

#### Passo 1: Descobrir o IP do WSL

**No WSL (Ubuntu):**

```bash
hostname -I
```

**Exemplo de saída:** `172.21.49.44`

Anote este IP!

#### Passo 2: Descobrir o IP do Windows

**No CMD ou PowerShell:**

```cmd
ipconfig
```

Procure por:
```
Adaptador de Rede sem Fio Wi-Fi:
   Endereço IPv4. . . . . . . . : 192.168.15.9
```

Anote este IP!

#### Passo 3: Configurar Port Forwarding

**No PowerShell como Administrador:**

```powershell
# Encaminhar porta 8000 do Windows para o WSL
netsh interface portproxy add v4tov4 listenport=8000 listenaddress=0.0.0.0 connectport=8000 connectaddress=IP_DO_WSL
```

**Exemplo real:**
```powershell
netsh interface portproxy add v4tov4 listenport=8000 listenaddress=0.0.0.0 connectport=8000 connectaddress=172.21.49.44
```

⚠️ **Substitua `172.21.49.44` pelo IP do seu WSL!**

#### Passo 4: Liberar no Firewall

**No PowerShell como Administrador:**

```powershell
New-NetFirewallRule -DisplayName "WSL NovoSGA" -Direction Inbound -LocalPort 8000 -Protocol TCP -Action Allow
```

#### Passo 5: Verificar Configuração

```powershell
netsh interface portproxy show all
```

**Deve mostrar:**
```
Escutar em ipv4:             Conectar-se a ipv4:
Endereço       Porta         Endereço       Porta
------------   ----------    ------------   ----------
0.0.0.0        8000          172.21.49.44   8000
```

#### Passo 6: Usar o IP do Windows no App

**No `constants.js`:**

```javascript
export const API_BASE_URL = 'http://192.168.15.9:8000';
```

⚠️ **Use o IP do Windows, NÃO o IP do WSL!**

---

## ✅ Testando a Integração

### 1. Testar API no Navegador do Windows

**Página principal do NovoSGA:**
```
http://SEU_IP_WINDOWS:8000
```

**Endpoint de token OAuth2:**
```
http://SEU_IP_WINDOWS:8000/api/token
```

**Endpoint de unidades:**
```
http://SEU_IP_WINDOWS:8000/api/unidades
```

Se retornar erro 401 (não autorizado), está correto! A API exige autenticação.

### 2. Testar no App React Native

**Iniciar o app:**

```bash
cd upa-monitor
npx expo start -c
```

**Escanear QR Code com Expo Go**

**Indicadores de sucesso:**

✅ **Subtítulo mostra "🔄 API"** → Usando API real  
✅ **Dados das UPAs aparecem** → Requisições funcionando  
✅ **Sem erros no console** → OAuth2 configurado corretamente

**Indicadores de problema:**

❌ **Subtítulo mostra "💾 Mock"** → API não acessível, usando fallback  
❌ **Erro "Network request failed"** → Problema de rede  
❌ **Erro "403 Forbidden"** → CORS não configurado

---

## 🔍 Troubleshooting

### Erro: "Network request failed"

**Possíveis causas:**

1. ❌ Servidor PHP não está rodando
2. ❌ Firewall bloqueando
3. ❌ Celular em rede Wi-Fi diferente
4. ❌ IP incorreto no `constants.js`
5. ❌ Port forwarding não configurado

**Soluções:**

1. ✅ Verificar se `php -S 0.0.0.0:8000 -t public` está rodando
2. ✅ Configurar port forwarding (ver seção acima)
3. ✅ Conectar celular na mesma Wi-Fi que o PC
4. ✅ Confirmar IP com `ipconfig` e atualizar `constants.js`
5. ✅ Verificar com `netsh interface portproxy show all`

### Erro: "403 Forbidden"

**Causa:** CORS não configurado ou mal configurado

**Solução:**

1. Verificar se arquivo `nelmio_cors.yaml` existe
2. Limpar cache: `php bin/console cache:clear`
3. Reiniciar servidor PHP

### Erro: "Erro na autenticação OAuth2"

**Possíveis causas:**

1. ❌ Credenciais incorretas em `constants.js`
2. ❌ Usuário não existe no banco de dados
3. ❌ Fixtures não foram carregadas

**Soluções:**

1. ✅ Verificar credenciais em `constants.js` e `AppFixtures.php`
2. ✅ Executar fixtures: `php bin/console doctrine:fixtures:load`
3. ✅ Verificar logs do servidor PHP

### App mostra "💾 Mock" mesmo com API rodando

**Causa:** `USE_API = false` em `constants.js`

**Solução:**

```javascript
export const USE_API = true;
```

### Port Forwarding não funciona

**Remover regra antiga:**

```powershell
netsh interface portproxy delete v4tov4 listenport=8000 listenaddress=0.0.0.0
```

**Adicionar novamente:**

1. Descobrir novo IP do WSL: `hostname -I`
2. Adicionar regra com IP atualizado
3. Verificar com `netsh interface portproxy show all`

### IP do WSL muda toda vez que reinicia

**Solução:** Criar script para atualizar port forwarding

**Arquivo: `update-port-forwarding.ps1`**

```powershell
# Remover regra antiga
netsh interface portproxy delete v4tov4 listenport=8000 listenaddress=0.0.0.0

# Obter novo IP do WSL
$wslIp = (wsl hostname -I).Trim()

# Adicionar nova regra
netsh interface portproxy add v4tov4 listenport=8000 listenaddress=0.0.0.0 connectport=8000 connectaddress=$wslIp

# Mostrar configuração
netsh interface portproxy show all
```

**Executar como Administrador toda vez que reiniciar o PC**

---

## 🔐 Segurança

### Para Desenvolvimento (Ambiente Local)

✅ **Permitido:**
- CORS com `allow_origin: ['*']`
- Credenciais padrão do NovoSGA
- HTTP sem SSL
- Port forwarding aberto

⚠️ **Apenas para testes locais!**

### Para Produção

❌ **NUNCA use em produção:**
- CORS aberto (`allow_origin: ['*']`)
- Credenciais padrão
- HTTP sem SSL
- Credenciais no código

✅ **OBRIGATÓRIO em produção:**
- CORS restrito ao domínio do app
- Credenciais únicas e seguras
- HTTPS com certificado SSL válido
- Refresh tokens
- Rate limiting
- Logs de acesso e auditoria
- Variáveis de ambiente para credenciais

**Exemplo de CORS em produção:**

```yaml
nelmio_cors:
    paths:
        '^/api/':
            allow_origin: ['https://seu-dominio.com']
            allow_credentials: true
            allow_methods: ['GET', 'POST', 'PUT', 'DELETE']
```

**Exemplo de variáveis de ambiente:**

```javascript
// .env (não commitar!)
OAUTH_CLIENT_ID=seu_client_id_producao
OAUTH_CLIENT_SECRET=seu_secret_producao
API_URL=https://api.seu-dominio.com
```

---

## 📝 Checklist de Configuração

### Backend (NovoSGA)

- [ ] CORS instalado e configurado
- [ ] Docker rodando (`docker ps` mostra containers)
- [ ] Servidor PHP rodando (`php -S 0.0.0.0:8000 -t public`)
- [ ] API acessível no navegador (`http://localhost:8000`)
- [ ] Fixtures carregadas (usuário de teste existe)

### Rede

- [ ] IP do WSL identificado (`hostname -I`)
- [ ] IP do Windows identificado (`ipconfig`)
- [ ] Port forwarding configurado
- [ ] Port forwarding verificado (`netsh interface portproxy show all`)
- [ ] Firewall liberado
- [ ] API acessível pelo IP do Windows no navegador

### Frontend (React Native)

- [ ] IP do Windows configurado em `constants.js`
- [ ] Credenciais OAuth2 configuradas em `constants.js`
- [ ] `USE_API = true` em `constants.js`
- [ ] Celular conectado na mesma Wi-Fi
- [ ] App iniciado (`npx expo start -c`)
- [ ] App conectando com sucesso (mostra "🔄 API")

### Testes

- [ ] Navegador acessa `http://IP_WINDOWS:8000`
- [ ] Navegador acessa `http://IP_WINDOWS:8000/api/unidades`
- [ ] App mostra "🔄 API" no subtítulo
- [ ] App carrega dados reais das UPAs
- [ ] Sem erros no console do Expo

---

## 📚 Recursos Adicionais

### Documentação Oficial

- [NovoSGA](https://novosga.org/docs/)
- [League OAuth2 Server](https://oauth2.thephpleague.com/)
- [Nelmio CORS Bundle](https://github.com/nelmio/NelmioCorsBundle)
- [React Native Networking](https://reactnative.dev/docs/network)
- [Expo Documentation](https://docs.expo.dev/)

### Comandos Úteis

**WSL:**
```bash
# Ver IP do WSL
hostname -I

# Reiniciar Docker
docker-compose restart

# Ver logs do Docker
docker-compose logs -f

# Limpar cache do Symfony
php bin/console cache:clear
```

**Windows:**
```powershell
# Ver IP do Windows
ipconfig

# Ver port forwarding
netsh interface portproxy show all

# Remover port forwarding
netsh interface portproxy delete v4tov4 listenport=8000 listenaddress=0.0.0.0

# Ver regras do Firewall
Get-NetFirewallRule -DisplayName "*NovoSGA*"
```

**React Native:**
```bash
# Limpar cache e reiniciar
npx expo start -c

# Ver logs detalhados
npx expo start --verbose

# Resetar completamente
rm -rf node_modules package-lock.json
npm install
```

---

## 🎯 Fluxo Completo de Autenticação

```
1. App inicia
   ↓
2. Chama getAccessToken()
   ↓
3. Envia credenciais para /api/token
   ↓
4. NovoSGA valida credenciais
   ↓
5. Retorna access_token
   ↓
6. App armazena token
   ↓
7. Todas requisições incluem: Authorization: Bearer {token}
   ↓
8. NovoSGA valida token
   ↓
9. Retorna dados solicitados
```

---

## 📊 Estrutura de Dados

### Token Response

```json
{
  "token_type": "Bearer",
  "expires_in": 3600,
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "def50200..."
}
```

### Unidades Response

```json
[
  {
    "id": 1,
    "nome": "UPA Centro",
    "endereco": "Rua Principal, 100",
    "ativo": true
  }
]
```

---

## 🐛 Debug

### Habilitar logs detalhados

**No App.js:**

```javascript
const getAccessToken = async () => {
  console.log('🔐 Iniciando autenticação OAuth2...');
  console.log('📍 URL:', `${API_URL}/token`);
  
  try {
    const response = await fetch(`${API_URL}/token`, {...});
    console.log('✅ Status:', response.status);
    
    const data = await response.json();
    console.log('✅ Token obtido:', data.access_token.substring(0, 20) + '...');
    
    return data.access_token;
  } catch (err) {
    console.error('❌ Erro completo:', err);
    throw err;
  }
};
```

### Ver requisições no servidor

O terminal onde `php -S` está rodando mostra todas as requisições:

```
[Sun Nov 10 17:30:00 2024] 192.168.15.100:54321 [200]: POST /api/token
[Sun Nov 10 17:30:01 2024] 192.168.15.100:54322 [200]: GET /api/unidades
```

---

**Desenvolvido para o TCC - Monitor de Filas UPA**  
**Data:** Novembro 2024  
**Versão:** 1.0
