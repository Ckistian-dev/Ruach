import { useCarrinho } from "../context/CarrinhoContext"; // 👈 importa

export default function ModalProduto({ produto, onClose }) {
  const { adicionarAoCarrinho } = useCarrinho(); // 👈 usa

  if (!produto) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/40 animate-fade-in">
      <div className="bg-white rounded-2xl p-8 w-3/4 max-w-md shadow-2xl relative animate-slide-up">
        
        {/* Botão de Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-3xl leading-none"
        >
          ×
        </button>
  
        {/* Conteúdo do Modal */}
        <div className="flex flex-col items-center text-center gap-2">
          <img
            src={produto.imagem}
            alt={produto.nome}
            className="w-50 h-50 object-contain"
          />
          <h2 className="text-2xl font-bold text-[#561c1c]">{produto.nome}</h2>
          <p className="text-lg font-semibold text-gray-700">
            R$ {produto.valor?.toFixed(2).replace('.', ',')}
          </p>
  
          <button
            onClick={() => {
              adicionarAoCarrinho(produto);
              onClose();
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-8 rounded-full transition-all duration-300 shadow-md"
          >
            Adicionar ao Carrinho
          </button>
        </div>
  
      </div>
    </div>
  );
  
}
