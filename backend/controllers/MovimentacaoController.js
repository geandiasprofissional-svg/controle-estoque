const MovimentacaoModel =
    require("../models/MovimentacaoModel");


class MovimentacaoController {


    listar(req, res) {

        MovimentacaoModel.listar(
            (erro, movimentacoes) => {

                if (erro) {

                    console.error(
                        "Erro ao listar movimentações:",
                        erro.message
                    );

                    return res.status(500).json({
                        erro:
                            "Erro ao listar movimentações."
                    });

                }

                res.json(movimentacoes);

            }
        );

    }


}


module.exports =
    new MovimentacaoController();