const ProdutoModel = require("../models/ProdutoModel");


function validarProduto(produto) {

    if (
        !produto.nome ||
        !produto.descricao ||
        !produto.categoria ||
        produto.quantidade === undefined ||
        produto.quantidade === null ||
        produto.quantidade === ""
    ) {

        return {
            erro: "Preencha todos os campos obrigatórios."
        };
    }


    const quantidade = Number(
        produto.quantidade
    );


    if (!Number.isFinite(quantidade)) {

        return {
            erro: "A quantidade deve ser um número válido."
        };
    }


    if (quantidade < 0) {

        return {
            erro: "A quantidade não pode ser negativa."
        };
    }


    produto.quantidade = quantidade;

    return null;
}


class ProdutoController {

    criar(req, res) {

        const produto = req.body;

        const erroValidacao =
            validarProduto(produto);


        if (erroValidacao) {

            return res.status(400).json(
                erroValidacao
            );
        }


        ProdutoModel.criar(
            produto,
            (erro) => {

                if (erro) {

                    console.error(
                        "Erro ao cadastrar produto:",
                        erro.message
                    );


                    if (
                        erro.message.includes(
                            "UNIQUE constraint failed: produtos.codigo_barras"
                        )
                    ) {

                        return res.status(409).json({
                            erro:
                                "Este código de barras já está cadastrado."
                        });
                    }


                    return res.status(500).json({
                        erro:
                            "Erro ao cadastrar produto."
                    });
                }


                res.status(201).json({
                    mensagem:
                        "Produto cadastrado com sucesso!"
                });

            }
        );
    }


    listar(req, res) {

        ProdutoModel.listar(
            (erro, produtos) => {

                if (erro) {

                    return res.status(500).json({
                        erro:
                            "Erro ao listar produtos."
                    });
                }


                res.json(produtos);
            }
        );
    }


    atualizar(req, res) {

        const id = req.params.id;
        const produto = req.body;

        const erroValidacao =
            validarProduto(produto);


        if (erroValidacao) {

            return res.status(400).json(
                erroValidacao
            );
        }


        ProdutoModel.atualizar(
            id,
            produto,
            (erro) => {

                if (erro) {

                    console.error(
                        "Erro ao atualizar produto:",
                        erro.message
                    );


                    if (
                        erro.message.includes(
                            "UNIQUE constraint failed: produtos.codigo_barras"
                        )
                    ) {

                        return res.status(409).json({
                            erro:
                                "Este código de barras já está cadastrado."
                        });
                    }


                    if (
                        erro.codigo ===
                        "PRODUTO_NAO_ENCONTRADO"
                    ) {

                        return res.status(404).json({
                            erro:
                                "Produto não encontrado."
                        });
                    }


                    return res.status(500).json({
                        erro:
                            "Erro ao atualizar produto."
                    });
                }


                res.json({
                    mensagem:
                        "Produto atualizado com sucesso!"
                });

            }
        );
    }


    movimentarEstoque(req, res) {

        const id = req.params.id;

        const { quantidade } = req.body;


        if (
            quantidade === undefined ||
            quantidade === null ||
            quantidade === "" ||
            Number(quantidade) === 0
        ) {

            return res.status(400).json({
                erro:
                    "Informe uma quantidade válida."
            });
        }


        const quantidadeNumerica =
            Number(quantidade);


        if (
            !Number.isFinite(
                quantidadeNumerica
            )
        ) {

            return res.status(400).json({
                erro:
                    "Informe uma quantidade válida."
            });
        }


        ProdutoModel.movimentarEstoque(
            id,
            quantidadeNumerica,
            (erro) => {

                if (erro) {

                    console.error(
                        "Erro ao movimentar estoque:",
                        erro.message
                    );


                    if (
                        erro.codigo ===
                        "ESTOQUE_INSUFICIENTE"
                    ) {

                        return res.status(400).json({
                            erro:
                                erro.message
                        });
                    }


                    return res.status(500).json({
                        erro:
                            "Erro ao movimentar estoque."
                    });
                }


                res.json({
                    mensagem:
                        "Estoque atualizado com sucesso!"
                });

            }
        );
    }


    listarMovimentacoes(req, res) {

        ProdutoModel.listarMovimentacoes(
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


                res.json(
                    movimentacoes
                );
            }
        );
    }


    excluir(req, res) {

        const id = req.params.id;


        ProdutoModel.excluir(
            id,
            (erro) => {

                if (erro) {

                    console.error(
                        "Erro ao excluir produto:",
                        erro.message
                    );


                    if (
                        erro.codigo ===
                        "PRODUTO_NAO_ENCONTRADO"
                    ) {

                        return res.status(404).json({
                            erro:
                                "Produto não encontrado."
                        });
                    }


                    return res.status(500).json({
                        erro:
                            "Erro ao excluir produto."
                    });
                }


                res.json({
                    mensagem:
                        "Produto excluído com sucesso!"
                });

            }
        );
    }

}


module.exports = new ProdutoController();