# 📱 UPA Monitor

Aplicativo mobile para monitoramento de filas de atendimento em UPAs (Unidades de Pronto Atendimento), integrado ao sistema NovoSGA.

## 📋 Sobre o Projeto

Este aplicativo foi desenvolvido como parte de um Trabalho de Conclusão de Curso (TCC) e permite que pacientes visualizem em tempo real:

- 🏥 Lista de UPAs da região
- 👥 Número de pessoas na fila
- ⏱️ Tempo médio de espera
- 🩺 Filas por especialidade médica
- 📍 Localização das unidades

## 🚀 Tecnologias

- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **NovoSGA API** - Backend de gerenciamento de filas
- **OAuth2** - Autenticação segura

## 📦 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Expo Go (no celular) ou emulador Android/iOS
- NovoSGA configurado e rodando

## ⚙️ Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/upa-monitor.git
cd upa-monitor
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
API_BASE_URL=http://SEU_IP:8000
OAUTH_CLIENT_ID=seu_client_id
OAUTH_CLIENT_SECRET=seu_client_secret
OAUTH_USERNAME=seu_usuario
OAUTH_PASSWORD=sua_senha
```

⚠️ **IMPORTANTE:** Nunca commite o arquivo `.env` com credenciais reais!

### 4. Inicie o aplicativo

```bash
npx expo start
```

Escaneie o QR Code com o Expo Go ou pressione:
- `a` para Android
- `i` para iOS
- `w` para web

## 🔧 Configuração do Backend

Para configurar o backend NovoSGA, consulte a documentação completa em:

📄 [CONFIGURACAO_API.md](./CONFIGURACAO_API.md)

## 📁 Estrutura do Projeto

```
upa-monitor/
├── App.js                      # Componente principal
├── src/
│   └── utils/
│       └── constants.js        # Configurações e constantes
├── .env.example                # Exemplo de variáveis de ambiente
├── .gitignore                  # Arquivos ignorados pelo Git
├── package.json                # Dependências do projeto
├── README.md                   # Este arquivo
└── CONFIGURACAO_API.md         # Guia de configuração da API
```

## 🎨 Funcionalidades

### Tela Principal
- Lista de UPAs disponíveis
- Indicador visual do tempo de espera (verde/amarelo/vermelho)
- Número de pessoas na fila
- Navegação entre abas

### Tela de Detalhes
- Informações completas da UPA
- Filas separadas por especialidade
- Tempo médio de espera por especialidade
- Botão para voltar

### Tela de Localizações
- Lista de endereços das UPAs
- Preparado para integração com mapas

## 🔐 Segurança

### Desenvolvimento
- Credenciais em arquivo `.env` (não commitado)
- CORS configurado para testes locais

### Produção
- [ ] Implementar variáveis de ambiente seguras
- [ ] Configurar CORS restrito
- [ ] Usar HTTPS
- [ ] Implementar refresh tokens
- [ ] Adicionar rate limiting

## 🧪 Testando

### Modo Mock (sem API)

Para testar sem conexão com a API:

```javascript
// src/utils/constants.js
export const USE_API = false;
```

### Modo API (com backend)

```javascript
// src/utils/constants.js
export const USE_API = true;
```

## 📱 Indicadores de Status

- **🔄 API** - Conectado à API real
- **💾 Mock** - Usando dados de exemplo

## 🐛 Troubleshooting

### Erro: "Network request failed"
- Verifique se o servidor NovoSGA está rodando
- Confirme o IP em `.env`
- Verifique se o celular está na mesma rede Wi-Fi

### Erro: "403 Forbidden"
- Configure o CORS no backend
- Veja [CONFIGURACAO_API.md](./CONFIGURACAO_API.md)

### App mostra "💾 Mock"
- Verifique `USE_API = true` em `constants.js`
- Teste a API no navegador

## 📚 Documentação Adicional

- [Configuração da API](./CONFIGURACAO_API.md)
- [NovoSGA](https://novosga.org/docs/)
- [React Native](https://reactnative.dev/docs/getting-started)
- [Expo](https://docs.expo.dev/)

## 👥 Autor

Desenvolvido como TCC - Trabalho de Conclusão de Curso

## 📄 Licença

Este projeto é de código aberto para fins educacionais.

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## ⚠️ Aviso

Este é um projeto acadêmico. Para uso em produção, implemente as medidas de segurança adequadas.
