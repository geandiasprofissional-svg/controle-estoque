import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Dashboard from "../pages/Dashboard/Dashboard";
import Produtos from "../pages/Produtos/Produtos";
import Fornecedores from "../pages/Fornecedores/Fornecedores";
import Relacionamentos from "../pages/Relacionamentos/Relacionamentos";
import Movimentacoes from "../pages/Movimentacoes/Movimentacoes";

function AppRoutes() {

    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={
                        <MainLayout>
                            <Dashboard />
                        </MainLayout>
                    }
                />

                <Route
                    path="/produtos"
                    element={
                        <MainLayout>
                            <Produtos />
                        </MainLayout>
                    }
                />

                <Route
                    path="/fornecedores"
                    element={
                        <MainLayout>
                            <Fornecedores />
                        </MainLayout>
                    }
                />

                <Route
                    path="/relacionamentos"
                    element={
                        <MainLayout>
                            <Relacionamentos />
                        </MainLayout>
                    }
                />

                <Route
                    path="/movimentacoes"
                    element={
                        <MainLayout>
                            <Movimentacoes />
                        </MainLayout>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default AppRoutes;