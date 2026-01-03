# Guia do PWA (Progressive Web App)

O ALFREDO agora é um Progressive Web App (PWA), permitindo que os usuários instalem o aplicativo em seus dispositivos móveis e desktops como se fosse um app nativo.

## 🎯 Funcionalidades Implementadas

### ✅ Instalação como App
- Os usuários podem instalar o ALFREDO diretamente do navegador
- Funciona em dispositivos móveis (Android/iOS) e desktop
- O app aparece na tela inicial como um aplicativo nativo

### ✅ Funcionamento Offline
- Service Worker cacheia recursos essenciais
- O app funciona mesmo sem conexão com internet
- Dados são sincronizados quando a conexão é restaurada

### ✅ Experiência Nativa
- Tela de splash personalizada
- Ícone na tela inicial
- Abre em modo standalone (sem barra do navegador)
- Cores e tema personalizados

## 📱 Como Instalar

### Android (Chrome/Edge)
1. Abra o ALFREDO no navegador Chrome ou Edge
2. Aguarde o prompt de instalação aparecer (ou clique no menu ⋮)
3. Selecione "Adicionar à tela inicial" ou "Instalar app"
4. Confirme a instalação
5. O app aparecerá na tela inicial

### iOS (Safari)
1. Abra o ALFREDO no Safari
2. Toque no botão de compartilhar (□↑)
3. Selecione "Adicionar à Tela de Início"
4. Personalize o nome (opcional)
5. Toque em "Adicionar"
6. O app aparecerá na tela inicial

### Desktop (Chrome/Edge)
1. Abra o ALFREDO no navegador
2. Clique no ícone de instalação na barra de endereços (ou aguarde o prompt)
3. Clique em "Instalar"
4. O app abrirá em uma janela separada

## 🔧 Arquivos Criados

### `public/manifest.json`
- Configurações do PWA
- Nome, descrição, ícones
- Cores do tema
- Modo de exibição (standalone)
- Atalhos para páginas principais

### `public/sw.js`
- Service Worker para cache offline
- Gerencia recursos estáticos
- Permite funcionamento sem internet
- Sincronização automática

### `src/hooks/usePWAInstall.tsx`
- Hook React para gerenciar instalação
- Detecta se o app é instalável
- Controla o prompt de instalação
- Verifica se já está instalado

### `src/components/pwa/InstallPrompt.tsx`
- Componente de UI para prompt de instalação
- Aparece automaticamente quando o app é instalável
- Pode ser dispensado pelo usuário
- Lembra a preferência do usuário

## 🧪 Como Testar

### 1. Testar Instalação
```bash
# Inicie o servidor de desenvolvimento
npm run dev

# Acesse http://localhost:8080
# Abra as ferramentas de desenvolvedor (F12)
# Vá para a aba "Application" > "Manifest"
# Verifique se o manifest está carregado corretamente
```

### 2. Testar Service Worker
```bash
# Nas ferramentas de desenvolvedor:
# Vá para "Application" > "Service Workers"
# Verifique se o service worker está registrado
# Teste o modo offline (Network > Offline)
# Recarregue a página - deve funcionar offline
```

### 3. Testar em Dispositivo Móvel
```bash
# Use ngrok ou similar para expor o localhost
# Acesse do dispositivo móvel
# Verifique se o prompt de instalação aparece
# Teste a instalação
```

## 📋 Requisitos para PWA

Para que um PWA seja instalável, ele precisa:
- ✅ HTTPS (ou localhost em desenvolvimento)
- ✅ Manifest.json válido
- ✅ Service Worker registrado
- ✅ Ícones em pelo menos 192x192 e 512x512
- ✅ Viewport configurado corretamente

## 🎨 Personalização

### Alterar Ícones
1. Substitua os arquivos em `public/lovable-uploads/`
2. Atualize as referências no `manifest.json`
3. Certifique-se de ter ícones em 192x192 e 512x512

### Alterar Cores
Edite o `manifest.json`:
```json
{
  "theme_color": "#091526",  // Cor da barra de status
  "background_color": "#ffffff"  // Cor de fundo do splash
}
```

### Alterar Nome/Descrição
Edite o `manifest.json`:
```json
{
  "name": "ALFREDO - Seu Assistente Financeiro",
  "short_name": "ALFREDO",
  "description": "Sua descrição aqui"
}
```

## 🐛 Troubleshooting

### Service Worker não registra
- Verifique se está usando HTTPS ou localhost
- Verifique o console do navegador para erros
- Limpe o cache e recarregue

### Prompt de instalação não aparece
- O prompt só aparece em navegadores compatíveis (Chrome, Edge, Safari)
- O usuário precisa visitar o site pelo menos uma vez
- Verifique se o manifest.json está acessível

### App não funciona offline
- Verifique se o Service Worker está registrado
- Verifique se os recursos estão sendo cacheados
- Teste em modo offline nas DevTools

## 📚 Recursos Adicionais

- [MDN - Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web.dev - PWA](https://web.dev/progressive-web-apps/)
- [PWA Builder](https://www.pwabuilder.com/)

## 🚀 Próximos Passos (Opcional)

- [ ] Adicionar notificações push
- [ ] Melhorar cache offline (cachear mais recursos)
- [ ] Adicionar sincronização em background
- [ ] Criar ícones em diferentes tamanhos
- [ ] Adicionar splash screens personalizadas
- [ ] Implementar atualização automática do Service Worker

