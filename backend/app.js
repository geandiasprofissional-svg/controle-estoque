const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

require("./database/createTables");

if (process.env.SEED_DEMO_DATA === "true") {
    const seedDatabase = require("./database/seed");
    seedDatabase();
}

const produtoRoutes = require("./routes/ProdutoRoutes");
const movimentacaoRoutes = require("./routes/MovimentacaoRoutes");
const fornecedorRoutes = require("./routes/FornecedorRoutes");
const produtoFornecedorRoutes = require("./routes/ProdutoFornecedorRoutes");
const dashboardRoutes = require("./routes/DashboardRoutes");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use("/produtos", produtoRoutes);
app.use("/movimentacoes", movimentacaoRoutes);
app.use("/fornecedores", fornecedorRoutes);
app.use("/produto-fornecedor", produtoFornecedorRoutes);
app.use("/dashboard", dashboardRoutes);

const frontendPath = path.join(__dirname, "..", "frontend", "dist");

if (fs.existsSync(frontendPath)) {
    app.use(express.static(frontendPath));

    app.get("*", (req, res) => {
        res.sendFile(path.join(frontendPath, "index.html"));
    });
} else {
    app.get("/", (req, res) => {
        res.send("Servidor funcionando!");
    });
}

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});