import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalProdutoAdmin from "../components/ModalProdutoAdmin";
import axios from "axios";

export default function AdminDashboard() {
  const [produtos, setProdutos] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const adminLogado = localStorage.getItem("admin");
    if (adminLogado !== "true") {
      navigate("/admin/login");
    } else {
      carregarProdutos();
    }
  }, []);

  const carregarProdutos = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/produtos`);
      setProdutos(response.data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    }
  };

  const handleAtivarDesativar = async (id) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/produtos/${id}/ativar`);

      // Atualiza apenas o produto alterado localmente:
      setProdutos((prevProdutos) =>
        prevProdutos.map((p) =>
          p.id === id ? { ...p, ativo: !p.ativo } : p
        )
      );
    } catch (error) {
      console.error("Erro ao ativar/desativar produto:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-gray-50 to-red-50">
      {/* Header Admin */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#561c1c] tracking-tight">
          Painel de Administração
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-full shadow-md transition-all duration-300"
        >
          Sair
        </button>
      </div>
  
      {/* Botão Adicionar Produto */}
      <div className="flex justify-end mb-8">
        <button
          onClick={() => {
            setProdutoSelecionado(null);
            setModalAberto(true);
          }}
          className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-full shadow-md transition-all duration-300 font-semibold"
        >
          + Adicionar Produto
        </button>
      </div>
  
      {/* Lista de Produtos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {produtos.map((produto) => (
          <div
            key={produto.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow p-6 flex flex-col justify-between"
          >
            <img
              src={produto.imagem}
              alt={produto.nome}
              className="w-full h-48 object-cover rounded-lg mb-6"
            />
  
            <div className="flex flex-col space-y-2 mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{produto.nome}</h2>
              <p className="text-lg text-gray-600 font-semibold">R$ {produto.valor}</p>
              <p className="text-sm text-gray-400 italic">{produto.categoria}</p>
            </div>
  
            {/* Botão Ativar/Desativar */}
            <div className="flex justify-center mb-4">
              <button
                onClick={() => handleAtivarDesativar(produto.id)}
                className={`w-full py-2 rounded-full font-semibold transition duration-300 ${
                  produto.ativo
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-gray-400 hover:bg-gray-500 text-white"
                }`}
              >
                {produto.ativo ? "Ativo" : "Inativo"}
              </button>
            </div>
  
            {/* Botões Editar / Excluir */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setProdutoSelecionado(produto);
                  setModalAberto(true);
                }}
                className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-800 py-2 rounded-full font-semibold transition duration-300"
              >
                Editar
              </button>
              <button
                onClick={async () => {
                  if (confirm("Deseja realmente excluir?")) {
                    try {
                      await axios.delete(`https://ruach-production.up.railway.app/produtos/${produto.id}`);
                      carregarProdutos();
                    } catch (error) {
                      console.error("Erro ao excluir:", error);
                    }
                  }
                }}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-full font-semibold transition duration-300"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
  
      {/* Modal Produto */}
      {modalAberto && (
        <ModalProdutoAdmin
          produto={produtoSelecionado}
          onClose={() => {
            setModalAberto(false);
            carregarProdutos();
          }}
        />
      )}
    </div>
  );
  
}
