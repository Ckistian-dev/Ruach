import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalProdutoAdmin from "../components/ModalProdutoAdmin";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/produtos/todos`);
      setProdutos(response.data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    }
  };


  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const reordered = Array.from(produtos);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    setProdutos(reordered);
    try {
      const produtosParaAtualizar = reordered.map((produto, index) => ({
        id: produto.id,
        ordem: index + 1,
      }));
      await axios.post(`${import.meta.env.VITE_API_URL}/produtos/atualizar-ordem`, produtosParaAtualizar);
      console.log("Nova ordem salva com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar nova ordem:", error);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-gray-50 to-red-50">
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

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="produtos" direction="horizontal">
          {(provided) => (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {produtos.map((produto, index) => (
                <Draggable key={produto.id} draggableId={String(produto.id)} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="select-none bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow p-6 flex flex-col justify-between"
                    >
                      <img
                        src={produto.imagem}
                        alt={produto.nome}
                        className="w-full h-48 object-cover rounded-lg mb-6 pointer-events-none"
                      />

                      <div className="flex flex-col mb-2">
                        <h2 className="text-2xl font-bold text-gray-800">{produto.nome}</h2>
                        <p className="text-lg text-gray-600 font-semibold">R$ {produto.valor}</p>
                        <p className="text-sm text-gray-400 italic">{produto.categoria}</p>
                      </div>

                      <div className="flex justify-center mb-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            axios.patch(`${import.meta.env.VITE_API_URL}/produtos/${produto.id}/ativar`).then(() => {
                              setProdutos((prev) =>
                                prev.map((p) => (p.id === produto.id ? { ...p, ativo: !p.ativo } : p))
                              );
                            });
                          }}
                          className={`w-full py-2 rounded-full font-semibold transition duration-300 ${produto.ativo
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : "bg-gray-400 hover:bg-gray-500 text-white"
                            }`}
                        >
                          {produto.ativo ? "Ativo" : "Inativo"}
                        </button>
                      </div>

                      <div className="flex gap-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setProdutoSelecionado(produto);
                            setModalAberto(true);
                          }}
                          className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-800 py-2 rounded-full font-semibold transition duration-300"
                        >
                          Editar
                        </button>

                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (confirm("Deseja realmente excluir?")) {
                              try {
                                await axios.delete(`${import.meta.env.VITE_API_URL}/produtos/${produto.id}`);
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
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

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
