const DashboardModel =
    require("../models/DashboardModel");


class DashboardController {


    produtos(req, res) {

        DashboardModel.contarProdutos(
            (erro, total) => {

                if (erro) {

                    console.error(
                        "Erro ao contar produtos:",
                        erro.message
                    );

                    return res.status(500).json({
                        erro:
                            "Erro ao contar produtos."
                    });
                }


                res.json({
                    total: total
                });
            }
        );
    }


    fornecedores(req, res) {

        DashboardModel.contarFornecedores(
            (erro, total) => {

                if (erro) {

                    console.error(
                        "Erro ao contar fornecedores:",
                        erro.message
                    );

                    return res.status(500).json({
                        erro:
                            "Erro ao contar fornecedores."
                    });
                }


                res.json({
                    total: total
                });
            }
        );
    }


    relacionamentos(req, res) {

        DashboardModel.contarRelacionamentos(
            (erro, total) => {

                if (erro) {

                    console.error(
                        "Erro ao contar relacionamentos:",
                        erro.message
                    );

                    return res.status(500).json({
                        erro:
                            "Erro ao contar relacionamentos."
                    });
                }


                res.json({
                    total: total
                });
            }
        );
    }


    unidadesEstoque(req, res) {

        DashboardModel.contarUnidadesEstoque(
            (erro, total) => {

                if (erro) {

                    console.error(
                        "Erro ao contar unidades em estoque:",
                        erro.message
                    );

                    return res.status(500).json({
                        erro:
                            "Erro ao contar unidades em estoque."
                    });
                }


                res.json({
                    total: total
                });
            }
        );
    }


    estoqueBaixo(req, res) {

        DashboardModel.listarEstoqueBaixo(
            (erro, produtos) => {

                if (erro) {

                    console.error(
                        "Erro ao buscar produtos com estoque baixo:",
                        erro.message
                    );

                    return res.status(500).json({
                        erro:
                            "Erro ao buscar produtos com estoque baixo."
                    });
                }


                res.json(produtos);
            }
        );
    }


}


module.exports =
    new DashboardController();