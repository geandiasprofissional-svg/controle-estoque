const express = require("express");

const router = express.Router();

const ProdutoController =
    require("../controllers/ProdutoController");


router.post(
    "/",
    ProdutoController.criar
);


router.get(
    "/",
    ProdutoController.listar
);


router.get(
    "/movimentacoes",
    ProdutoController.listarMovimentacoes
);


router.put(
    "/:id",
    ProdutoController.atualizar
);


router.patch(
    "/:id/estoque",
    ProdutoController.movimentarEstoque
);


router.delete(
    "/:id",
    ProdutoController.excluir
);


module.exports = router;