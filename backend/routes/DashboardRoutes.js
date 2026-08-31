const express = require("express");

const router = express.Router();

const DashboardController =
    require("../controllers/DashboardController");


router.get(
    "/produtos",
    DashboardController.produtos
);


router.get(
    "/fornecedores",
    DashboardController.fornecedores
);


router.get(
    "/relacionamentos",
    DashboardController.relacionamentos
);


router.get(
    "/unidades-estoque",
    DashboardController.unidadesEstoque
);


router.get(
    "/estoque-baixo",
    DashboardController.estoqueBaixo
);


module.exports = router;