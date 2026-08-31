import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../styles/Tabela.css";

function Fornecedores() {

    const [fornecedores, setFornecedores] = useState([]);

    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const [fornecedorEditando, setFornecedorEditando] = useState(null);

    const [carregando, setCarregando] = useState(false);

    const [carregandoFornecedores, setCarregandoFornecedores] = useState(true);

    const [mensagem, setMensagem] = useState("");

    const [tipoMensagem, setTipoMensagem] = useState("");

    const [formulario, setFormulario] = useState({
        nome_empresa: "",
        cnpj: "",
        endereco: "",
        telefone: "",
        email: "",
        contato_principal: ""
    });


    function alterarFormulario(evento) {

        const { name, value } = evento.target;

        setFormulario({
            ...formulario,
            [name]: value
        });

    }


    function limparFormulario() {

        setFormulario({
            nome_empresa: "",
            cnpj: "",
            endereco: "",
            telefone: "",
            email: "",
            contato_principal: ""
        });

        setFornecedorEditando(null);

    }


    function editarFornecedor(fornecedor) {

        setFornecedorEditando(fornecedor);

        setFormulario({
            nome_empresa: fornecedor.nome_empresa,
            cnpj: fornecedor.cnpj || "",
            endereco: fornecedor.endereco || "",
            telefone: fornecedor.telefone || "",
            email: fornecedor.email || "",
            contato_principal: fornecedor.contato_principal || ""
        });

        setMostrarFormulario(true);

        setMensagem("");

        setTipoMensagem("");

    }


    async function listarFornecedores() {

        try {

            const resposta = await api.get("/fornecedores");

            setFornecedores(resposta.data);

        } catch (erro) {

            console.error(
                "Erro ao buscar fornecedores:",
                erro
            );

            setMensagem(
                "Erro ao carregar fornecedores."
            );

            setTipoMensagem("erro");

        } finally {

            setCarregandoFornecedores(false);

        }

    }


    async function excluirFornecedor(id) {

        const confirmar = window.confirm(
            "Tem certeza que deseja excluir este fornecedor?"
        );

        if (!confirmar) {
            return;
        }


        try {

            setCarregando(true);

            setMensagem("");

            await api.delete(`/fornecedores/${id}`);

            setMensagem(
                "Fornecedor excluído com sucesso!"
            );

            setTipoMensagem("sucesso");

            await listarFornecedores();

        } catch (erro) {

            console.error(
                "Erro ao excluir fornecedor:",
                erro
            );

            setMensagem(
                erro.response?.data?.erro ||
                "Erro ao excluir fornecedor."
            );

            setTipoMensagem("erro");

        } finally {

            setCarregando(false);

        }

    }


    async function cadastrarFornecedor() {

        if (!formulario.nome_empresa.trim()) {

            setMensagem(
                "Informe o nome da empresa."
            );

            setTipoMensagem("erro");

            return;

        }


        if (!formulario.cnpj.trim()) {

            setMensagem(
                "Informe o CNPJ."
            );

            setTipoMensagem("erro");

            return;

        }


        if (!formulario.endereco.trim()) {

            setMensagem(
                "Informe o endereço."
            );

            setTipoMensagem("erro");

            return;

        }


        if (!formulario.telefone.trim()) {

            setMensagem(
                "Informe o telefone."
            );

            setTipoMensagem("erro");

            return;

        }


        if (!formulario.email.trim()) {

            setMensagem(
                "Informe o email."
            );

            setTipoMensagem("erro");

            return;

        }


        if (!formulario.contato_principal.trim()) {

            setMensagem(
                "Informe o contato principal."
            );

            setTipoMensagem("erro");

            return;

        }


        try {

            setCarregando(true);

            setMensagem("");

            setTipoMensagem("");


            if (fornecedorEditando) {

                await api.put(
                    `/fornecedores/${fornecedorEditando.id}`,
                    formulario
                );

                setMensagem(
                    "Fornecedor atualizado com sucesso!"
                );

            } else {

                await api.post(
                    "/fornecedores",
                    formulario
                );

                setMensagem(
                    "Fornecedor cadastrado com sucesso!"
                );

            }


            setTipoMensagem("sucesso");

            limparFormulario();

            setMostrarFormulario(false);

            await listarFornecedores();

        } catch (erro) {

            console.error(
                "Erro ao salvar fornecedor:",
                erro
            );

            setMensagem(
                erro.response?.data?.erro ||
                "Erro ao salvar fornecedor."
            );

            setTipoMensagem("erro");

        } finally {

            setCarregando(false);

        }

    }


    function abrirNovoFornecedor() {

        limparFormulario();

        setMensagem("");

        setTipoMensagem("");

        setMostrarFormulario(
            !mostrarFormulario
        );

    }


    useEffect(() => {

        let ignorar = false;


        async function carregarFornecedores() {

            try {

                const resposta = await api.get(
                    "/fornecedores"
                );


                if (ignorar) {
                    return;
                }


                setFornecedores(
                    resposta.data
                );

            } catch (erro) {

                console.error(
                    "Erro ao buscar fornecedores:",
                    erro
                );


                if (!ignorar) {

                    setMensagem(
                        "Erro ao carregar fornecedores."
                    );

                    setTipoMensagem("erro");

                }

            } finally {

                if (!ignorar) {

                    setCarregandoFornecedores(
                        false
                    );

                }

            }

        }


        carregarFornecedores();


        return () => {

            ignorar = true;

        };

    }, []);


    return (

        <div>

            <h1>Fornecedores</h1>


            {mensagem && (

                <div
                    className={`mensagem ${tipoMensagem}`}
                >
                    {mensagem}
                </div>

            )}


            <button
                className="botaoNovo"
                onClick={abrirNovoFornecedor}
                disabled={carregando}
            >
                + Novo Fornecedor
            </button>


            {mostrarFormulario && (

                <div className="formulario">

                    <h2>
                        {fornecedorEditando
                            ? "Editar Fornecedor"
                            : "Novo Fornecedor"
                        }
                    </h2>


                    <input
                        type="text"
                        name="nome_empresa"
                        placeholder="Nome da empresa"
                        value={formulario.nome_empresa}
                        onChange={alterarFormulario}
                        disabled={carregando}
                    />


                    <input
                        type="text"
                        name="cnpj"
                        placeholder="CNPJ"
                        value={formulario.cnpj}
                        onChange={alterarFormulario}
                        disabled={carregando}
                    />


                    <input
                        type="text"
                        name="endereco"
                        placeholder="Endereço"
                        value={formulario.endereco}
                        onChange={alterarFormulario}
                        disabled={carregando}
                    />


                    <input
                        type="text"
                        name="telefone"
                        placeholder="Telefone"
                        value={formulario.telefone}
                        onChange={alterarFormulario}
                        disabled={carregando}
                    />


                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formulario.email}
                        onChange={alterarFormulario}
                        disabled={carregando}
                    />


                    <input
                        type="text"
                        name="contato_principal"
                        placeholder="Contato principal"
                        value={formulario.contato_principal}
                        onChange={alterarFormulario}
                        disabled={carregando}
                    />


                    <button
                        className="botaoSalvar"
                        onClick={cadastrarFornecedor}
                        disabled={carregando}
                    >
                        {carregando
                            ? "Salvando..."
                            : fornecedorEditando
                                ? "Salvar Alterações"
                                : "Cadastrar Fornecedor"
                        }
                    </button>


                    {fornecedorEditando && (

                        <button
                            onClick={() => {
                                limparFormulario();
                                setMostrarFormulario(false);
                            }}
                            disabled={carregando}
                        >
                            Cancelar
                        </button>

                    )}

                </div>

            )}


            {carregandoFornecedores ? (

                <p className="carregando">
                    Carregando fornecedores...
                </p>

            ) : (

                <table className="tabela">

                    <thead>

                        <tr>

                            <th>Empresa</th>

                            <th>CNPJ</th>

                            <th>Telefone</th>

                            <th>Email</th>

                            <th>Contato</th>

                            <th>Ações</th>

                        </tr>

                    </thead>


                    <tbody>

                        {fornecedores.map(
                            (fornecedor) => (

                                <tr
                                    key={fornecedor.id}
                                >

                                    <td>
                                        {fornecedor.nome_empresa}
                                    </td>

                                    <td>
                                        {fornecedor.cnpj}
                                    </td>

                                    <td>
                                        {fornecedor.telefone}
                                    </td>

                                    <td>
                                        {fornecedor.email}
                                    </td>

                                    <td>
                                        {fornecedor.contato_principal}
                                    </td>

                                    <td>

                                        <button
                                            onClick={() =>
                                                editarFornecedor(
                                                    fornecedor
                                                )
                                            }
                                            disabled={carregando}
                                        >
                                            Editar
                                        </button>


                                        <button
                                            onClick={() =>
                                                excluirFornecedor(
                                                    fornecedor.id
                                                )
                                            }
                                            disabled={carregando}
                                        >
                                            {carregando
                                                ? "Aguarde..."
                                                : "Excluir"
                                            }
                                        </button>

                                    </td>

                                </tr>

                            )
                        )}

                    </tbody>

                </table>

            )}

        </div>

    );

}


export default Fornecedores;