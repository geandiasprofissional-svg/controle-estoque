const express = require("express");
const cors = require("cors");

require("./database/createTables");

const seedDatabase = require("./database/seed");
seedDatabase();

const produtoRoutes = require("./routes/ProdutoRoutes");
const movimentacaoRoutes = require("./routes/MovimentacaoRoutes");
const fornecedorRoutes = require("./routes/FornecedorRoutes");
const produtoFornecedorRoutes = require("./routes/ProdutoFornecedorRoutes");
const dashboardRoutes = require("./routes/DashboardRoutes");

const app = express();

app.use(cors());

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Servidor funcionando!");
});

app.use("/produtos", produtoRoutes);
app.use("/movimentacoes", movimentacaoRoutes);
app.use("/fornecedores", fornecedorRoutes);
app.use("/produto-fornecedor", produtoFornecedorRoutes);
app.use("/dashboard", dashboardRoutes);

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});