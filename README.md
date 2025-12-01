# GastoCerto 💰

Aplicação de controle financeiro pessoal com React (frontend) e Node.js + Express (backend), utilizando Supabase como banco de dados.

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase com projeto criado
- As tabelas `salaries` e `expenses` criadas no Supabase (veja instruções abaixo)

## 🚀 Como Executar

### 1. Configurar o Backend

1. Entre na pasta do backend:
```bash
cd backend
```

2. Crie um arquivo `.env` na pasta `backend` com as seguintes variáveis:
```env
PORT=4000
FRONTEND_ORIGIN=http://localhost:5173
SUPABASE_URL=https://seu-projeto-id.supabase.co
SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
```

**Onde encontrar essas chaves no Supabase:**
- Acesse seu projeto no Supabase
- Vá em **Settings** → **API**
- Copie a **URL** do projeto
- Copie a **anon public** key
- Copie a **service_role** key (mantenha segura!)

3. Instale as dependências (se ainda não instalou):
```bash
npm install
```

4. Inicie o servidor backend:
```bash
npm run dev
```

O backend estará rodando em `http://localhost:4000`

### 2. Configurar o Frontend

1. Abra um **novo terminal** e entre na pasta do frontend:
```bash
cd frontend
```

2. Crie um arquivo `.env` na pasta `frontend`:
```env
VITE_API_URL=http://localhost:4000
```

3. Instale as dependências (se ainda não instalou):
```bash
npm install
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

O frontend estará rodando em `http://localhost:5173`

### 3. Acessar a Aplicação

Abra seu navegador em: **http://localhost:5173**

- Primeiro, crie uma conta em **Registrar**
- Faça login
- Adicione seu salário
- Adicione seus gastos
- Veja quanto ainda tem disponível!

## 🗄️ Configuração do Banco de Dados (Supabase)

Execute este SQL no **SQL Editor** do Supabase:

```sql
-- Tabela de salários
CREATE TABLE public.salaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL,
  reference_month TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de gastos
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  category TEXT,
  amount NUMERIC(12,2) NOT NULL,
  occurred_on DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX idx_salaries_user_id ON public.salaries(user_id);
CREATE INDEX idx_expenses_user_id ON public.expenses(user_id, occurred_on DESC);
```

## 📁 Estrutura do Projeto

```
WEB/
├── backend/          # API Node.js + Express
│   ├── src/
│   │   ├── config/   # Configurações (Supabase, env)
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   └── package.json
│
└── frontend/         # Aplicação React
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   └── api/
    └── package.json
```

## 🛠️ Scripts Disponíveis

### Backend
- `npm run dev` - Inicia servidor em modo desenvolvimento (com nodemon)
- `npm start` - Inicia servidor em modo produção

### Frontend
- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Preview do build de produção

## ⚠️ Troubleshooting

**Erro de conexão com Supabase:**
- Verifique se as chaves no `.env` do backend estão corretas
- Confirme que as tabelas foram criadas no Supabase

**Erro de CORS:**
- Verifique se `FRONTEND_ORIGIN` no backend está apontando para a URL correta do frontend

**Porta já em uso:**
- Altere a `PORT` no `.env` do backend ou feche o processo que está usando a porta 4000

## 📝 Notas

- O backend usa a **Service Role Key** do Supabase, que bypassa RLS (Row Level Security)
- As senhas são gerenciadas pelo Supabase Auth
- Os dados são isolados por usuário através do `user_id`


