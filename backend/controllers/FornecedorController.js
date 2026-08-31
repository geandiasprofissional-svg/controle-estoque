const FornecedorModel = require("../models/FornecedorModel");


function validarFornecedor(fornecedor) {

    if (
        !fornecedor.nome_empresa ||
        !fornecedor.cnpj ||
        !fornecedor.endereco ||
        !fornecedor.telefone ||
        !fornecedor.email ||
        !fornecedor.contato_principal
    ) {

        return {
            erro:
                "Preencha todos os campos obrigatórios."
        };
    }

    return null;
}


class FornecedorController {

    criar(req, res) {

        const fornecedor = req.body;

        const erroValidacao =
            validarFornecedor(fornecedor);


        if (erroValidacao) {

            return res.status(400).json(
                erroValidacao
            );
        }


        FornecedorModel.criar(
            fornecedor,
            (erro) => {

                if (erro) {

                    console.error(
                        "Erro ao cadastrar fornecedor:",
                        erro.message
                    );


                    if (
                        erro.message.includes(
                            "UNIQUE constraint failed: fornecedores.cnpj"
                        )
                    ) {

                        return res.status(409).json({
                            erro:
                                "Já existe um fornecedor cadastrado com este CNPJ."
                        });
                    }


                    return res.status(500).json({
                        erro:
                            "Erro ao cadastrar fornecedor."
                    });
                }


                res.status(201).json({
                    mensagem:
                        "Fornecedor cadastrado com sucesso!"
                });

            }
        );
    }


    listar(req, res) {

        FornecedorModel.listar(
            (erro, fornecedores) => {

                if (erro) {

                    return res.status(500).json({
                        erro:
                            "Erro ao listar fornecedores."
                    });
                }


                res.json(fornecedores);
            }
        );
    }


    atualizar(req, res) {

        const id = req.params.id;
        const fornecedor = req.body;

        const erroValidacao =
            validarFornecedor(fornecedor);


        if (erroValidacao) {

            return res.status(400).json(
                erroValidacao
            );
        }


        FornecedorModel.atualizar(
            id,
            fornecedor,
            (erro) => {

                if (erro) {

                    console.error(
                        "Erro ao atualizar fornecedor:",
                        erro.message
                    );


                    if (
                        erro.message.includes(
                            "UNIQUE constraint failed: fornecedores.cnpj"
                        )
                    ) {

                        return res.status(409).json({
                            erro:
                                "Já existe outro fornecedor cadastrado com este CNPJ."
                        });
                    }


                    return res.status(500).json({
                        erro:
                            "Erro ao atualizar fornecedor."
                    });
                }


                res.json({
                    mensagem:
                        "Fornecedor atualizado com sucesso!"
                });

            }
        );
    }


    excluir(req, res) {

        const id = req.params.id;


        FornecedorModel.excluir(
            id,
            (erro) => {

                if (erro) {

                    console.error(
                        "Erro ao excluir fornecedor:",
                        erro.message
                    );


                    return res.status(500).json({
                        erro:
                            "Erro ao excluir fornecedor."
                    });
                }


                res.json({
                    mensagem:
                        "Fornecedor excluído com sucesso!"
                });

            }
        );
    }

}


module.exports = new FornecedorController();