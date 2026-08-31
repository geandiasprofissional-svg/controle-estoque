import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../styles/Tabela.css";

function Movimentacoes() {

    const [movimentacoes, setMovimentacoes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("");


    useEffect(() => {

        let ignorar = false;


        async function carregarMovimentacoes() {

            try {

                const resposta = await api.get(
                    "/movimentacoes"
                );


                if (ignorar) {
                    return;
                }


                setMovimentacoes(
                    resposta.data
                );

            } catch (erro) {

                console.error(
                    "Erro ao buscar movimentações:",
                    erro
                );


                if (!ignorar) {

                    setMensagem(
                        "Erro ao carregar movimentações."
                    );

                    setTipoMensagem("erro");
                }

            } finally {

                if (!ignorar) {

                    setCarregando(false);
                }
            }
        }


        carregarMovimentacoes();


        return () => {

            ignorar = true;
        };

    }, []);


    function formatarData(data) {

        if (!data) {
            return "-";
        }


        const dataFormatada = new Date(
            data.replace(" ", "T") + "Z"
        );


        return dataFormatada.toLocaleString(
            "pt-BR"
        );
    }


    function classeTipoMovimentacao(tipo) {

        if (tipo === "ENTRADA") {
            return "tipoEntrada";
        }


        if (tipo === "SAIDA") {
            return "tipoSaida";
        }


        return "";
    }


    return (

        <div>

            <h1>Histórico de Movimentações</h1>


            {mensagem && (

                <div
                    className={`mensagem ${tipoMensagem}`}
                >
                    {mensagem}
                </div>

            )}


            {carregando ? (

                <p className="carregando">
                    Carregando movimentações...
                </p>

            ) : (

                <table className="tabela">

                    <thead>

                        <tr>

                            <th>Produto</th>

                            <th>Tipo</th>

                            <th>Quantidade</th>

                            <th>Data</th>

                        </tr>

                    </thead>


                    <tbody>

                        {movimentacoes.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="4"
                                    className="tabelaVazia"
                                >
                                    Nenhuma movimentação registrada.
                                </td>

                            </tr>

                        ) : (

                            movimentacoes.map(
                                (movimentacao) => (

                                    <tr
                                        key={movimentacao.id}
                                    >

                                        <td>
                                            <strong>
                                                {movimentacao.produto}
                                            </strong>
                                        </td>


                                        <td>

                                            <span
                                                className={`tipoMovimentacao ${classeTipoMovimentacao(
                                                    movimentacao.tipo
                                                )}`}
                                            >
                                                {movimentacao.tipo === "ENTRADA"
                                                    ? "Entrada"
                                                    : "Saída"
                                                }
                                            </span>

                                        </td>


                                        <td>

                                            <span className="quantidadeMovimentacao">
                                                {movimentacao.quantidade}
                                            </span>

                                            <span className="unidadeMovimentacao">
                                                unidades
                                            </span>

                                        </td>


                                        <td className="dataMovimentacao">

                                            {formatarData(
                                                movimentacao.data_movimentacao
                                            )}

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


export default Movimentacoes;