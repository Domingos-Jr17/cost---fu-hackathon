# Costant Backend API

Backend para a plataforma Costant - Transparência de Infraestrutura de Moçambique.

## Visão Geral

Esta API serve dados de infraestrutura do Governo de Moçambique de forma simplificada e acessível através de múltiplos canais:

- **PWA (Progressive Web App)** para smartphones
- **USSD/SMS** para telefones básicos

## Tecnologias

- **Framework**: NestJS + TypeScript
- **Banco de Dados**: PostgreSQL (local para desenvolvimento)
- **API Externa**: CoST Moçambique API
- **Armazenamento**: Sistema de arquivos local para fotos
- **Validação**: Class-validator + Class-transformer

## Estrutura do Projeto

```
backend/
├── src/
│   ├── modules/
│   │   ├── projects/    # Gestão de projetos de infraestrutura
│   │   ├── reports/     # Sistema de relatos cidadãos
│   │   └── ussd/        # Interface USSD para telefones básicos
│   ├── config/          # Configuração da aplicação
│   └── common/utils/    # Utilitários compartilhados
├── uploads/             # Uploads de fotos de relatos
└── dist/               # Build compilado
```

## Configuração

### 1. Variáveis de Ambiente

Copie `.env.example` para `.env` e configure as variáveis:

```bash
cp .env.example .env
```

### 2. Banco de Dados

Para desenvolvimento local, use Docker:

```bash
docker-compose up -d
```

### 3. Instalação

```bash
npm install
```

### 4. Executar

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

## API Endpoints

### Projetos

- `GET /api/projects` - Listar projetos (com filtros)
- `GET /api/projects/:id` - Detalhes do projeto
- `GET /api/projects/health` - Health check

### Relatos

- `POST /api/reports` - Criar relato
- `GET /api/reports` - Listar relatos

### USSD

- `POST /ussd/incoming` - Processar requisição USSD
- `GET /ussd/simulator` - Interface de simulação

## Filtros de Projetos

### Por Província
```http
GET /api/projects?provincia=Maputo
GET /api/projects?provincia=Gaza
```

### Por Setor
```http
GET /api/projects?setor=Estradas
GET /api/projects?setor=Escolas
```

### Combinados
```http
GET /api/projects?provincia=Sofala&setor=Hospitais
```

## Documentação

A documentação Swagger está disponível em:
```
http://localhost:3001/api/docs
```

## Transformação de Dados

A API transforma dados complexos do formato OC4IDS da CoST API para um formato simplificado e amigável:

### Input (OC4IDS)
```json
{
  "ocid": "ocds-xxx",
  "tender": {
    "status": "active",
    "value": { "amount": 45000000, "currency": "MZN" }
  }
}
```

### Output (Simplificado)
```json
{
  "id": "ocds-xxx",
  "nome": "Escola Primária da Comunidade",
  "provincia": "Maputo",
  "setor": "Escolas",
  "valor": "45M MZN",
  "estado": "Em Andamento",
  "progresso": 60
}
```

## Sistema de Relatos

### Funcionalidades
- Upload de fotos com remoção automática de EXIF
- Hash de números de telefone para privacidade
- Rate limiting (3 relatos/telefone/dia)
- Validação automática de conteúdo
- Sistema de scoring para moderação

### Privacidade
- Números de telefone nunca armazenados em texto claro
- IPs hashados e removidos após 30 dias
- Fotos sem metadata de localização
- Opção de relato anônimo

## USSD System

### Estrutura de Menus
```
*555#
1. Selecionar Província
2. Selecionar Setor
3. Ver Projetos
4. Fazer Relato
```

### Limitações Técnicas
- 160 caracteres por resposta SMS
- Sessões stateless com IDs únicos
- Formatação inteligente de texto

## Desenvolvimento

### Testes
```bash
npm run test
npm run test:cov
npm run test:e2e
```

### Lint
```bash
npm run lint
npm run format
```

## Deploy (Local)

Para desenvolvimento, o backend foi configurado para rodar localmente:

1. **Porta**: 3001
2. **Database**: PostgreSQL via Docker
3. **Uploads**: Sistema de arquivos local
4. **Documentação**: localhost:3001/api/docs

## Performance

- Cache de 1 hora para dados da API CoST
- Rate limiting para proteção contra abuso
- Índices otimizados no banco de dados
- Compressão de respostas JSON

## Segurança

- Helmet para headers de segurança
- CORS configurado para frontend
- Validação de todos os inputs
- Rate limiting por IP e telefone

## Licença

MIT License - Projeto desenvolvido para Hackathon Costant & FU