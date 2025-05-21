import { useEffect, useState } from "react";
import { useCarrinho } from "../context/CarrinhoContext";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from 'react-toastify';

const ORS_API_KEY = import.meta.env.VITE_ORS_API_KEY;
const PIX_CODIGO = "50397719000186";

export default function FinalizarPedido() {
    const { carrinho, esvaziarCarrinho } = useCarrinho();
    const navigate = useNavigate();
    const [pagamentoSelecionado, setPagamentoSelecionado] = useState("");
    const [tipoEntrega, setTipoEntrega] = useState("");
    const [form, setForm] = useState({
        nome: "",
        cep: "",
        rua: "",
        bairro: "",
        cidade: "",
        estado: "",
        numero: "",
        complemento: "",
        frete: null,
    });
    const [calculandoFrete, setCalculandoFrete] = useState(false);
    const [trocoPara, setTrocoPara] = useState("");
    const API_URL = import.meta.env.VITE_API_URL;


    const enderecoLoja = [-53.776, -24.701];
    const camposObrigatoriosPreenchidos = form.nome && form.cep.length === 9 && form.rua && form.bairro && form.cidade && form.estado && form.numero;
    const subtotal = carrinho.reduce((sum, item) => sum + item.valor, 0);
    const total = subtotal + (tipoEntrega === "entrega" ? (form.frete ?? 0) : 0);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "cep") {
            const numeros = value.replace(/\D/g, "").slice(0, 8);
            if (numeros.length === 8) {
                const cepFormatado = numeros.replace(/(\d{5})(\d{3})/, "$1-$2");
                setForm((prev) => ({ ...prev, cep: cepFormatado }));
            } else {
                setForm((prev) => ({ ...prev, cep: numeros }));
            }
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const buscarEndereco = async () => {
        const cepNumeros = form.cep.replace(/\D/g, "");
        if (cepNumeros.length === 8) {
            try {
                const res = await fetch(`https://viacep.com.br/ws/${cepNumeros}/json/`);
                const data = await res.json();
                if (!data.erro) {
                    setForm((prev) => ({
                        ...prev,
                        rua: data.logradouro,
                        bairro: data.bairro,
                        cidade: data.localidade,
                        estado: data.uf,
                    }));
                }
            } catch (error) {
                console.error("Erro ao buscar endereço:", error);
            }
        }
    };

    const calcularFrete = async () => {
        setCalculandoFrete(true);
        try {
            const enderecoCompleto = `${form.rua}, ${form.numero}, ${form.bairro}, ${form.cidade}, ${form.estado}`;
            const geoRes = await fetch(
                `https://api.openrouteservice.org/geocode/search?api_key=${ORS_API_KEY}&text=${encodeURIComponent(enderecoCompleto)}`
            );
            const geoData = await geoRes.json();

            if (!geoData.features || geoData.features.length === 0) {
                alert("Endereço não encontrado.");
                return;
            }

            const [lng, lat] = geoData.features[0].geometry.coordinates;

            const matrixRes = await fetch("https://api.openrouteservice.org/v2/matrix/driving-car", {
                method: "POST",
                headers: {
                    Authorization: ORS_API_KEY,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    locations: [enderecoLoja, [lng, lat]],
                    metrics: ["distance"],
                    units: "km",
                }),
            });

            const matrixData = await matrixRes.json();

            if (matrixData.distances && Array.isArray(matrixData.distances)) {
                const distanciaKm = matrixData.distances[0][1];

                let valor = 5;
                for (let i = 1; i <= 10; i++) {
                    if (distanciaKm <= i) {
                        valor = 5 + (i - 1) * 2;
                        break;
                    }
                }

                setForm((prev) => ({ ...prev, frete: valor }));
            }
        } catch (error) {
            console.error("Erro ao calcular frete:", error);
            alert("Erro ao calcular frete. Verifique os dados.");
        } finally {
            setCalculandoFrete(false);
        }
    };

    function formatarMoeda(valor) {
        valor = valor.replace(/\D/g, ""); // Remove tudo que não é número
        valor = (Number(valor) / 100).toFixed(2) + ""; // Divide por 100 para ter 2 casas decimais
        valor = valor.replace(".", ","); // Troca ponto por vírgula
        valor = "R$ " + valor; // Adiciona o símbolo de real
        return valor;
    }


    useEffect(() => {
        if (tipoEntrega === "entrega" && form.cep.length === 9 && form.rua && form.numero && form.bairro && form.cidade && form.estado) {
            calcularFrete();
        }
    }, [form.cep, form.rua, form.numero, form.bairro, form.cidade, form.estado, tipoEntrega]);

    const handleConfirmarPedido = async () => {
        if (!form.nome.trim()) {
            alert("Preencha seu nome!");
            return;
        }
        if (tipoEntrega === "entrega" && (!camposObrigatoriosPreenchidos || form.frete === null)) {
            alert("Preencha todos os dados de entrega!");
            return;
        }
        if (!pagamentoSelecionado) {
            alert("Selecione uma forma de pagamento!");
            return;
        }

        let mensagem = `🍽️ *Novo Pedido Recebido!* 🍽️\n\n`;
        mensagem += `👤 *Cliente:* ${form.nome}\n`;
        mensagem += `🚚 *Entrega:* ${tipoEntrega === "entrega" ? "Entrega em domicílio 🏡" : "Retirada na loja 🏪"}\n\n`;

        mensagem += `🛒 *Itens do Pedido:*\n`;
        carrinho.forEach((item) => {
            mensagem += `• ${item.nome} — *R$ ${item.valor.toFixed(2).replace(".", ",")}*\n`;
        });

        mensagem += `\n💰 *Subtotal:* R$ ${subtotal.toFixed(2).replace(".", ",")}\n`;

        if (tipoEntrega === "entrega" && form.frete) {
            mensagem += `🚛 *Frete:* R$ ${form.frete.toFixed(2).replace(".", ",")}\n`;
        }

        mensagem += `🧾 *Total:* *R$ ${total.toFixed(2).replace(".", ",")}*\n`;

        if (pagamentoSelecionado === "dinheiro" && trocoPara) {
            const valorNumerico = parseFloat(
                trocoPara.replace("R$ ", "").replace(",", ".")
            );
            const trocoValor = valorNumerico - total;
            if (trocoValor > 0) {
                mensagem += `💵 *Troco para:* R$ ${valorNumerico.toFixed(2).replace(".", ",")} (Troco: R$ ${trocoValor.toFixed(2).replace(".", ",")})\n`;
            } else {
                mensagem += `💵 *Troco:* Sem necessidade de troco.\n`;
            }
        }

        if (tipoEntrega === "entrega") {
            mensagem += `\n📍 *Endereço de Entrega:*\n${form.rua}, ${form.numero}\n${form.bairro} - ${form.cidade}/${form.estado}\n`;
            if (form.complemento) {
                mensagem += `🏢 *Complemento:* ${form.complemento}\n`;
            }
        }

        mensagem += `💳 *Forma de Pagamento:* ${pagamentoSelecionado.toUpperCase()}\n`;

        // Se for pagamento por PIX, adicionar informações adicionais
        if (pagamentoSelecionado === "pix") {
            mensagem += `\n🏦 *Chave PIX:* ${PIX_CODIGO}\n`;
            mensagem += `📩 *Realize o pagamento e envie o comprovante por WhatsApp!*\n`;
        }

        mensagem += `\n🎉 *Agradecemos a preferência!*\n✨ *Seu pedido está sendo preparado com muito carinho!* ✨`;


        try {
            const res = await fetch(`${API_URL}/enviar-pedido`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    form,
                    carrinho,
                    tipo_entrega: tipoEntrega,
                    pagamento: pagamentoSelecionado,
                    frete: tipoEntrega === "entrega" ? form.frete : 0.0,
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                toast.error(`Erro ao enviar pedido: ${error.detail || "Erro desconhecido"}`);
                return;
            }

            const data = await res.json();
            console.log("Pedido registrado na API:", data);

            toast.success("Pedido registrado com sucesso!");

            
            // Limpar o carrinho
            esvaziarCarrinho();

            // Redirecionar
            navigate("/pedido-confirmado");

            // Abrir WhatsApp
            const telefoneLoja = "5545991010879";
            const url = `https://api.whatsapp.com/send/?phone=${telefoneLoja}&text=${encodeURIComponent(mensagem)}`;
            window.open(url, "_blank");

        } catch (err) {
            console.error("Erro ao enviar para backend:", err);
            toast.error("Falha ao registrar pedido. Tente novamente.");
        }
    };

    return (
        <section className="min-h-screen pt-32 px-6 md:px-24 pb-24 bg-gradient-to-b from-white to-gray-100">
            <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: -30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8 }}
            >
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-[#1a1a1a] mb-4">
                    Finalize seu <span className="text-red-600">Pedido</span> com Segurança!
                </h1>
                <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
                    Preencha seus dados, escolha a entrega e o pagamento para garantir seu pedido com agilidade!
                </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

                {/* Dados do Cliente e Entrega */}
                <motion.div
                    className="bg-white p-8 rounded-3xl shadow-2xl space-y-8"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-xl font-bold text-[#561c1c]">Entrega ou Retirada?</h2>
                    {/* Seletor de Retirada ou Entrega */}
                    <div className="flex flex-col gap-4">
                        {[
                            { id: "retirada", titulo: "Retirada", descricao: "Retire na loja" },
                            { id: "entrega", titulo: "Entrega", descricao: "Receba em casa" },
                        ].map((opcao) => (
                            <div
                                key={opcao.id}
                                onClick={() => setTipoEntrega(opcao.id)}
                                className={`cursor-pointer transition transform hover:scale-105 border-2 rounded-lg bg-white p-4 flex items-center gap-4 ${tipoEntrega === opcao.id ? "border-[#561c1c] bg-red-50" : "border-gray-200"
                                    }`}
                            >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${tipoEntrega === opcao.id ? "border-[#561c1c]" : "border-gray-400"
                                    }`}>
                                    {tipoEntrega === opcao.id && <div className="w-2.5 h-2.5 bg-[#561c1c] rounded-full" />}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{opcao.titulo}</h3>
                                    <p className="text-sm text-gray-500">{opcao.descricao}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Formulário */}
                    <div className="grid gap-3 mt-8">
                        <input type="text" name="nome" placeholder="Nome completo" value={form.nome} onChange={handleChange} className="border border-gray-300 rounded-xl p-3 w-full focus:outline-none focus:border-[#561c1c]transition" />
                        {tipoEntrega === "entrega" && (
                            <>
                                <input type="text" name="cep" placeholder="CEP" value={form.cep} onChange={handleChange} onBlur={buscarEndereco} className="border border-gray-300 rounded-xl p-3 w-full focus:outline-none focus:border-[#561c1c] transition" />
                                <input type="text" name="rua" placeholder="Rua" value={form.rua} onChange={handleChange} className="border border-gray-300 rounded-xl p-3 w-full focus:outline-none focus:border-[#561c1c] transition" />
                                <input type="text" name="bairro" placeholder="Bairro" value={form.bairro} onChange={handleChange} className="border border-gray-300 rounded-xl p-3 w-full focus:outline-none focus:border-[#561c1c] transition" />
                                <input type="text" name="numero" placeholder="Número" value={form.numero} onChange={handleChange} className="border border-gray-300 rounded-xl p-3 w-full focus:outline-none focus:border-[#561c1c] transition" />
                                <input type="text" name="complemento" placeholder="Complemento" value={form.complemento} onChange={handleChange} className="border border-gray-300 rounded-xl p-3 w-full focus:outline-none focus:border-[#561c1c] transition" />
                            </>
                        )}
                    </div>

                    {/* Frete */}
                    {tipoEntrega === "entrega" && form.frete !== null && (
                        <div className="text-end text-lg font-medium mt-4">
                            Frete: <span className="font-bold">R$ {form.frete.toFixed(2).replace(".", ",")}</span>
                        </div>
                    )}
                </motion.div>

                {/* Forma de Pagamento */}
                <motion.div
                    className="bg-white p-6 rounded-3xl shadow-2xl space-y-8"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-xl font-bold text-[#561c1c]">Forma de Pagamento</h2>
                    <div className="flex flex-col gap-4">
                        {[
                            { id: "pix", titulo: "Pix" },
                            { id: "dinheiro", titulo: "Dinheiro" },
                            { id: "cartao_credito", titulo: "Cartão Crédito" },
                            { id: "cartao_debito", titulo: "Cartão Débito" },
                            { id: "alimentacao", titulo: "Alimentação (Alelo, VR)" },
                        ].map((opcao) => (
                            <div
                                key={opcao.id}
                                onClick={async () => {
                                    setPagamentoSelecionado(opcao.id);
                                    if (opcao.id === "pix") {
                                        try {
                                            await navigator.clipboard.writeText(PIX_CODIGO);
                                            toast.success('Código PIX copiado!', {
                                                icon: "✅",
                                                style: {
                                                    background: "#4ade80",  // fundo verde elegante
                                                    color: "#ffffff",
                                                    fontWeight: "600",
                                                    fontSize: "14px",
                                                    padding: "8px 16px",
                                                    borderRadius: "8px",
                                                    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                                                },
                                            });
                                        } catch (error) {
                                            console.error("Erro ao copiar PIX:", error);
                                            toast.error('Erro ao copiar código!', {
                                                icon: "⚠️",
                                                style: {
                                                    background: "#f87171",
                                                    color: "#ffffff",
                                                    fontWeight: "600",
                                                    fontSize: "14px",
                                                    padding: "8px 16px",
                                                    borderRadius: "8px",
                                                    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                                                },
                                            });
                                        }
                                    }
                                }}

                                className={`cursor-pointer flex-1 border-2 rounded-lg p-4 text-center font-semibold transition transform hover:scale-105 ${pagamentoSelecionado === opcao.id
                                    ? "border-[#561c1c] "
                                    : "border-gray-200"
                                    }`}
                            >
                                <div className="flex gap-2">
                                    <div
                                        className={`w-4 h-4 mt-1 rounded-full border-2 flex items-center justify-center ${pagamentoSelecionado === opcao.id
                                            ? "border-[#561c1c]"
                                            : "border-gray-400"
                                            }`}
                                    >
                                        {pagamentoSelecionado === opcao.id && (
                                            <div className="w-2 h-2 bg-[#561c1c] rounded-full" />
                                        )}
                                    </div>
                                    <span>{opcao.titulo}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    {pagamentoSelecionado === "dinheiro" && (
                        <input
                            type="text"
                            name="trocoPara"
                            placeholder="Troco para quanto?"
                            value={trocoPara}
                            onChange={(e) => setTrocoPara(formatarMoeda(e.target.value))}
                            className="border border-gray-300 rounded-xl p-3 w-full focus:outline-none focus:border-[#561c1c] transition"
                        />
                    )}
                </motion.div>


                {/* Resumo do Pedido */}
                <motion.div
                    className="bg-white p-8 rounded-3xl shadow-2xl space-y-8"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-2xl font-bold text-[#561c1c] mb-4">Resumo do Pedido</h2>

                    {carrinho.length === 0 ? (
                        <p className="text-gray-600">Seu carrinho está vazio 😥</p>
                    ) : (
                        <div className="space-y-4">
                            {carrinho.map((produto, index) => (
                                <div key={index} className="flex justify-between items-center border-b pb-2">
                                    <div className="flex items-center gap-2">
                                        <img src={produto.imagem} alt={produto.nome} className="w-12 h-12 object-contain rounded" />
                                        <span className="font-semibold text-gray-800">{produto.nome}</span>
                                    </div>
                                    <span className="text-gray-600">R$ {produto.valor.toFixed(2).replace(".", ",")}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Totais */}
                    <div className="text-right mt-6 space-y-2">
                        <p className="text-lg font-bold text-[#561c1c]">Subtotal: R$ {subtotal.toFixed(2)}</p>
                        {tipoEntrega === "entrega" && form.frete && (
                            <p className="text-lg font-bold text-[#561c1c]">Frete: R$ {form.frete.toFixed(2)}</p>
                        )}
                        <p className="text-2xl font-bold text-[#561c1c]">Total: R$ {total.toFixed(2)}</p>
                    </div>

                    {/* Botão Confirmar */}
                    <button
                        onClick={handleConfirmarPedido}
                        className={`w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-full text-lg shadow-md transition-all ${(!tipoEntrega || !form.nome.trim() || (tipoEntrega === "entrega" && (!camposObrigatoriosPreenchidos || form.frete === null)) || !pagamentoSelecionado)
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                            }`}
                        disabled={
                            !tipoEntrega ||
                            !form.nome.trim() ||
                            (tipoEntrega === "entrega" && (!camposObrigatoriosPreenchidos || form.frete === null)) ||
                            !pagamentoSelecionado
                        }
                    >
                        Confirmar Pedido
                    </button>

                    {/* Link Voltar */}
                    <Link to="/carrinho" className="block mt-4 text-center text-red-600 hover:underline">
                        Voltar para o Carrinho
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}      