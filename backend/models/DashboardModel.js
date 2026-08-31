const db = require("../database/connection");


class DashboardModel {


    contarProdutos(callback) {

        const sql = `
            SELECT COUNT(*) AS total
            FROM produtos
        `;


        db.get(
            sql,
            [],
            (erro, resultado) => {

                if (erro) {

                    callback(erro, null);
                    return;
                }


                callback(
                    null,
                    resultado.total
                );
            }
        );
    }


    contarFornecedores(callback) {

        const sql = `
            SELECT COUNT(*) AS total
            FROM fornecedores
        `;


        db.get(
            sql,
            [],
            (erro, resultado) => {

                if (erro) {

                    callback(erro, null);
                    return;
                }


                callback(
                    null,
                    resultado.total
                );
            }
        );
    }


    contarRelacionamentos(callback) {

        const sql = `
            SELECT COUNT(*) AS total
            FROM produto_fornecedor
        `;


        db.get(
            sql,
            [],
            (erro, resultado) => {

                if (erro) {

                    callback(erro, null);
                    return;
                }


                callback(
                    null,
                    resultado.total
                );
            }
        );
    }


    contarUnidadesEstoque(callback) {

        const sql = `
            SELECT
                COALESCE(SUM(quantidade), 0) AS total
            FROM produtos
        `;


        db.get(
            sql,
            [],
            (erro, resultado) => {

                if (erro) {

                    callback(erro, null);
                    return;
                }


                callback(
                    null,
                    resultado.total
                );
            }
        );
    }


    listarEstoqueBaixo(callback) {

        const sql = `
            SELECT
                id,
                nome,
                quantidade
            FROM produtos
            WHERE quantidade <= 10
            ORDER BY quantidade ASC
        `;


        db.all(
            sql,
            [],
            (erro, produtos) => {

                if (erro) {

                    callback(erro, null);
                    return;
                }


                callback(
                    null,
                    produtos
                );
            }
        );
    }


}


module.exports =
    new DashboardModel();