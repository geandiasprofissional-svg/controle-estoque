const ProdutoFornecedorModel = require("../models/ProdutoFornecedorModel");


function validarRelacionamento(
    produto_id,
    fornecedor_id
) {

    if (
        produto_id === undefined ||
        produto_id === null ||
        fornecedor_id === undefined ||
        fornecedor_id === null
    ) {

        return {
            erro:
                "Informe o produto e o fornecedor."
        };
    }

    return null;
}


class ProdutoFornecedorController {

    associar(req, res) {

        const {
            produto_id,
            fornecedor_id
        } = req.body;


        const erroValidacao =
            validarRelacionamento(
                produto_id,
                fornecedor_id
            );


        if (erroValidacao) {

            return res.status(400).json(
                erroValidacao
            );
        }


        ProdutoFornecedorModel.associar(
            produto_id,
            fornecedor_id,
            (erro) => {

                if (erro) {

                    console.error(
                        "Erro ao associar relacionamento:",
                        erro.message
                    );


                    if (
                        erro.message.includes(
                            "UNIQUE constraint failed"
                        )
                    ) {

                        return res.status(409).json({
                            erro:
                                "Este produto já está associado a este fornecedor."
                        });
                    }


                    if (
                        erro.message.includes(
                            "FOREIGN KEY constraint failed"
                        )
                    ) {

                        return res.status(404).json({
                            erro:
                                "Produto ou fornecedor não encontrado."
                        });
                    }


                    return res.status(500).json({
                        erro:
                            "Erro ao associar produto e fornecedor."
                    });
                }


                res.status(201).json({
                    mensagem:
                        "Produto associado ao fornecedor com sucesso!"
                });
            }
        );
    }


    listar(req, res) {

        ProdutoFornecedorModel.listar(
            (erro, relacionamentos) => {

                if (erro) {

                    console.error(
                        "Erro ao listar relacionamentos:",
                        erro.message
                    );


                    return res.status(500).json({
                        erro:
                            "Erro ao listar relacionamentos."
                    });
                }


                res.json(relacionamentos);
            }
        );
    }


    atualizar(req, res) {

        const id = req.params.id;


        const {
            produto_id,
            fornecedor_id
        } = req.body;


        const erroValidacao =
            validarRelacionamento(
                produto_id,
                fornecedor_id
            );


        if (erroValidacao) {

            return res.status(400).json(
                erroValidacao
            );
        }


        ProdutoFornecedorModel.atualizar(
            id,
            produto_id,
            fornecedor_id,
            (erro) => {

                if (erro) {

                    console.error(
                        "Erro ao atualizar relacionamento:",
                        erro.message
                    );


                    if (
                        erro.codigo ===
                        "RELACIONAMENTO_NAO_ENCONTRADO"
                    ) {

                        return res.status(404).json({
                            erro:
                                "Relacionamento não encontrado."
                        });
                    }


                    if (
                        erro.message.includes(
                            "UNIQUE constraint failed"
                        )
                    ) {

                        return res.status(409).json({
                            erro:
                                "Este produto já está associado a este fornecedor."
                        });
                    }


                    if (
                        erro.message.includes(
                            "FOREIGN KEY constraint failed"
                        )
                    ) {

                        return res.status(404).json({
                            erro:
                                "Produto ou fornecedor não encontrado."
                        });
                    }


                    return res.status(500).json({
                        erro:
                            "Erro ao atualizar relacionamento."
                    });
                }


                res.json({
                    mensagem:
                        "Relacionamento atualizado com sucesso!"
                });
            }
        );
    }


    excluir(req, res) {

        const id = req.params.id;


        ProdutoFornecedorModel.excluir(
            id,
            (erro) => {

                if (erro) {

                    console.error(
                        "Erro ao excluir relacionamento:",
                        erro.message
                    );


                    if (
                        erro.codigo ===
                        "RELACIONAMENTO_NAO_ENCONTRADO"
                    ) {

                        return res.status(404).json({
                            erro:
                                "Relacionamento não encontrado."
                        });
                    }


                    return res.status(500).json({
                        erro:
                            "Erro ao excluir relacionamento."
                    });
                }


                res.json({
                    mensagem:
                        "Relacionamento excluído com sucesso!"
                });
            }
        );
    }

}


module.exports =
    new ProdutoFornecedorController();