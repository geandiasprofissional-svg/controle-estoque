import { useEffect, useState } from "react";
import api from "../../services/api";
import "./Dashboard.css";

function Dashboard() {

    const [totalProdutos, setTotalProdutos] = useState(0);

    const [totalFornecedores, setTotalFornecedores] = useState(0);

    const [totalRelacionamentos, setTotalRelacionamentos] = useState(0);

    const [produtosEstoqueBaixo, setProdutosEstoqueBaixo] = useState([]);


    useEffect(() => {

        let ignorar = false;


        async function carregarDashboard() {

            try {

                const [
                    respostaProdutos,
                    respostaFornecedores,
                    respostaRelacionamentos,
                    respostaEstoqueBaixo
                ] = await Promise.all([

                    api.get("/dashboard/produtos"),

                    api.get("/dashboard/fornecedores"),

                    api.get("/dashboard/relacionamentos"),

                    api.get("/dashboard/estoque-baixo")

                ]);


                if (ignorar) {
                    return;
                }


                setTotalProdutos(
                    respostaProdutos.data.total
                );


                setTotalFornecedores(
                    respostaFornecedores.data.total
                );


                setTotalRelacionamentos(
                    respostaRelacionamentos.data.total
                );


                setProdutosEstoqueBaixo(
                    respostaEstoqueBaixo.data
                );


            } catch (erro) {

                console.error(
                    "Erro ao carregar Dashboard:",
                    erro
                );

            }

        }


        carregarDashboard();


        return () => {

            ignorar = true;

        };

    }, []);


    return (

        <div className="dashboard">

            <h1>Dashboard</h1>

            <p className="dashboard-subtitulo">
                Visão geral do controle de estoque
            </p>


            <div className="dashboard-cards">


                <div className="dashboard-card">

                    <div className="dashboard-card-icone">
                        📦
                    </div>

                    <div>

                        <h2>Produtos cadastrados</h2>

                        <p>
                            {totalProdutos}
                        </p>

                    </div>

                </div>


                <div className="dashboard-card">

                    <div className="dashboard-card-icone">
                        🚚
                    </div>

                    <div>

                        <h2>Fornecedores cadastrados</h2>

                        <p>
                            {totalFornecedores}
                        </p>

                    </div>

                </div>


                <div className="dashboard-card">

                    <div className="dashboard-card-icone">
                        🔗
                    </div>

                    <div>

                        <h2>Relacionamentos</h2>

                        <p>
                            {totalRelacionamentos}
                        </p>

                    </div>

                </div>


            </div>


            <div className="estoque-baixo">

                <h2>⚠️ Estoque baixo</h2>


                {produtosEstoqueBaixo.length === 0 ? (

                    <p>
                        Nenhum produto com estoque baixo.
                    </p>

                ) : (

                    <ul>

                        {produtosEstoqueBaixo.map((produto) => (

                            <li key={produto.id}>

                                <span>
                                    {produto.nome}
                                </span>

                                <strong>
                                    {produto.quantidade} unidades
                                </strong>

                            </li>

                        ))}

                    </ul>

                )}

            </div>


        </div>

    );

}

export default Dashboard;