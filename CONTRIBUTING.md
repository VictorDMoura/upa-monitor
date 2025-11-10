# 🤝 Contribuindo para o UPA Monitor

Obrigado por considerar contribuir com o UPA Monitor! Este documento fornece diretrizes para contribuir com o projeto.

## 📋 Código de Conduta

Este projeto adere a um código de conduta. Ao participar, você concorda em manter um ambiente respeitoso e acolhedor para todos.

## 🚀 Como Contribuir

### 1. Fork o Projeto

```bash
# Clone seu fork
git clone https://github.com/seu-usuario/upa-monitor.git
cd upa-monitor

# Adicione o repositório original como upstream
git remote add upstream https://github.com/usuario-original/upa-monitor.git
```

### 2. Crie uma Branch

```bash
# Atualize sua main
git checkout main
git pull upstream main

# Crie uma nova branch
git checkout -b feature/nome-da-funcionalidade
```

### 3. Faça suas Alterações

- Escreva código limpo e bem documentado
- Siga os padrões de código do projeto
- Adicione testes se aplicável
- Atualize a documentação se necessário

### 4. Commit suas Mudanças

Usamos [Conventional Commits](https://www.conventionalcommits.org/) para mensagens de commit:

```bash
git commit -m "feat: adiciona visualização de mapa"
git commit -m "fix: corrige erro de autenticação"
git commit -m "docs: atualiza README com novas instruções"
```

**Tipos de commit:**
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação (não afeta o código)
- `refactor:` Refatoração de código
- `test:` Adiciona ou modifica testes
- `chore:` Tarefas de manutenção

### 5. Push para o GitHub

```bash
git push origin feature/nome-da-funcionalidade
```

### 6. Abra um Pull Request

- Vá para o repositório no GitHub
- Clique em "Pull Request"
- Selecione sua branch
- Preencha o template de PR
- Aguarde review

## 📝 Padrões de Código

### JavaScript/React Native

```javascript
// ✅ Bom
const handlePress = useCallback((item) => {
  console.log('Item selecionado:', item.id);
  setSelectedItem(item);
}, []);

// ❌ Evite
function handlePress(item) {
  console.log(item)
  setSelectedItem(item)
}
```

### Nomenclatura

- **Componentes:** PascalCase (`UPACard.js`)
- **Funções:** camelCase (`getAccessToken`)
- **Constantes:** UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Arquivos:** camelCase ou kebab-case

### Estrutura de Componentes

```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

/**
 * Componente para exibir informações da UPA
 * @param {Object} props
 * @param {Object} props.upa - Dados da UPA
 * @param {Function} props.onPress - Callback ao pressionar
 */
export default function UPACard({ upa, onPress }) {
  // Hooks
  const [loading, setLoading] = useState(false);

  // Effects
  useEffect(() => {
    // ...
  }, []);

  // Handlers
  const handlePress = () => {
    onPress(upa);
  };

  // Render
  return (
    <View style={styles.container}>
      <Text>{upa.nome}</Text>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
```

## 🧪 Testes

### Executar Testes

```bash
npm test                 # Rodar todos os testes
npm run test:watch       # Modo watch
npm run test:coverage    # Com cobertura
```

### Escrever Testes

```javascript
import { render, fireEvent } from '@testing-library/react-native';
import UPACard from '../UPACard';

describe('UPACard', () => {
  const mockUpa = {
    id: 1,
    nome: 'UPA Centro',
    pessoas: 10,
    tempo: 25,
  };

  it('deve renderizar corretamente', () => {
    const { getByText } = render(<UPACard upa={mockUpa} />);
    expect(getByText('UPA Centro')).toBeTruthy();
  });

  it('deve chamar onPress ao clicar', () => {
    const onPress = jest.fn();
    const { getByText } = render(<UPACard upa={mockUpa} onPress={onPress} />);
    
    fireEvent.press(getByText('UPA Centro'));
    expect(onPress).toHaveBeenCalledWith(mockUpa);
  });
});
```

## 📚 Documentação

### JSDoc

Documente funções e componentes complexos:

```javascript
/**
 * Busca UPAs da API com autenticação OAuth2
 * @async
 * @returns {Promise<Array>} Lista de UPAs
 * @throws {Error} Se a autenticação falhar
 */
async function fetchUpas() {
  // ...
}
```

### README

Ao adicionar novas funcionalidades, atualize:
- README.md
- CONFIGURACAO_API.md (se aplicável)
- CHANGELOG.md

## 🐛 Reportando Bugs

### Antes de Reportar

1. Verifique se o bug já foi reportado
2. Teste na versão mais recente
3. Colete informações do erro

### Template de Issue

```markdown
**Descrição do Bug**
Descrição clara e concisa do problema.

**Como Reproduzir**
1. Vá para '...'
2. Clique em '....'
3. Veja o erro

**Comportamento Esperado**
O que deveria acontecer.

**Screenshots**
Se aplicável, adicione screenshots.

**Ambiente:**
 - OS: [ex: iOS 16, Android 13]
 - Versão do App: [ex: 1.0.0]
 - Expo Go: [sim/não]

**Informações Adicionais**
Qualquer outra informação relevante.
```

## 💡 Sugerindo Melhorias

### Template de Feature Request

```markdown
**Descrição da Funcionalidade**
Descrição clara da funcionalidade desejada.

**Problema que Resolve**
Qual problema esta funcionalidade resolve?

**Solução Proposta**
Como você imagina que funcione?

**Alternativas Consideradas**
Outras soluções que você considerou?

**Contexto Adicional**
Screenshots, mockups, etc.
```

## 🔍 Code Review

### O que Procuramos

- ✅ Código limpo e legível
- ✅ Testes adequados
- ✅ Documentação atualizada
- ✅ Sem credenciais expostas
- ✅ Performance otimizada
- ✅ Acessibilidade considerada

### Processo de Review

1. Automated checks (CI/CD)
2. Code review por mantenedores
3. Testes manuais se necessário
4. Aprovação e merge

## 📦 Versionamento

Seguimos [Semantic Versioning](https://semver.org/):

- **MAJOR:** Mudanças incompatíveis na API
- **MINOR:** Nova funcionalidade compatível
- **PATCH:** Correções de bugs

Exemplo: `1.2.3`
- 1 = MAJOR
- 2 = MINOR
- 3 = PATCH

## 🎯 Áreas que Precisam de Ajuda

- [ ] Testes unitários
- [ ] Testes de integração
- [ ] Documentação
- [ ] Tradução (i18n)
- [ ] Acessibilidade
- [ ] Performance
- [ ] Design/UI

## 📞 Contato

- Issues: [GitHub Issues](https://github.com/usuario/upa-monitor/issues)
- Discussões: [GitHub Discussions](https://github.com/usuario/upa-monitor/discussions)

## 📄 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a mesma licença do projeto (MIT).

---

**Obrigado por contribuir! 🎉**
