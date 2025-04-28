import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalProdutoAdmin from "../components/ModalProdutoAdmin";
import axios from "axios";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 200,    // Segurar 200ms antes de arrastar
        tolerance: 5,  // Pode mexer até 5px antes de considerar um arraste
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );


  async function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setProdutos((produtos) => {
        const oldIndex = produtos.findIndex((p) => p.id === active.id);
        const newIndex = produtos.findIndex((p) => p.id === over.id);
        const novoArray = arrayMove(produtos, oldIndex, newIndex);

        // 🔥 Chamar a função para salvar a nova ordem no backend
        salvarNovaOrdem(novoArray);

        return novoArray;
      });
    }
  }


  async function salvarNovaOrdem(produtosOrdenados) {
    try {
      // Mapeia os produtos para enviar apenas id e nova ordem
      const produtosParaAtualizar = produtosOrdenados.map((produto, index) => ({
        id: produto.id,
        ordem: index + 1, // começa do 1
      }));

      await axios.post(`${import.meta.env.VITE_API_URL}/produtos/atualizar-ordem`, produtosParaAtualizar);

      console.log("Nova ordem salva com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar nova ordem:", error);
    }
  }


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

      {/* Drag & Drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={produtos.map((p) => p.id)} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {produtos.map((produto) => (
              <SortableItem key={produto.id} produto={produto} setModalAberto={setModalAberto} setProdutoSelecionado={setProdutoSelecionado} handleAtivarDesativar={async (id) => {
                await axios.patch(`${import.meta.env.VITE_API_URL}/produtos/${id}/ativar`);
                setProdutos((prev) =>
                  prev.map((p) => (p.id === id ? { ...p, ativo: !p.ativo } : p))
                );
              }} carregarProdutos={carregarProdutos} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

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

function SortableItem({ produto, setModalAberto, setProdutoSelecionado, handleAtivarDesativar, carregarProdutos }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: produto.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow p-6 flex flex-col justify-between cursor-grab active:cursor-grabbing"
    >
      <img
        src={produto.imagem}
        alt={produto.nome}
        className="w-full h-48 object-cover rounded-lg mb-6"
      />

      <div className="flex flex-col mb-2">
        <h2 className="text-2xl font-bold text-gray-800">{produto.nome}</h2>
        <p className="text-lg text-gray-600 font-semibold">R$ {produto.valor}</p>
        <p className="text-sm text-gray-400 italic">{produto.categoria}</p>
      </div>

      <div className="flex justify-center mb-2">
        <button
          onClick={(e) => {
            e.stopPropagation(); // 👈 Impede que o clique ative o drag
            handleAtivarDesativar(produto.id);
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
            e.stopPropagation(); // 👈 Impede que o clique ative o drag
            setProdutoSelecionado(produto);
            setModalAberto(true);
          }}
          className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-800 py-2 rounded-full font-semibold transition duration-300"
        >
          Editar
        </button>

        <button
          onClick={async (e) => {
            e.stopPropagation(); // 👈 Impede que o clique ative o drag
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
  );
}
