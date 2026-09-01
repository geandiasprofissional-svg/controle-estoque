# 📦 Controle de Estoque

Sistema web Full Stack para gerenciamento de estoque, desenvolvido como Projeto Integrador do curso de Análise e Desenvolvimento de Sistemas.

A aplicação permite gerenciar produtos e fornecedores, estabelecer relacionamentos entre eles, acompanhar o estoque e registrar movimentações de entrada e saída por meio de uma API REST.

---

## 🚀 Funcionalidades

### 📊 Dashboard

- Visualização resumida das informações do estoque.
- Quantidade de produtos cadastrados.
- Indicadores relacionados ao estoque.
- Identificação de produtos com estoque baixo.

### 📦 Produtos

- Cadastro de produtos.
- Listagem de produtos.
- Edição de produtos.
- Exclusão de produtos.
- Controle da quantidade em estoque.
- Informações como:
  - Nome
  - Código de barras
  - Descrição
  - Quantidade
  - Categoria
  - Validade
  - Imagem

### 🏢 Fornecedores

- Cadastro de fornecedores.
- Listagem de fornecedores.
- Edição de fornecedores.
- Exclusão de fornecedores.
- Armazenamento de informações como:
  - Nome da empresa
  - CNPJ
  - Endereço
  - Telefone
  - E-mail
  - Contato principal

### 🔗 Relacionamentos

- Associação entre produtos e fornecedores.
- Listagem dos relacionamentos cadastrados.
- Edição de relacionamentos.
- Exclusão de relacionamentos.
- Relacionamento entre tabelas no banco de dados.

### 📈 Movimentações de estoque

- Registro de entradas de estoque.
- Registro de saídas de estoque.
- Atualização da quantidade disponível.
- Histórico das movimentações realizadas.
- Identificação do tipo de movimentação.
- Registro da quantidade e data da movimentação.

---

## 🛠️ Tecnologias utilizadas

### Frontend

- React
- Vite
- React Router
- Axios
- React Icons
- CSS

### Backend

- Node.js
- Express
- CORS
- SQLite
- sqlite3

### Ferramentas

- Visual Studio Code
- Git
- GitHub
- Insomnia
- DB Browser for SQLite

---

## 🏗️ Arquitetura

O projeto foi desenvolvido utilizando uma arquitetura separando frontend e backend.

```text
Frontend (React)
       │
       │ HTTP / API REST
       ▼
Backend (Node.js + Express)
       │
       ▼
Banco de dados SQLite
```

---

## 📁 Estrutura do projeto

```text
controle-estoque/
├── backend/
│   ├── controllers/
│   ├── database/
│   ├── models/
│   └── routes/
├── frontend/
│   └── src/
│       ├── components/
│       ├── layouts/
│       ├── pages/
│       ├── routes/
│       ├── services/
│       └── styles/
├── screenshots/
├── .gitignore
└── README.md
```

---

## ▶️ Como executar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/geandiasprofissional-svg/controle-estoque.git
cd controle-estoque
```

### 2. Executar o Backend

Abra um terminal:

```bash
cd backend
npm install
node app.js
```

O backend será executado na porta `3000`.

### 3. Executar o Frontend

Abra outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O Vite exibirá no terminal o endereço local para acessar a aplicação.

### 4. Acessar o sistema

Abra no navegador o endereço informado pelo Vite, normalmente:

```text
http://localhost:5173
```

> Caso a porta 5173 esteja ocupada, o Vite poderá utilizar outra porta, como `5174`.
---

## 🖥️ Screenshots

### 📊 Dashboard

![Dashboard](screenshots/Dashboard.png)

### 📦 Produtos

![Produtos](screenshots/Produtos.png)

### 🏢 Fornecedores

![Fornecedores](screenshots/Fornecedores.png)

### 🔗 Relacionamentos

![Relacionamentos](screenshots/Relacionamentos.png)

### 📈 Movimentações

![Movimentações](screenshots/Movimentações.png)