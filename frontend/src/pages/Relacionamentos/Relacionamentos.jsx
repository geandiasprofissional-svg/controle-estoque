import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../styles/Tabela.css";

function Relacionamentos() {

    const [relacionamentos, setRelacionamentos] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [fornecedores, setFornecedores] = useState([]);
    const [produtoSelecionado, setProdutoSelecionado] = useState("");
    const [fornecedorSelecionado, setFornecedorSelecionado] = useState("");
    const [relacionamentoEditando, setRelacionamentoEditando] = useState(null);
    const [carregando, setCarregando] = useState(false);
    const [carregandoRelacionamentos, setCarregandoRelacionamentos] = useState(true);
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("");


    async function buscarDados() {

        const [
            respostaRelacionamentos,
            respostaProdutos,
            respostaFornecedores
        ] = await Promise.all([

            api.get("/produto-fornecedor"),
            api.get("/produtos"),
            api.get("/fornecedores")

        ]);

        return {
            relacionamentos: respostaRelacionamentos.data,
            produtos: respostaProdutos.data,
            fornecedores: respostaFornecedores.data
        };
    }


    async function carregarDados() {

        try {

            const dados = await buscarDados();

            setRelacionamentos(
                dados.relacionamentos
            );

            setProdutos(
                dados.produtos
            );

            setFornecedores(
                dados.fornecedores
            );

        } catch (erro) {

            console.error(
                "Erro ao carregar relacionamentos:",
                erro
            );

            setMensagem(
                "Erro ao carregar os dados."
            );

            setTipoMensagem("erro");

        } finally {

            setCarregandoRelacionamentos(false);

        }
    }


    function editarRelacionamento(relacionamento) {

        setRelacionamentoEditando(
            relacionamento
        );

        setProdutoSelecionado(
            String(relacionamento.produto_id)
        );

        setFornecedorSelecionado(
            String(relacionamento.fornecedor_id)
        );

        setMensagem("");
        setTipoMensagem("");
    }


    function cancelarEdicao() {

        setRelacionamentoEditando(null);
        setProdutoSelecionado("");
        setFornecedorSelecionado("");
        setMensagem("");
        setTipoMensagem("");
    }


    async function salvarRelacionamento() {

        if (
            !produtoSelecionado ||
            !fornecedorSelecionado
        ) {

            setMensagem(
                "Selecione um produto e um fornecedor."
            );

            setTipoMensagem("erro");

            return;
        }


        const produtoId = Number(
            produtoSelecionado
        );

        const fornecedorId = Number(
            fornecedorSelecionado
        );


        const relacionamentoJaExiste =
            relacionamentos.some(
                (relacionamento) => {

                    if (
                        relacionamentoEditando &&
                        relacionamento.id ===
                            relacionamentoEditando.id
                    ) {

                        return false;
                    }


                    return (
                        relacionamento.produto_id ===
                            produtoId &&
                        relacionamento.fornecedor_id ===
                            fornecedorId
                    );
                }
            );


        if (relacionamentoJaExiste) {

            setMensagem(
                "Este produto já está associado a este fornecedor."
            );

            setTipoMensagem("erro");

            return;
        }


        try {

            setCarregando(true);
            setMensagem("");
            setTipoMensagem("");


            if (relacionamentoEditando) {

                await api.put(
                    `/produto-fornecedor/${relacionamentoEditando.id}`,
                    {
                        produto_id: produtoId,
                        fornecedor_id: fornecedorId
                    }
                );


                setMensagem(
                    "Relacionamento atualizado com sucesso!"
                );

            } else {

                await api.post(
                    "/produto-fornecedor",
                    {
                        produto_id: produtoId,
                        fornecedor_id: fornecedorId
                    }
                );


                setMensagem(
                    "Produto associado ao fornecedor com sucesso!"
                );
            }


            setTipoMensagem("sucesso");

            setRelacionamentoEditando(null);
            setProdutoSelecionado("");
            setFornecedorSelecionado("");


            await carregarDados();

        } catch (erro) {

            console.error(
                "Erro ao salvar relacionamento:",
                erro
            );


            if (
                erro.response?.status === 409
            ) {

                setMensagem(
                    "Este produto já está associado a este fornecedor."
                );

            } else {

                setMensagem(
                    "Erro ao salvar relacionamento."
                );
            }


            setTipoMensagem("erro");

        } finally {

            setCarregando(false);

        }
    }


    async function excluirRelacionamento(id) {

        const confirmar = window.confirm(
            "Tem certeza que deseja excluir este relacionamento?"
        );


        if (!confirmar) {
            return;
        }


        try {

            setCarregando(true);
            setMensagem("");


            await api.delete(
                `/produto-fornecedor/${id}`
            );


            setMensagem(
                "Relacionamento excluído com sucesso!"
            );

            setTipoMensagem("sucesso");


            await carregarDados();

        } catch (erro) {

            console.error(
                "Erro ao excluir relacionamento:",
                erro
            );


            setMensagem(
                "Erro ao excluir relacionamento."
            );

            setTipoMensagem("erro");

        } finally {

            setCarregando(false);

        }
    }


    useEffect(() => {

        let ignorar = false;


        async function iniciar() {

            try {

                const dados = await buscarDados();


                if (ignorar) {
                    return;
                }


                setRelacionamentos(
                    dados.relacionamentos
                );

                setProdutos(
                    dados.produtos
                );

                setFornecedores(
                    dados.fornecedores
                );

            } catch (erro) {

                console.error(
                    "Erro ao carregar relacionamentos:",
                    erro
                );


                if (!ignorar) {

                    setMensagem(
                        "Erro ao carregar os dados."
                    );

                    setTipoMensagem("erro");
                }

            } finally {

                if (!ignorar) {

                    setCarregandoRelacionamentos(
                        false
                    );
                }
            }
        }


        iniciar();


        return () => {

            ignorar = true;

        };

    }, []);


    return (

        <div>

            <h1>Relacionamentos</h1>


            {mensagem && (

                <div
                    className={`mensagem ${tipoMensagem}`}
                >
                    {mensagem}
                </div>

            )}


            <div className="formulario">

                <h2>

                    {relacionamentoEditando
                        ? "Editar Relacionamento"
                        : "Associar Produto a Fornecedor"
                    }

                </h2>


                <select
                    value={produtoSelecionado}
                    onChange={(evento) =>
                        setProdutoSelecionado(
                            evento.target.value
                        )
                    }
                    disabled={carregando}
                >

                    <option value="">
                        Selecione um produto
                    </option>


                    {produtos.map((produto) => (

                        <option
                            key={produto.id}
                            value={produto.id}
                        >
                            {produto.nome}
                        </option>

                    ))}

                </select>


                <select
                    value={fornecedorSelecionado}
                    onChange={(evento) =>
                        setFornecedorSelecionado(
                            evento.target.value
                        )
                    }
                    disabled={carregando}
                >

                    <option value="">
                        Selecione um fornecedor
                    </option>


                    {fornecedores.map(
                        (fornecedor) => (

                            <option
                                key={fornecedor.id}
                                value={fornecedor.id}
                            >
                                {fornecedor.nome_empresa}
                            </option>

                        )
                    )}

                </select>


                <button
                    className="botaoSalvar"
                    onClick={salvarRelacionamento}
                    disabled={carregando}
                >

                    {carregando
                        ? "Salvando..."
                        : relacionamentoEditando
                            ? "Salvar Alterações"
                            : "Associar"
                    }

                </button>


                {relacionamentoEditando && (

                    <button
                        className="botaoCancelar"
                        onClick={cancelarEdicao}
                        disabled={carregando}
                    >
                        Cancelar
                    </button>

                )}

            </div>


            {carregandoRelacionamentos ? (

                <p className="carregando">
                    Carregando relacionamentos...
                </p>

            ) : (

                <table className="tabela">

                    <thead>

                        <tr>

                            <th>Produto</th>

                            <th>Fornecedor</th>

                            <th>Ações</th>

                        </tr>

                    </thead>


                    <tbody>

                        {relacionamentos.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="3"
                                    className="tabelaVazia"
                                >
                                    Nenhum relacionamento
                                    cadastrado.
                                </td>

                            </tr>

                        ) : (

                            relacionamentos.map(
                                (relacionamento) => (

                                    <tr
                                        key={
                                            relacionamento.id
                                        }
                                    >

                                        <td>

                                            {relacionamento.produto}

                                        </td>


                                        <td>

                                            {relacionamento.fornecedor}

                                        </td>


                                        <td>

                                            <button
                                                onClick={() =>
                                                    editarRelacionamento(
                                                        relacionamento
                                                    )
                                                }
                                                disabled={
                                                    carregando
                                                }
                                            >
                                                Editar
                                            </button>


                                            <button
                                                onClick={() =>
                                                    excluirRelacionamento(
                                                        relacionamento.id
                                                    )
                                                }
                                                disabled={
                                                    carregando
                                                }
                                            >

                                                {carregando
                                                    ? "Aguarde..."
                                                    : "Excluir"
                                                }

                                            </button>

                                        </td>

                                    </tr>

                                )
                            )

                        )}

                    </tbody>

                </table>

            )}

        </div>

    );
}


export default Relacionamentos;