# Sistema Financeiro - Controle de Despesas

Sistema completo de controle financeiro com categorias hierárquicas, integração Supabase e interface moderna.

## 🚀 Funcionalidades

### ✨ Sistema de Categorias Hierárquicas
- **9 Categorias Principais** com ícones e cores
- **42 Subcategorias** organizadas hierarquicamente
- **Interface intuitiva** com seletor hierárquico
- **Migração automática** de transações antigas

### 📊 Gestão Financeira
- Controle de receitas e despesas
- Categorização automática
- Relatórios e gráficos
- Filtros por período

### 🔐 Autenticação e Perfil
- Login com Supabase Auth
- Perfil personalizável
- Sistema de assinatura simplificado

## 🛠️ Tecnologias

- **Frontend:** React + TypeScript + Vite
- **UI:** Tailwind CSS + Shadcn/ui
- **Backend:** Supabase (PostgreSQL)
- **Autenticação:** Supabase Auth
- **Deploy:** Vercel

## 📦 Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/seu-usuario/sistema-financeiro.git
cd sistema-financeiro
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**
```bash
cp env.example .env.local
```

Edite o `.env.local` com suas credenciais do Supabase:
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

4. **Execute o projeto:**
```bash
npm run dev
```

## 🗄️ Configuração do Banco de Dados

### 1. Execute o Script de Categorias Hierárquicas

No **Supabase SQL Editor**, execute o script `setup-categorias-final.sql` para configurar:

- Categorias principais com ícones
- Subcategorias organizadas
- Estrutura hierárquica completa

### 2. Migre Transações Antigas

Execute o script `migrar-transacoes-antigas.sql` para migrar transações existentes para as novas categorias.

## 🎨 Estrutura de Categorias

### Categorias Principais Implementadas:

- **🚗 Transporte** → Gasolina, Uber/Táxi, Ônibus/Metrô, Manutenção
- **🍽️ Alimentação** → Supermercado, Restaurante, Fast Food, Cafeteria  
- **🏠 Moradia** → Aluguel, Conta de Luz, Água, Internet
- **💰 Receitas** → Salário, Freelance, Investimentos, Presentes
- **💊 Saúde** → (Sem subcategorias)
- **🎮 Lazer** → (Sem subcategorias)
- **📚 Educação** → (Sem subcategorias)
- **👕 Vestuário** → (Sem subcategorias)
- **📦 Outros** → (Sem subcategorias)

## 🔧 Desenvolvimento

### Estrutura de Arquivos

```
src/
├── components/
│   ├── transactions/
│   │   └── HierarchicalCategorySelector.tsx  # Seletor de categorias
│   └── ui/                                   # Componentes Shadcn/ui
├── hooks/
│   ├── useAuth.tsx                          # Hook de autenticação
│   └── useTransacoes.ts                     # Hook de transações
├── lib/
│   └── supabase.ts                          # Configuração Supabase
├── pages/
│   ├── Dashboard.tsx                        # Dashboard principal
│   ├── Transacoes.tsx                       # Lista de transações
│   └── Perfil.tsx                           # Perfil do usuário
└── services/
    └── transacoes.ts                        # Serviços de transações
```

### Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Linting
```

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório à Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Variáveis de Ambiente Necessárias

```env
VITE_SUPABASE_URL=https://yjtsyuibemnkjfyonfjt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqdHN5dWliZW1ua2pmeW9uZmp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMjEwMDAsImV4cCI6MjA3MDU5NzAwMH0.YTvf5T80OMwhZYgK0vnWULnalBvtGUd68Zg1LiI0kI
```

### ⚠️ Importante para Deploy

**Se você estiver recriando o projeto na Vercel:**

1. **Delete o projeto atual** na Vercel
2. **Crie um novo projeto** conectando ao mesmo repositório GitHub
3. **Configure as variáveis de ambiente** imediatamente após criar o projeto
4. **Aguarde o primeiro deploy** terminar
5. **Teste o login** para confirmar que está funcionando

## 📝 Licença

MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no GitHub ou entre em contato.

---

**Desenvolvido com ❤️ para controle financeiro eficiente**
