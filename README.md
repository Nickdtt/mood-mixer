<div align="center">

# 🎵 Mood Mixer

### *Transforme seu humor em música com IA*

[![TanStack](https://img.shields.io/badge/TanStack-Start-FF4154?style=for-the-badge&logo=react&logoColor=white)](https://tanstack.com/start)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

![Mood Mixer Banner](https://img.shields.io/badge/🎨_Design-Brutalist_Aesthetic-E63946?style=for-the-badge)

</div>

---

## 📖 Sobre o Projeto

**Mood Mixer** é uma aplicação web moderna que utiliza **Inteligência Artificial** para interpretar seu estado emocional e gerar playlists personalizadas do Deezer. Combinando o poder do **Google Gemini 2.5 Flash Lite** com a API do Deezer, o Mood Mixer traduz sentimentos em música de forma inteligente e contextualizada.

### ✨ Características Principais

- 🤖 **IA Generativa**: Utiliza LangChain + Google Gemini para interpretar humor e gerar queries otimizadas
- 🎵 **Integração Deezer**: Busca e agrega músicas dos top 3 playlists mais populares
- 🎨 **Design Brutalist**: Interface única com estética "geek/despojada" inspirada em arte pop
- ⚡ **Performance**: Built com TanStack Start para SSR e otimização automática
- 🔊 **Preview de Áudio**: Ouça trechos das músicas diretamente na interface
- 🐳 **Docker Ready**: Containerizado e pronto para deploy em qualquer plataforma
- 📱 **Responsivo**: Funciona perfeitamente em desktop e mobile

---

## 🏗️ Arquitetura

```
┌─────────────────┐
│   React UI      │  ← TanStack Router + Tailwind CSS
│  (Brutalist)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  TanStack       │  ← Server Functions (SSR)
│  Start Server   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  LangChain      │  ← Google Gemini 2.5 Flash Lite
│  AI Agent       │     (Mood → Search Query)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Deezer API     │  ← Playlist Search + Track Aggregation
│  Integration    │     (Top 3 playlists → 25 best tracks)
└─────────────────┘
```

### 🧩 Stack Tecnológica

#### Frontend
- **React 19.2** - UI Library
- **TanStack Router 1.132** - File-based routing
- **TanStack React Query 5.66** - Data fetching & caching
- **Tailwind CSS 4.0** - Utility-first styling
- **Lucide React** - Ícones modernos

#### Backend/Server
- **TanStack Start 1.132** - Full-stack React framework (SSR)
- **Nitro** - Server engine
- **Vite 7.1** - Build tool

#### IA & Integração
- **LangChain 1.0** - Framework de IA
- **@langchain/google-genai** - Google Gemini integration
- **Zod 4.1** - Schema validation

#### DevOps
- **Docker** - Containerização
- **Vitest 3.0** - Unit testing
- **TypeScript 5.7** - Type safety

---

## 🚀 Como Usar

### Pré-requisitos

- **Node.js** 18+ 
- **npm** ou **yarn**
- **Chave API do Google Gemini** ([Obtenha aqui](https://ai.google.dev/))

### 📦 Instalação Local

```bash
# Clone o repositório
git clone https://github.com/Nickdtt/mood-mixer.git
cd mood-mixer

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env e adicione sua GOOGLE_API_KEY

# Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em **http://localhost:3000** 🎉

### 🐳 Usando Docker

```bash
# Build da imagem
docker build -t mood-mixer .

# Execute o container
docker run -p 3000:3000 --env-file .env mood-mixer
```

### 🌐 Deploy (Render)

O projeto está configurado para deploy automático no Render:

1. Conecte seu repositório GitHub ao Render
2. Configure as variáveis de ambiente:
   - `GOOGLE_API_KEY` - Sua chave do Google Gemini
3. O Render detectará automaticamente o Dockerfile
4. Deploy automático a cada push na branch `main`

**🔗 Demo Live**: [mood-mixer.onrender.com](https://mood-mixer.onrender.com)

---

## 📂 Estrutura do Projeto

```
tanstack_test/
├── src/
│   ├── routes/              # File-based routing
│   │   ├── index.tsx        # Página principal (Mood Mixer UI)
│   │   ├── __root.tsx       # Layout raiz
│   │   └── api/
│   │       ├── health.ts    # Health check endpoint
│   │       └── generate-playlist.tsx
│   ├── server/              # Server-side logic
│   │   ├── agent.ts         # LangChain AI Agent
│   │   ├── deezer.ts        # Deezer API integration
│   │   └── playlist.ts      # TanStack Server Functions
│   └── styles.css           # Global styles
├── public/                  # Static assets
├── Dockerfile               # Container configuration
├── keep_alive.sh            # Health check script (Render)
├── package.json
└── vite.config.ts
```

---

## 🎯 Funcionalidades Detalhadas

### 🧠 Agente de IA (LangChain + Gemini)

O agente interpreta o humor do usuário e gera queries otimizadas:

```typescript
// Exemplos de tradução:
"Acabei de terminar um relacionamento" → "Sofrência Brasil"
"Programando a noite toda" → "Lo-fi Brasil"
"Indo para a academia" → "Treino Funk"
"Jantar romântico" → "Bossa Nova"
```

### 🎵 Agregação Inteligente de Músicas

1. Busca as **3 playlists mais populares** no Deezer
2. Extrai todas as músicas dessas playlists
3. Remove duplicatas
4. Ordena por popularidade (rank)
5. Retorna as **top 25 músicas**

### 🎨 Design Brutalist

- **Cores vibrantes**: Paleta inspirada em arte pop (#E63946, #F1FAEE, #1D3557, #F4A261)
- **Tipografia bold**: Fontes pesadas e uppercase
- **Sombras duras**: Box-shadows sólidas e angulares
- **Rotações**: Elementos levemente rotacionados para dinamismo
- **Texturas**: Overlay de ruído SVG para profundidade

---

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor em localhost:3000

# Produção
npm run build        # Build otimizado para produção
npm run serve        # Preview da build de produção

# Testes
npm run test         # Executa testes com Vitest

# Utilitários
./keep_alive.sh      # Ping health check (mantém Render ativo)
```

---

## 🔧 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Google Gemini API
GOOGLE_API_KEY=your_google_gemini_api_key_here
```

---

## 🧪 Testes

O projeto utiliza **Vitest** para testes unitários:

```bash
npm run test
```

Bibliotecas de teste incluídas:
- `@testing-library/react` - Testes de componentes
- `@testing-library/dom` - Utilitários DOM
- `jsdom` - Ambiente DOM simulado

---

## 📊 Performance & Otimizações

- ✅ **Server-Side Rendering (SSR)** via TanStack Start
- ✅ **Code Splitting** automático por rota
- ✅ **React Query** para cache inteligente de dados
- ✅ **Vite** para builds ultra-rápidos
- ✅ **Docker multi-stage** para imagens otimizadas

---

## 🐛 Troubleshooting

### Problema: "Cannot find module 'drizzle-kit'"
**Solução**: Este pacote foi removido do projeto. Certifique-se de estar na versão mais recente do código.

### Problema: Deezer retorna playlists vazias
**Solução**: Algumas playlists podem ter geo-restrições. O agente tenta priorizar playlists brasileiras para evitar esse problema.

### Problema: Build do Docker falha
**Solução**: Verifique se o arquivo `.env` está configurado corretamente e se todas as dependências estão listadas no `package.json`.

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

---

## 👨‍💻 Autor

**Nick**

- GitHub: [@Nickdtt](https://github.com/Nickdtt)
- Projeto: [Mood Mixer](https://github.com/Nickdtt/mood-mixer)

---

## 🙏 Agradecimentos

- [TanStack](https://tanstack.com) - Pela incrível stack de ferramentas
- [Google Gemini](https://ai.google.dev/) - Pela API de IA generativa
- [Deezer](https://developers.deezer.com/) - Pela API de música
- [LangChain](https://www.langchain.com/) - Pelo framework de IA

---

<div align="center">

### ⭐ Se você gostou deste projeto, considere dar uma estrela!

**Feito com ❤️ e muita 🎵**

</div>
