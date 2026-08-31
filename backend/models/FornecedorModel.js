const db = require("../database/connection");


class FornecedorModel {

    criar(fornecedor, callback) {

        const sql = `
            INSERT INTO fornecedores (
                nome_empresa,
                cnpj,
                endereco,
                telefone,
                email,
                contato_principal
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `;


        db.run(
            sql,
            [
                fornecedor.nome_empresa,
                fornecedor.cnpj,
                fornecedor.endereco,
                fornecedor.telefone,
                fornecedor.email,
                fornecedor.contato_principal
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
            FROM fornecedores
            ORDER BY nome_empresa ASC
        `;


        db.all(
            sql,
            [],
            (erro, rows) => {

                if (erro) {

                    console.error(
                        "Erro ao listar fornecedores:",
                        erro.message
                    );

                    callback(erro, null);
                    return;
                }


                callback(null, rows);
            }
        );
    }


    atualizar(id, fornecedor, callback) {

        const sql = `
            UPDATE fornecedores
            SET
                nome_empresa = ?,
                cnpj = ?,
                endereco = ?,
                telefone = ?,
                email = ?,
                contato_principal = ?
            WHERE id = ?
        `;


        db.run(
            sql,
            [
                fornecedor.nome_empresa,
                fornecedor.cnpj,
                fornecedor.endereco,
                fornecedor.telefone,
                fornecedor.email,
                fornecedor.contato_principal,
                id
            ],
            function (erro) {

                if (erro) {

                    callback(erro);
                    return;
                }


                if (this.changes === 0) {

                    const erroFornecedor =
                        new Error(
                            "Fornecedor não encontrado."
                        );

                    erroFornecedor.codigo =
                        "FORNECEDOR_NAO_ENCONTRADO";

                    callback(erroFornecedor);
                    return;
                }


                callback(null);
            }
        );
    }


    excluir(id, callback) {

        const sql = `
            DELETE FROM fornecedores
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

                    const erroFornecedor =
                        new Error(
                            "Fornecedor não encontrado."
                        );

                    erroFornecedor.codigo =
                        "FORNECEDOR_NAO_ENCONTRADO";

                    callback(erroFornecedor);
                    return;
                }


                callback(null);
            }
        );
    }

}


module.exports = new FornecedorModel();