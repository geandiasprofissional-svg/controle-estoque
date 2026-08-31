const db = require("../database/connection");


class MovimentacaoModel {


    listar(callback) {

        const sql = `
            SELECT
                m.id,
                m.produto_id,
                p.nome AS produto,
                m.tipo,
                m.quantidade,
                m.data_movimentacao
            FROM movimentacoes_estoque m
            INNER JOIN produtos p
                ON p.id = m.produto_id
            ORDER BY
                m.data_movimentacao DESC
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


}


module.exports =
    new MovimentacaoModel();