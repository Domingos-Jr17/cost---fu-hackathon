# Costant Frontend PWA

Frontend Progressive Web App para a plataforma Costant - Transparência de Infraestrutura de Moçambique.

## Visão Geral

Este frontend foi projetado para ser acessível a todos os cidadãos moçambicanos, independentemente do dispositivo ou conexão com a internet. Oferece duas experiências principais:

1. **PWA (Progressive Web App)** para smartphones com funcionalidades offline
2. **Compatibilidade com navegadores tradicionais** para desktop

## Tecnologias

- **Framework**: Next.js 14 com App Router
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Ícones**: Lucide React
- **PWA**: Service Workers + IndexedDB
- **HTTP Client**: Axios
- **Build Tool**: Next.js (SWC)

## Funcionalidades

### Offline-First
- Cache inteligente de dados da API
- Funcionamento completo sem internet
- Sincronização automática quando online
- Modooffline claramente indicado

### Acessibilidade
- Design responsivo para todos os tamanhos de tela
- Navegação por teclado
- Suporte para leitores de tela
- Alto contraste opcional

### Performance
- Lazy loading de componentes
- Otimização de imagens
- Service Worker para cache estático
- Build otimizado para produção

## Estrutura do Projeto

```
frontend/
├── src/
│   ├── app/                  # App Router (Next.js 13+)
│   │   ├── globals.css       # Estilos globais
│   │   ├── layout.tsx        # Layout principal
│   │   └── page.tsx          # Homepage
│   ├── components/           # Componentes React
│   │   └── ui/              # Componentes UI reutilizáveis
│   ├── lib/                 # Utilitários e configuração
│   │   ├── api.ts           # Cliente HTTP
│   │   ├── storage.ts       # IndexedDB para offline
│   │   └── utils.ts         # Funções utilitárias
│   └── public/              # Assets estáticos
│       ├── manifest.json    # PWA Manifest
│       ├── sw.js           # Service Worker
│       └── icons/          # Ícones da aplicação
```

## Configuração

### 1. Variáveis de Ambiente

Copie `.env.local.example` para `.env.local`:

```bash
cp .env.local.example .env.local
```

Configure as variáveis:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001

# App Information
NEXT_PUBLIC_APP_NAME=Costant
NEXT_PUBLIC_APP_DESCRIPTION=A Ponte entre os Dados da Infraestrutura e Todos os Cidadãos

# PWA Configuration
NEXT_PUBLIC_PWA_ENABLED=true

# Feature Flags
NEXT_PUBLIC_OFFLINE_MODE=true
NEXT_PUBLIC_USSD_SIMULATOR=true
```

### 2. Instalação

```bash
npm install
```

### 3. Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em http://localhost:3000

### 4. Build para Produção

```bash
npm run build
npm run start
```

## Componentes Principais

### UI Components
- `Button` - Botões com múltiplos estilos
- `Card` - Cards para exibir conteúdo
- `Input` - Campos de formulário
- `Badge` - Tags e status indicators

### Project Components
- `ProjectCard` - Card para exibir projeto
- `ProjectList` - Lista de projetos com filtros
- `ProjectDetails` - Página de detalhes do projeto

### Report Components
- `ReportForm` - Formulário para criar relatos
- `ReportList` - Lista de relatos
- `ReportCard` - Card para exibir relato

## Sistema Offline

### Cache Strategy
- **Static Assets**: Cache-first (service worker)
- **API Data**: Network-first com fallback cache
- **User Reports**: Armazenados localmente até sincronização

### IndexedDB Schema
```typescript
interface OfflineData {
  projects: Project[];
  reports: Report[];
  lastSync: string;
  settings: UserSettings;
}
```

### Sync Process
1. User faz relato offline → Armazenado localmente
2. Aplicação detecta conexão → Envia relatos pendentes
3. Remove relatos sincronizados do storage local
4. Atualiza cache com dados frescos

## PWA Features

### Manifest Configuration
- Nome: "Costant - Transparência de Infraestrutura"
- Display: Standalone
- Theme Color: #0066CC
- Orientação: Portrait-primary

### Service Worker
- Cache de assets estáticos
- Interceptor de requisições API
- Background sync para relatos
- Fallback para modo offline

### Install Prompts
- Detecta se PWA não está instalada
- Mostra banner de instalação
- Suporta critérios de instalação do Chrome

## API Integration

### Cliente HTTP
```typescript
import { apiClient } from '@/lib/api';

// Exemplo de uso
const projects = await apiClient.getProjects({
  provincia: 'Maputo',
  setor: 'Estradas'
});
```

### Error Handling
- Network errors detectados automaticamente
- Fallback para dados cacheados
- Indicadores visuais de status
- Retry automático em caso de falha

## Testes

### Unit Tests
```bash
npm run test
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
npm run lint:fix
```

### Formatação
```bash
npm run format
```

## Performance

### Métricas Alvo
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms

### Otimizações
- Component loading lazy
- Image optimization
- Bundle splitting
- Tree shaking automático

## Deploy

### Build para Produção
```bash
npm run build
```

O build cria:
- `.next` - Build otimizado
- `public/_next` - Assets estáticos
- Service worker pronto para produção

### Deploy em Vercel (Recomendado)
```bash
vercel --prod
```

### Deploy Estático
```bash
npm run build
npm run export
# Deploy pasta `out` para qualquer servidor estático
```

## Acessibilidade

### WCAG 2.1 Compliance
- Nível AA alcançado
- Navegação por teclado completa
- ARIA labels implementados
- Contraste de cores adequado

### Mobile-First Design
- Otimizado para telas pequenas
- Touch targets adequados (44px mínimo)
- Safe areas para iPhones
- Orientação suportada

## Debugging

### Service Worker
```javascript
// No browser console
navigator.serviceWorker.getRegistrations()
  .then(registrations => console.log(registrations));
```

### IndexedDB
```javascript
// Chrome DevTools > Application > IndexedDB
```

### Network Requests
```javascript
// Monitorar requisições da API na aba Network
// Ver status de cache e offline
```

## Contribuição

1. Follow Next.js e TypeScript conventions
2. Use Tailwind CSS para estilização
3. Mantenha compatibilidade offline
4. Teste em diferentes dispositivos
5. Valide acessibilidade

## Licença

MIT License - Projeto desenvolvido para Hackathon Costant & FU