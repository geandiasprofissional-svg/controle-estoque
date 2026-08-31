const express = require("express");

const router = express.Router();

const ProdutoFornecedorController =
    require("../controllers/ProdutoFornecedorController");


router.post(
    "/",
    ProdutoFornecedorController.associar
);


router.get(
    "/",
    ProdutoFornecedorController.listar
);


router.put(
    "/:id",
    ProdutoFornecedorController.atualizar
);


router.delete(
    "/:id",
    ProdutoFornecedorController.excluir
);


module.exports = router;