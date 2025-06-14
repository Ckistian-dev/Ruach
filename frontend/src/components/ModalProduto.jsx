import { useCarrinho } from "../context/CarrinhoContext"; // 👈 importa

export default function ModalProduto({ produto, onClose }) {
  const { adicionarAoCarrinho } = useCarrinho(); // 👈 usa

  if (!produto) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/40 animate-fade-in">
      {/* Container do Modal com o seu layout original */}
      <div className="bg-white rounded-2xl p-8 w-3/4 max-w-md shadow-2xl relative animate-slide-up">
        
        {/* Seu Botão de Fechar original */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-3xl leading-none"
          aria-label="Fechar"
        >
          ×
        </button>
 
        {/* Conteúdo do Modal centralizado */}
        <div className="flex flex-col items-center text-center gap-4"> {/* Ajustei o gap para um respiro melhor */}
          <img
            src={produto.imagem}
            alt={produto.nome}
            // Corrigido para uma classe Tailwind padrão, mantendo o visual
            className="w-48 h-48 object-contain" 
          />
          
          <h2 className="text-2xl font-bold text-[#561c1c]">{produto.nome}</h2>
          
          {/* 👇 DESCRIÇÃO MELHORADA 👇 */}
          {/* Agora é um parágrafo com estilo mais suave para não competir com o título */}
          <p className="text-base text-gray-600 leading-relaxed">
            {produto.descricao}
          </p>
          
          <p className="text-xl font-bold text-gray-800">
            R$ {produto.valor?.toFixed(2).replace('.', ',')}
          </p>
 
          <button
            onClick={() => {
              adicionarAoCarrinho(produto);
              onClose();
            }}
            // Adicionei um espaçamento superior para separar do preço
            className=" bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-8 rounded-full transition-all duration-300 shadow-md"
          >
            Adicionar ao Carrinho
          </button>
        </div>
 
      </div>
    </div>
  );
}