const express = require("express");

const router = express.Router();

const MovimentacaoController =
    require("../controllers/MovimentacaoController");


router.get(
    "/",
    MovimentacaoController.listar
);


module.exports = router;