import { createContext, useState, useContext, useCallback } from "react";

const CarrinhoContext = createContext();

export function CarrinhoProvider({ children }) {
  const [carrinho, setCarrinho] = useState([]);

  const adicionarAoCarrinho = useCallback((produto) => {
    setCarrinho((prev) => [...prev, produto]);
  }, []);

  const removerDoCarrinho = useCallback((produto) => {
    setCarrinho((prev) => {
      // Encontra o ÍNDICE do ÚLTIMO item com o mesmo ID no carrinho
      const index = prev.map(p => p.ID).lastIndexOf(produto.ID);
      
      if (index !== -1) {
        const novoCarrinho = [...prev];
        novoCarrinho.splice(index, 1); // Remove apenas esse item
        return novoCarrinho;
      }
      
      return prev; // Se não encontrar, retorna o carrinho como estava
    });
  }, []);

  const esvaziarCarrinho = useCallback(() => {
    setCarrinho([]);
  }, []);

  return (
    <CarrinhoContext.Provider value={{ carrinho, adicionarAoCarrinho, removerDoCarrinho, esvaziarCarrinho }}>
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  return useContext(CarrinhoContext);
}