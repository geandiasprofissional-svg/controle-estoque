const db = require("../database/connection");

class ProdutoModel {

    criar(produto, callback) {

        const sql = `
            INSERT INTO produtos (
                nome,
                codigo_barras,
                descricao,
                quantidade,
                categoria,
                validade,
                imagem
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        db.run(
            sql,
            [
                produto.nome,
                produto.codigo_barras,
                produto.descricao,
                produto.quantidade,
                produto.categoria,
                produto.validade,
                produto.imagem
            ],
            function (erro) {

                if (erro) {
                    callback(erro);
                    return;
                }

                callback(null);
            }
        );
    }


    listar(callback) {

        const sql = `
            SELECT *
            FROM produtos
            ORDER BY nome ASC
        `;

        db.all(sql, [], (erro, rows) => {

            if (erro) {

                console.error(
                    "Erro ao listar produtos:",
                    erro.message
                );

                callback(erro, null);
                return;
            }

            callback(null, rows);
        });
    }


    atualizar(id, produto, callback) {

        const sql = `
            UPDATE produtos
            SET
                nome = ?,
                codigo_barras = ?,
                descricao = ?,
                quantidade = ?,
                categoria = ?,
                validade = ?,
                imagem = ?
            WHERE id = ?
        `;

        db.run(
            sql,
            [
                produto.nome,
                produto.codigo_barras,
                produto.descricao,
                produto.quantidade,
                produto.categoria,
                produto.validade,
                produto.imagem,
                id
            ],
            function (erro) {

                if (erro) {
                    callback(erro);
                    return;
                }

                if (this.changes === 0) {

                    const erroProduto = new Error(
                        "Produto não encontrado."
                    );

                    erroProduto.codigo = "PRODUTO_NAO_ENCONTRADO";

                    callback(erroProduto);
                    return;
                }

                callback(null);
            }
        );
    }


    movimentarEstoque(id, quantidade, callback) {

        db.serialize(() => {

            db.run("BEGIN TRANSACTION", (erroInicio) => {

                if (erroInicio) {
                    callback(erroInicio);
                    return;
                }


                const sqlEstoque = `
                    UPDATE produtos
                    SET quantidade = quantidade + ?
                    WHERE id = ?
                    AND quantidade + ? >= 0
                `;


                db.run(
                    sqlEstoque,
                    [
                        quantidade,
                        id,
                        quantidade
                    ],
                    function (erroEstoque) {

                        if (erroEstoque) {

                            db.run("ROLLBACK", () => {
                                callback(erroEstoque);
                            });

                            return;
                        }


                        if (this.changes === 0) {

                            const erroEstoqueInsuficiente =
                                new Error(
                                    "Estoque insuficiente ou produto não encontrado."
                                );

                            erroEstoqueInsuficiente.codigo =
                                "ESTOQUE_INSUFICIENTE";


                            db.run("ROLLBACK", () => {
                                callback(
                                    erroEstoqueInsuficiente
                                );
                            });

                            return;
                        }


                        const tipo =
                            quantidade > 0
                                ? "ENTRADA"
                                : "SAIDA";


                        const quantidadeMovimentacao =
                            Math.abs(quantidade);


                        const sqlMovimentacao = `
                            INSERT INTO movimentacoes_estoque (
                                produto_id,
                                tipo,
                                quantidade
                            )
                            VALUES (?, ?, ?)
                        `;


                        db.run(
                            sqlMovimentacao,
                            [
                                id,
                                tipo,
                                quantidadeMovimentacao
                            ],
                            function (erroMovimentacao) {

                                if (erroMovimentacao) {

                                    console.error(
                                        "Erro ao registrar movimentação:",
                                        erroMovimentacao.message
                                    );


                                    db.run(
                                        "ROLLBACK",
                                        () => {
                                            callback(
                                                erroMovimentacao
                                            );
                                        }
                                    );

                                    return;
                                }


                                db.run(
                                    "COMMIT",
                                    (erroCommit) => {

                                        if (erroCommit) {

                                            db.run(
                                                "ROLLBACK",
                                                () => {
                                                    callback(
                                                        erroCommit
                                                    );
                                                }
                                            );

                                            return;
                                        }

                                        callback(null);
                                    }
                                );
                            }
                        );
                    }
                );
            });
        });
    }


    listarMovimentacoes(callback) {

        const sql = `
            SELECT
                movimentacoes_estoque.id,
                movimentacoes_estoque.produto_id,
                produtos.nome AS produto,
                movimentacoes_estoque.tipo,
                movimentacoes_estoque.quantidade,
                movimentacoes_estoque.data_movimentacao
            FROM movimentacoes_estoque
            INNER JOIN produtos
                ON produtos.id = movimentacoes_estoque.produto_id
            ORDER BY
                movimentacoes_estoque.data_movimentacao DESC
        `;

        db.all(
            sql,
            [],
            (erro, rows) => {

                if (erro) {

                    console.error(
                        "Erro ao listar movimentações:",
                        erro.message
                    );

                    callback(erro, null);
                    return;
                }

                callback(null, rows);
            }
        );
    }


    excluir(id, callback) {

        const sql = `
            DELETE FROM produtos
            WHERE id = ?
        `;

        db.run(
            sql,
            [id],
            function (erro) {

                if (erro) {
                    callback(erro);
                    return;
                }

                if (this.changes === 0) {

                    const erroProduto = new Error(
                        "Produto não encontrado."
                    );

                    erroProduto.codigo =
                        "PRODUTO_NAO_ENCONTRADO";

                    callback(erroProduto);
                    return;
                }

                callback(null);
            }
        );
    }
}


module.exports = new ProdutoModel();