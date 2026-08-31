const express = require("express");

const router = express.Router();

const FornecedorController =
    require("../controllers/FornecedorController");


router.post(
    "/",
    FornecedorController.criar
);


router.get(
    "/",
    FornecedorController.listar
);


router.put(
    "/:id",
    FornecedorController.atualizar
);


router.delete(
    "/:id",
    FornecedorController.excluir
);


module.exports = router;