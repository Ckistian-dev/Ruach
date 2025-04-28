import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

export default function ModalProdutoAdmin({ produto, onClose }) {
  const [form, setForm] = useState({
    nome: produto?.nome || "",
    valor: produto?.valor || "",
    imagem: produto?.imagem || "",
    categoria: produto?.categoria || "",
  });

  const isEditando = Boolean(produto?.id);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditando) {
        await axios.put(`${import.meta.env.VITE_API_URL}/produtos/${produto.id}`, form);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/produtos`, form);
      }
      onClose();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-96 relative"
      >
        <h2 className="text-2xl font-bold text-center text-[#561c1c] mb-6">
          {isEditando ? "Editar Produto" : "Adicionar Produto"}
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="nome"
            placeholder="Nome"
            value={form.nome}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            name="valor"
            placeholder="Valor"
            value={form.valor}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="imagem"
            placeholder="URL da Imagem"
            value={form.imagem}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="categoria"
            placeholder="Categoria"
            value={form.categoria}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded transition"
          >
            {isEditando ? "Salvar Alterações" : "Cadastrar Produto"}
          </button>
        </form>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition"
        >
          ✖
        </button>
      </motion.div>
    </div>
  );
}
