const db = require("./connection");

db.serialize(() => {

    // Tabela produtos
    db.run(`
        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            codigo_barras TEXT UNIQUE,
            descricao TEXT NOT NULL,
            quantidade INTEGER,
            categoria TEXT NOT NULL,
            validade TEXT,
            imagem TEXT
        )
    `);


    // Tabela fornecedores
    db.run(`
        CREATE TABLE IF NOT EXISTS fornecedores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome_empresa TEXT NOT NULL,
            cnpj TEXT UNIQUE NOT NULL,
            endereco TEXT NOT NULL,
            telefone TEXT NOT NULL,
            email TEXT NOT NULL,
            contato_principal TEXT NOT NULL
        )
    `);


    // Tabela produto_fornecedor
    db.run(`
        CREATE TABLE IF NOT EXISTS produto_fornecedor (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            produto_id INTEGER NOT NULL,
            fornecedor_id INTEGER NOT NULL,

            FOREIGN KEY(produto_id)
                REFERENCES produtos(id)
                ON DELETE CASCADE,

            FOREIGN KEY(fornecedor_id)
                REFERENCES fornecedores(id)
                ON DELETE CASCADE
        )
    `);


    // Impede relacionamento duplicado
    db.run(`
        CREATE UNIQUE INDEX IF NOT EXISTS
        idx_produto_fornecedor_unique
        ON produto_fornecedor (produto_id, fornecedor_id)
    `);


    // Tabela de histórico de movimentações do estoque
    db.run(`
        CREATE TABLE IF NOT EXISTS movimentacoes_estoque (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            produto_id INTEGER NOT NULL,
            tipo TEXT NOT NULL,
            quantidade INTEGER NOT NULL,
            data_movimentacao DATETIME DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY(produto_id)
                REFERENCES produtos(id)
                ON DELETE CASCADE
        )
    `);
});