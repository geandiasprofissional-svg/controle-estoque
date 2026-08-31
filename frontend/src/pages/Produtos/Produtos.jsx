import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../styles/Tabela.css";

function Produtos() {
    const [produtos, setProdutos] = useState([]);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [produtoEditando, setProdutoEditando] = useState(null);
    const [produtoEstoque, setProdutoEstoque] = useState(null);
    const [quantidadeMovimentacao, setQuantidadeMovimentacao] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [carregandoProdutos, setCarregandoProdutos] = useState(true);
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("");

    const [formulario, setFormulario] = useState({
        nome: "",
        codigo_barras: "",
        descricao: "",
        quantidade: "",
        categoria: "",
        validade: "",
        imagem: ""
    });

    function alterarFormulario(evento) {
        const { name, value } = evento.target;

        setFormulario({
            ...formulario,
            [name]: value
        });
    }

    function editarProduto(produto) {
        setProdutoEditando(produto);
        setProdutoEstoque(null);

        setFormulario({
            nome: produto.nome,
            codigo_barras: produto.codigo_barras || "",
            descricao: produto.descricao,
            quantidade: produto.quantidade,
            categoria: produto.categoria,
            validade: produto.validade || "",
            imagem: produto.imagem || ""
        });

        setMostrarFormulario(true);
        setMensagem("");
        setTipoMensagem("");
    }

    function abrirEstoque(produto) {
        setProdutoEstoque(produto);
        setQuantidadeMovimentacao("");

        setMostrarFormulario(false);
        setProdutoEditando(null);

        setMensagem("");
        setTipoMensagem("");
    }

    async function listarProdutos() {
        try {
            const resposta = await api.get("/produtos");

            setProdutos(resposta.data);

            return resposta.data;
        } catch (erro) {
            console.error("Erro ao buscar produtos:", erro);

            setMensagem("Erro ao carregar produtos.");
            setTipoMensagem("erro");

            return [];
        } finally {
            setCarregandoProdutos(false);
        }
    }

    async function excluirProduto(id) {
        const confirmar = window.confirm(
            "Tem certeza que deseja excluir este produto?"
        );

        if (!confirmar) {
            return;
        }

        try {
            setCarregando(true);
            setMensagem("");

            await api.delete(`/produtos/${id}`);

            setMensagem("Produto excluído com sucesso!");
            setTipoMensagem("sucesso");

            if (produtoEstoque && produtoEstoque.id === id) {
                setProdutoEstoque(null);
            }

            await listarProdutos();
        } catch (erro) {
            console.error("Erro ao excluir produto:", erro);

            setMensagem(
                erro.response?.data?.erro ||
                "Erro ao excluir produto."
            );

            setTipoMensagem("erro");
        } finally {
            setCarregando(false);
        }
    }

    async function cadastrarProduto() {
        if (!formulario.nome.trim()) {
            setMensagem("Informe o nome do produto.");
            setTipoMensagem("erro");
            return;
        }

        if (!formulario.descricao.trim()) {
            setMensagem("Informe a descrição do produto.");
            setTipoMensagem("erro");
            return;
        }

        if (!formulario.categoria.trim()) {
            setMensagem("Informe a categoria do produto.");
            setTipoMensagem("erro");
            return;
        }

        if (
            formulario.quantidade === "" ||
            Number(formulario.quantidade) < 0
        ) {
            setMensagem("Informe uma quantidade válida.");
            setTipoMensagem("erro");
            return;
        }

        try {
            setCarregando(true);
            setMensagem("");
            setTipoMensagem("");

            if (produtoEditando) {
                await api.put(
                    `/produtos/${produtoEditando.id}`,
                    formulario
                );

                setMensagem("Produto atualizado com sucesso!");
                setTipoMensagem("sucesso");
            } else {
                await api.post("/produtos", formulario);

                setMensagem("Produto cadastrado com sucesso!");
                setTipoMensagem("sucesso");
            }

            setFormulario({
                nome: "",
                codigo_barras: "",
                descricao: "",
                quantidade: "",
                categoria: "",
                validade: "",
                imagem: ""
            });

            setProdutoEditando(null);
            setMostrarFormulario(false);

            await listarProdutos();
        } catch (erro) {
            console.error("Erro ao salvar produto:", erro);

            if (erro.response?.status === 409) {
                setMensagem(erro.response.data.erro);
            } else {
                setMensagem(
                    erro.response?.data?.erro ||
                    "Erro ao salvar produto."
                );
            }

            setTipoMensagem("erro");
        } finally {
            setCarregando(false);
        }
    }

    async function movimentarEstoque(tipo) {
        if (!produtoEstoque) {
            return;
        }

        if (
            quantidadeMovimentacao === "" ||
            Number(quantidadeMovimentacao) <= 0
        ) {
            setMensagem(
                "Informe uma quantidade maior que zero."
            );

            setTipoMensagem("erro");
            return;
        }

        const quantidade = Number(quantidadeMovimentacao);

        if (!Number.isInteger(quantidade)) {
            setMensagem("Informe uma quantidade inteira.");
            setTipoMensagem("erro");
            return;
        }

        const valorMovimentacao =
            tipo === "ENTRADA"
                ? quantidade
                : -quantidade;

        try {
            setCarregando(true);
            setMensagem("");
            setTipoMensagem("");

            await api.patch(
                `/produtos/${produtoEstoque.id}/estoque`,
                {
                    quantidade: valorMovimentacao
                }
            );

            const produtosAtualizados = await listarProdutos();

            const produtoAtualizado = produtosAtualizados.find(
                (produto) => produto.id === produtoEstoque.id
            );

            if (produtoAtualizado) {
                setProdutoEstoque(produtoAtualizado);
            }

            setQuantidadeMovimentacao("");

            setMensagem(
                tipo === "ENTRADA"
                    ? "Entrada registrada com sucesso!"
                    : "Saída registrada com sucesso!"
            );

            setTipoMensagem("sucesso");
        } catch (erro) {
            console.error("Erro ao movimentar estoque:", erro);

            setMensagem(
                erro.response?.data?.erro ||
                "Erro ao movimentar estoque."
            );

            setTipoMensagem("erro");
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        let ignorar = false;

        async function carregarProdutos() {
            try {
                const resposta = await api.get("/produtos");

                if (ignorar) {
                    return;
                }

                setProdutos(resposta.data);
            } catch (erro) {
                console.error("Erro ao buscar produtos:", erro);

                if (!ignorar) {
                    setMensagem("Erro ao carregar produtos.");
                    setTipoMensagem("erro");
                }
            } finally {
                if (!ignorar) {
                    setCarregandoProdutos(false);
                }
            }
        }

        carregarProdutos();

        return () => {
            ignorar = true;
        };
    }, []);

    return (
        <div>
            <h1>Produtos</h1>

            {mensagem && (
                <div className={`mensagem ${tipoMensagem}`}>
                    {mensagem}
                </div>
            )}

            <button
                className="botaoNovo"
                onClick={() => {
                    setMostrarFormulario(!mostrarFormulario);
                    setProdutoEditando(null);
                    setProdutoEstoque(null);
                    setQuantidadeMovimentacao("");
                    setMensagem("");
                    setTipoMensagem("");
                }}
                disabled={carregando}
            >
                + Novo Produto
            </button>

            {mostrarFormulario && (
                <div className="formulario">
                    <h2>
                        {produtoEditando
                            ? "Editar Produto"
                            : "Novo Produto"}
                    </h2>

                    <input
                        type="text"
                        name="nome"
                        placeholder="Nome do produto"
                        value={formulario.nome}
                        onChange={alterarFormulario}
                        disabled={carregando}
                    />

                    <input
                        type="text"
                        name="codigo_barras"
                        placeholder="Código de barras"
                        value={formulario.codigo_barras}
                        onChange={alterarFormulario}
                        disabled={carregando}
                    />

                    <input
                        type="text"
                        name="descricao"
                        placeholder="Descrição"
                        value={formulario.descricao}
                        onChange={alterarFormulario}
                        disabled={carregando}
                    />

                    <input
                        type="number"
                        name="quantidade"
                        placeholder="Quantidade"
                        min="0"
                        value={formulario.quantidade}
                        onChange={alterarFormulario}
                        disabled={carregando}
                    />

                    <input
                        type="text"
                        name="categoria"
                        placeholder="Categoria"
                        value={formulario.categoria}
                        onChange={alterarFormulario}
                        disabled={carregando}
                    />

                    <input
                        type="date"
                        name="validade"
                        value={formulario.validade}
                        onChange={alterarFormulario}
                        disabled={carregando}
                    />

                    <input
                        type="text"
                        name="imagem"
                        placeholder="Imagem"
                        value={formulario.imagem}
                        onChange={alterarFormulario}
                        disabled={carregando}
                    />

                    <button
                        className="botaoSalvar"
                        onClick={cadastrarProduto}
                        disabled={carregando}
                    >
                        {carregando
                            ? "Salvando..."
                            : produtoEditando
                                ? "Salvar Alterações"
                                : "Salvar Produto"}
                    </button>
                </div>
            )}

            {produtoEstoque && (
    <div className="formulario painelEstoque">

        <h2>
            Controle de Estoque
        </h2>

        <div className="informacaoEstoque">

            <div className="produtoEstoque">
                <span>Produto</span>

                <strong>
                    {produtoEstoque.nome}
                </strong>
            </div>

            <div className="quantidadeEstoque">
                <span>Estoque atual</span>

                <strong>
                    {produtoEstoque.quantidade}
                </strong>

                <small>
                    unidades
                </small>
            </div>

        </div>

        <div className="campoMovimentacao">

            <label htmlFor="quantidadeMovimentacao">
                Quantidade da movimentação
            </label>

            <input
                id="quantidadeMovimentacao"
                type="number"
                min="1"
                step="1"
                placeholder="Digite a quantidade"
                value={
                    quantidadeMovimentacao
                }
                onChange={(evento) =>
                    setQuantidadeMovimentacao(
                        evento.target.value
                    )
                }
                disabled={carregando}
            />

        </div>

        <div className="acoesEstoque">

            <button
                className="botaoEntrada"
                onClick={() =>
                    movimentarEstoque(
                        "ENTRADA"
                    )
                }
                disabled={carregando}
            >
                {carregando
                    ? "Processando..."
                    : "Registrar Entrada"
                }
            </button>

            <button
                className="botaoSaida"
                onClick={() =>
                    movimentarEstoque(
                        "SAIDA"
                    )
                }
                disabled={carregando}
            >
                {carregando
                    ? "Processando..."
                    : "Registrar Saída"
                }
            </button>

        </div>

        <button
            className="botaoFechar"
            onClick={() => {
                setProdutoEstoque(null);
                setQuantidadeMovimentacao("");
            }}
            disabled={carregando}
        >
            Fechar
        </button>

    </div>
    )}

            {carregandoProdutos ? (
                <p className="carregando">
                    Carregando produtos...
                </p>
            ) : (
                <table className="tabela">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Categoria</th>
                            <th>Quantidade</th>
                            <th>Validade</th>
                            <th>Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {produtos.map((produto) => (
                            <tr key={produto.id}>
                                <td>{produto.nome}</td>

                                <td>{produto.categoria}</td>

                                <td>{produto.quantidade}</td>

                                <td>{produto.validade}</td>

                                <td className="acoesTabela">
                                    <button
                                        className="botaoEditar"
                                        onClick={() =>
                                            editarProduto(produto)
                                        }
                                        disabled={carregando}
                                    >
                                        Editar
                                    </button>

                                    <button
                                        className="botaoEstoque"
                                        onClick={() =>
                                            abrirEstoque(
                                                produto
                                            )
                                        }
                                        disabled={carregando}
                                    >
                                        Estoque
                                    </button>

                                    <button
                                        className="botaoExcluir"
                                        onClick={() =>
                                            excluirProduto(
                                                produto.id
                                            )
                                        }
                                        disabled={carregando}
                                    >
                                        {carregando
                                            ? "Aguarde..."
                                            : "Excluir"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Produtos;