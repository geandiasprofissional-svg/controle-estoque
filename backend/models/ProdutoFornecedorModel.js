const db = require("../database/connection");


class ProdutoFornecedorModel {

    associar(produto_id, fornecedor_id, callback) {

        const sql = `
            INSERT INTO produto_fornecedor (
                produto_id,
                fornecedor_id
            )
            VALUES (?, ?)
        `;


        db.run(
            sql,
            [
                produto_id,
                fornecedor_id
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
            SELECT
                produto_fornecedor.id,
                produto_fornecedor.produto_id,
                produto_fornecedor.fornecedor_id,
                produtos.nome AS produto,
                fornecedores.nome_empresa AS fornecedor
            FROM produto_fornecedor

            INNER JOIN produtos
                ON produto_fornecedor.produto_id = produtos.id

            INNER JOIN fornecedores
                ON produto_fornecedor.fornecedor_id = fornecedores.id

            ORDER BY produtos.nome ASC
        `;


        db.all(
            sql,
            [],
            (erro, rows) => {

                if (erro) {

                    console.error(
                        "Erro ao listar relacionamentos:",
                        erro.message
                    );

                    callback(erro, null);
                    return;
                }


                callback(null, rows);
            }
        );
    }


    atualizar(
        id,
        produto_id,
        fornecedor_id,
        callback
    ) {

        const sql = `
            UPDATE produto_fornecedor
            SET
                produto_id = ?,
                fornecedor_id = ?
            WHERE id = ?
        `;


        db.run(
            sql,
            [
                produto_id,
                fornecedor_id,
                id
            ],
            function (erro) {

                if (erro) {

                    callback(erro);
                    return;
                }


                if (this.changes === 0) {

                    const erroNaoEncontrado =
                        new Error(
                            "Relacionamento não encontrado."
                        );

                    erroNaoEncontrado.codigo =
                        "RELACIONAMENTO_NAO_ENCONTRADO";

                    callback(
                        erroNaoEncontrado
                    );

                    return;
                }


                callback(null);
            }
        );
    }


    excluir(id, callback) {

        const sql = `
            DELETE FROM produto_fornecedor
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

                    const erroNaoEncontrado =
                        new Error(
                            "Relacionamento não encontrado."
                        );

                    erroNaoEncontrado.codigo =
                        "RELACIONAMENTO_NAO_ENCONTRADO";

                    callback(
                        erroNaoEncontrado
                    );

                    return;
                }


                callback(null);
            }
        );
    }

}


module.exports =
    new ProdutoFornecedorModel();