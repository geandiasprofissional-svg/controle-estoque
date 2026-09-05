const db = require("./connection");

function seedDatabase() {
    db.get("SELECT COUNT(*) AS total FROM produtos", (err, row) => {
        if (err) {
            console.error("Erro ao verificar dados existentes:", err.message);
            return;
        }

        if (row.total > 0) {
            console.log("Dados de demonstração já existem, seed não executado.");
            return;
        }

        console.log("Banco vazio, inserindo dados de demonstração...");

        db.serialize(() => {
            const fornecedores = [
                ["Distribuidora ABC Ltda", "12.345.678/0001-90", "Rua das Flores, 100 - São Paulo/SP", "(11) 3456-7890", "contato@distribuidoraabc.com", "Carlos Mendes"],
                ["Comercial D LTDA", "98.765.432/0001-10", "Av. Brasil, 500 - Rio de Janeiro/RJ", "(21) 2345-6789", "vendas@comercialdltda.com", "Fernanda Souza"]
            ];

            const fornecedorIds = [];

            fornecedores.forEach((f, index) => {
                db.run(
                    `INSERT INTO fornecedores (nome_empresa, cnpj, endereco, telefone, email, contato_principal)
                     VALUES (?, ?, ?, ?, ?, ?)`,
                    f,
                    function (err) {
                        if (err) {
                            console.error("Erro ao inserir fornecedor:", err.message);
                            return;
                        }
                        fornecedorIds[index] = this.lastID;

                        if (index === fornecedores.length - 1) {
                            inserirProdutos(fornecedorIds);
                        }
                    }
                );
            });
        });
    });
}

function inserirProdutos(fornecedorIds) {
    const produtos = [
        ["Arroz Branco 5kg", "7891000100103", "Arroz tipo 1, pacote de 5kg", 40, "Alimentos", "2026-12-31", null],
        ["Feijão Carioca 1kg", "7891000100202", "Feijão carioca tipo 1", 25, "Alimentos", "2026-10-15", null],
        ["Óleo de Soja 900ml", "7891000100301", "Óleo de soja refinado", 5, "Alimentos", "2027-03-20", null],
        ["Detergente Neutro 500ml", "7891000100400", "Detergente líquido para louças", 30, "Limpeza", null, null]
    ];

    const produtoIds = [];

    produtos.forEach((p, index) => {
        db.run(
            `INSERT INTO produtos (nome, codigo_barras, descricao, quantidade, categoria, validade, imagem)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            p,
            function (err) {
                if (err) {
                    console.error("Erro ao inserir produto:", err.message);
                    return;
                }
                produtoIds[index] = this.lastID;

                if (index === produtos.length - 1) {
                    inserirRelacionamentos(produtoIds, fornecedorIds);
                    inserirMovimentacoes(produtoIds);
                }
            }
        );
    });
}

function inserirRelacionamentos(produtoIds, fornecedorIds) {
    const relacionamentos = [
        [produtoIds[0], fornecedorIds[0]],
        [produtoIds[1], fornecedorIds[0]],
        [produtoIds[2], fornecedorIds[1]],
        [produtoIds[3], fornecedorIds[1]]
    ];

    relacionamentos.forEach((r) => {
        db.run(
            `INSERT INTO produto_fornecedor (produto_id, fornecedor_id) VALUES (?, ?)`,
            r,
            (err) => {
                if (err) console.error("Erro ao inserir relacionamento:", err.message);
            }
        );
    });
}

function inserirMovimentacoes(produtoIds) {
    const movimentacoes = [
        [produtoIds[0], "entrada", 40],
        [produtoIds[1], "entrada", 25],
        [produtoIds[2], "entrada", 10],
        [produtoIds[2], "saida", 5],
        [produtoIds[3], "entrada", 30]
    ];

    movimentacoes.forEach((m) => {
        db.run(
            `INSERT INTO movimentacoes_estoque (produto_id, tipo, quantidade) VALUES (?, ?, ?)`,
            m,
            (err) => {
                if (err) console.error("Erro ao inserir movimentação:", err.message);
            }
        );
    });

    console.log("Dados de demonstração inseridos com sucesso!");
}

module.exports = seedDatabase;