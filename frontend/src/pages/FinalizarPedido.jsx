import { useEffect, useState, useMemo } from "react";
import { useCarrinho } from "../context/CarrinhoContext";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from 'react-toastify';

// Variáveis de Ambiente
const ORS_API_KEY = import.meta.env.VITE_ORS_API_KEY;
const PIX_CODIGO = "50397719000186"; // Sua chave PIX
const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL; // URL do seu App Script

export default function FinalizarPedido() {
    const { carrinho, esvaziarCarrinho } = useCarrinho();
    const navigate = useNavigate();

    // Estados do formulário e da página
    const [pagamentoSelecionado, setPagamentoSelecionado] = useState("");
    const [tipoEntrega, setTipoEntrega] = useState("");
    const [form, setForm] = useState({
        nome: "", cep: "", rua: "", bairro: "", cidade: "", estado: "", numero: "", complemento: "", frete: null,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [trocoPara, setTrocoPara] = useState("");
    
    const enderecoLoja = [-53.776, -24.701]; // Coordenadas [longitude, latitude] da sua loja

    // Agrupamento de produtos e cálculo de totais
    const { produtosAgrupados, subtotal } = useMemo(() => {
        const agrupados = carrinho.reduce((acc, item) => {
            const key = item.ID;
            if (!acc[key]) {
                acc[key] = { ...item, quantidade: 0 };
            }
            acc[key].quantidade += 1;
            return acc;
        }, {});
        const sub = Object.values(agrupados).reduce((sum, item) => sum + item.Preço * item.quantidade, 0);
        return { produtosAgrupados: Object.values(agrupados), subtotal: sub };
    }, [carrinho]);

    const total = subtotal + (tipoEntrega === "entrega" ? (form.frete ?? 0) : 0);

    // Validação do formulário para habilitar o botão de confirmar
    const camposObrigatoriosPreenchidos = form.nome && form.cep.length >= 8 && form.rua && form.bairro && form.cidade && form.estado && form.numero;
    const isFormValid = tipoEntrega && form.nome.trim() && pagamentoSelecionado && 
                        (tipoEntrega === "retirada" || (camposObrigatoriosPreenchidos && form.frete !== null));

    // --- FUNÇÕES AUXILIARES ---

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "cep") {
            const numeros = value.replace(/\D/g, "").slice(0, 8);
            const cepFormatado = numeros.replace(/(\d{5})(\d{3})/, "$1-$2");
            setForm((prev) => ({ ...prev, cep: cepFormatado }));
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
                        ...prev, rua: data.logradouro, bairro: data.bairro, cidade: data.localidade, estado: data.uf,
                    }));
                }
            } catch (error) { console.error("Erro ao buscar endereço:", error); }
        }
    };

    const calcularFrete = async () => {
        if (!form.rua || !form.numero || !form.cidade) return;
        try {
            const enderecoCompleto = `${form.rua}, ${form.numero}, ${form.bairro}, ${form.cidade}, ${form.estado}`;
            const geoRes = await fetch(`https://api.openrouteservice.org/geocode/search?api_key=${ORS_API_KEY}&text=${encodeURIComponent(enderecoCompleto)}`);
            const geoData = await geoRes.json();
            if (!geoData.features || geoData.features.length === 0) {
                toast.error("Endereço não encontrado para cálculo do frete.");
                return;
            }
            const [lng, lat] = geoData.features[0].geometry.coordinates;
            const matrixRes = await fetch("https://api.openrouteservice.org/v2/matrix/driving-car", {
                method: "POST",
                headers: { Authorization: ORS_API_KEY, "Content-Type": "application/json" },
                body: JSON.stringify({ locations: [enderecoLoja, [lng, lat]], metrics: ["distance"], units: "km" }),
            });
            const matrixData = await matrixRes.json();
            if (matrixData.distances && Array.isArray(matrixData.distances)) {
                const distanciaKm = matrixData.distances[0][1];
                let valor = 10;
                for (let i = 1; i <= 10; i++) {
                    if (distanciaKm <= i) {
                        valor = 10 + (i - 1) * 2;
                        break;
                    }
                }
                setForm((prev) => ({ ...prev, frete: valor }));
            }
        } catch (error) {
            console.error("Erro ao calcular frete:", error);
            toast.error("Erro ao calcular frete. Verifique os dados.");
        }
    };

    function formatarMoeda(valor) {
        valor = valor.replace(/\D/g, "");
        valor = (Number(valor) / 100).toFixed(2) + "";
        valor = valor.replace(".", ",");
        return "R$ " + valor;
    }
    
    useEffect(() => {
        if (tipoEntrega === "entrega" && form.cep.length >= 8) {
            buscarEndereco();
        }
    }, [form.cep, tipoEntrega]);

    useEffect(() => {
        if (tipoEntrega === "entrega" && camposObrigatoriosPreenchidos) {
            calcularFrete();
        }
    }, [form.rua, form.numero, form.bairro, form.cidade, form.estado]);

    // --- FUNÇÃO PRINCIPAL DE ENVIO ---

    const handleConfirmarPedido = async () => {
        if (!isFormValid) {
            toast.warn("Por favor, preencha todos os campos obrigatórios.");
            return;
        }
        setIsSubmitting(true);

        const itensPedido = produtosAgrupados.map(p => `${p.quantidade}x ${p.Nome}`).join('; ');
        const enderecoCompleto = tipoEntrega === 'entrega' 
            ? `${form.rua}, ${form.numero}, ${form.bairro} - ${form.cidade}/${form.estado}`
            : 'Retirada na loja';

        const pedidoParaPlanilha = {
            id: `PEDIDO-${Date.now()}`,
            dataHora: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
            cliente: form.nome,
            tipoEntrega: tipoEntrega.charAt(0).toUpperCase() + tipoEntrega.slice(1),
            endereco: enderecoCompleto,
            itens: itensPedido,
            subtotal: subtotal.toFixed(2).replace('.',','),
            frete: form.frete ? form.frete.toFixed(2).replace('.',',') : '0,00',
            total: total.toFixed(2).replace('.',','),
            pagamento: pagamentoSelecionado.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            trocoPara: trocoPara || 'N/A',
        };

        try {
            await fetch(APPS_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pedidoParaPlanilha),
            });
            
            toast.success("Pedido registrado com sucesso!");

            let mensagem = `🍽️ *Novo Pedido Recebido!* 🍽️\n\n`;
            mensagem += `*ID do Pedido:* ${pedidoParaPlanilha.id}\n`;
            mensagem += `*Cliente:* ${form.nome}\n`;
            mensagem += `*Entrega:* ${tipoEntrega === "entrega" ? "Entrega em domicílio 🏡" : "Retirada na loja 🏪"}\n\n`;
            mensagem += `*Itens do Pedido:*\n`;
            produtosAgrupados.forEach((item) => {
                mensagem += `• ${item.quantidade}x ${item.Nome} — *R$ ${item.Preço.toFixed(2).replace(".", ",")}*\n`;
            });
            mensagem += `\n*Subtotal:* R$ ${subtotal.toFixed(2).replace(".", ",")}\n`;
            if (tipoEntrega === "entrega" && form.frete) {
                mensagem += `*Frete:* R$ ${form.frete.toFixed(2).replace(".", ",")}\n`;
            }
            mensagem += `*Total:* *R$ ${total.toFixed(2).replace(".", ",")}*\n`;
            if (pagamentoSelecionado === "dinheiro" && trocoPara) {
                 mensagem += `*Troco para:* ${trocoPara}\n`;
            }
            if (tipoEntrega === "entrega") {
                mensagem += `\n*Endereço de Entrega:*\n${enderecoCompleto}\n`;
                if (form.complemento) mensagem += `*Complemento:* ${form.complemento}\n`;
            }
            mensagem += `*Forma de Pagamento:* ${pedidoParaPlanilha.pagamento}\n`;
            if (pagamentoSelecionado === "pix") {
                mensagem += `\n*Chave PIX (Copia e Cola):*\n\`\`\`${PIX_CODIGO}\`\`\`\n`;
                mensagem += `\n*Realize o pagamento e envie o comprovante por aqui!*\n`;
            }
            mensagem += `\n🎉 *Agradecemos a preferência!*`;

            esvaziarCarrinho();
            navigate("/pedido-confirmado");
            const telefoneLoja = "5545991010879";
            const url = `https://api.whatsapp.com/send/?phone=${telefoneLoja}&text=${encodeURIComponent(mensagem)}`;
            window.open(url, "_blank");

        } catch (err) {
            console.error("Erro ao enviar pedido para o Apps Script:", err);
            toast.error("Ops! Tivemos um problema ao registrar seu pedido. Tente novamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="min-h-screen pt-32 px-6 md:px-24 pb-24 bg-gradient-to-b from-white to-gray-100">
            <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
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
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-xl font-bold text-[#561c1c]">Entrega ou Retirada?</h2>
                    <div className="flex flex-col gap-4">
                        {[
                            { id: "retirada", titulo: "Retirada", descricao: "Retire na loja" },
                            { id: "entrega", titulo: "Entrega", descricao: "Receba em casa" },
                        ].map((opcao) => (
                            <div
                                key={opcao.id}
                                onClick={() => setTipoEntrega(opcao.id)}
                                className={`cursor-pointer transition transform hover:scale-105 border-2 rounded-lg bg-white p-4 flex items-center gap-4 ${tipoEntrega === opcao.id ? "border-[#561c1c] bg-red-50" : "border-gray-200"}`}
                            >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${tipoEntrega === opcao.id ? "border-[#561c1c]" : "border-gray-400"}`}>
                                    {tipoEntrega === opcao.id && <div className="w-2.5 h-2.5 bg-[#561c1c] rounded-full" />}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{opcao.titulo}</h3>
                                    <p className="text-sm text-gray-500">{opcao.descricao}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid gap-3 mt-8">
                        <input type="text" name="nome" placeholder="Nome completo" value={form.nome} onChange={handleChange} className="border border-gray-300 rounded-xl p-3 w-full focus:outline-none focus:border-[#561c1c] transition" />
                        {tipoEntrega === "entrega" && (
                            <motion.div className="grid gap-3" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                <input type="text" name="cep" placeholder="CEP" value={form.cep} onChange={handleChange} className="border border-gray-300 rounded-xl p-3 w-full focus:outline-none focus:border-[#561c1c] transition" maxLength="9" />
                                <input type="text" name="rua" placeholder="Rua" value={form.rua} onChange={handleChange} className="border border-gray-300 rounded-xl p-3 w-full focus:outline-none focus:border-[#561c1c] transition" />
                                <input type="text" name="bairro" placeholder="Bairro" value={form.bairro} onChange={handleChange} className="border border-gray-300 rounded-xl p-3 w-full focus:outline-none focus:border-[#561c1c] transition" />
                                <input type="text" name="numero" placeholder="Número" value={form.numero} onChange={handleChange} className="border border-gray-300 rounded-xl p-3 w-full focus:outline-none focus:border-[#561c1c] transition" />
                                <input type="text" name="complemento" placeholder="Complemento (Opcional)" value={form.complemento} onChange={handleChange} className="border border-gray-300 rounded-xl p-3 w-full focus:outline-none focus:border-[#561c1c] transition" />
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* Forma de Pagamento */}
                <motion.div
                    className="bg-white p-6 rounded-3xl shadow-2xl space-y-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <h2 className="text-xl font-bold text-[#561c1c]">Forma de Pagamento</h2>
                    <div className="flex flex-col gap-4">
                        {[
                            { id: "pix", titulo: "Pix" }, { id: "dinheiro", titulo: "Dinheiro" },
                            { id: "cartao_credito", titulo: "Cartão Crédito" }, { id: "cartao_debito", titulo: "Cartão Débito" },
                            { id: "alimentacao", titulo: "Alimentação (Alelo, VR)" },
                        ].map((opcao) => (
                            <div
                                key={opcao.id}
                                onClick={async () => {
                                    setPagamentoSelecionado(opcao.id);
                                    if (opcao.id === "pix") {
                                        try {
                                            await navigator.clipboard.writeText(PIX_CODIGO);
                                            toast.success('Código PIX copiado para a área de transferência!');
                                        } catch (error) {
                                            console.error("Erro ao copiar PIX:", error);
                                            toast.error('Não foi possível copiar o código PIX.');
                                        }
                                    }
                                }}
                                className={`cursor-pointer flex-1 border-2 rounded-lg p-4 font-semibold transition transform hover:scale-105 ${pagamentoSelecionado === opcao.id ? "border-[#561c1c]" : "border-gray-200"}`}
                            >
                                <div className="flex gap-2 items-center">
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${pagamentoSelecionado === opcao.id ? "border-[#561c1c]" : "border-gray-400"}`}>
                                        {pagamentoSelecionado === opcao.id && <div className="w-2 h-2 bg-[#561c1c] rounded-full" />}
                                    </div>
                                    <span>{opcao.titulo}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    {pagamentoSelecionado === "dinheiro" && (
                        <motion.input
                            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                            type="text" name="trocoPara" placeholder="Troco para quanto?" value={trocoPara}
                            onChange={(e) => setTrocoPara(formatarMoeda(e.target.value))}
                            className="border border-gray-300 rounded-xl p-3 w-full focus:outline-none focus:border-[#561c1c] transition"
                        />
                    )}
                </motion.div>

                {/* Resumo do Pedido */}
                <motion.div
                    className="bg-white p-8 rounded-3xl shadow-2xl space-y-6 h-fit sticky top-24"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h2 className="text-2xl font-bold text-[#561c1c] mb-4">Resumo do Pedido</h2>
                    <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                        {produtosAgrupados.length > 0 ? produtosAgrupados.map((p) => (
                            <div key={p.ID} className="flex justify-between items-center border-b pb-2">
                                <span className="font-semibold text-gray-800">{p.quantidade}x {p.Nome}</span>
                                <span className="text-gray-600">R$ {(p.Preço * p.quantidade).toFixed(2).replace(".", ",")}</span>
                            </div>
                        )) : <p className="text-gray-600 text-center">Seu carrinho está vazio 😥</p>}
                    </div>
                    <div className="text-right mt-6 space-y-2 border-t pt-4">
                        <p className="text-lg font-medium text-gray-700">Subtotal: R$ {subtotal.toFixed(2).replace(".", ",")}</p>
                        {tipoEntrega === "entrega" && form.frete !== null && (
                            <p className="text-lg font-medium text-gray-700">Frete: R$ {form.frete.toFixed(2).replace(".", ",")}</p>
                        )}
                        <p className="text-2xl font-bold text-[#561c1c]">Total: R$ {total.toFixed(2).replace(".", ",")}</p>
                    </div>
                    <button
                        onClick={handleConfirmarPedido}
                        disabled={!isFormValid || isSubmitting}
                        className={`w-full mt-6 bg-red-600 text-white font-bold py-4 rounded-full text-lg shadow-md transition-all ${!isFormValid || isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700"}`}
                    >
                        {isSubmitting ? 'Enviando...' : 'Confirmar Pedido'}
                    </button>
                    <Link to="/carrinho" className="block mt-4 text-center text-red-600 hover:underline">
                        Voltar para o Carrinho
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}