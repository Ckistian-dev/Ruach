import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const categorias = [
  {
    id: 1,
    nome: "Lanches",
    imagem: "https://img.freepik.com/premium-photo/hamburger-black-background-food-photography_131346-920.jpg",
  },
  {
    id: 2,
    nome: "Salgados",
    imagem: "https://img.freepik.com/fotos-premium/salgadinhos-fritos-de-festa-dispostos-em-uma-placa-de-aco-inoxidavel-com-fundo-preto_309761-228.jpg",
  },
  {
    id: 3,
    nome: "Bebidas",
    imagem: "https://media.istockphoto.com/id/460246147/pt/foto/conjunto-com-diferentes-bebidas-em-fundo-preto.jpg?s=612x612&w=0&k=20&c=lTDsGw0MqUovhPVpqf5OagrSVP-hh2JDCV8GJaiKAMk=",
  },
  {
    id: 4,
    nome: "Doces",
    imagem: "https://img.freepik.com/fotos-premium/brigadeiro-um-doce-brasileiro-em-um-fundo-preto_306105-2676.jpg",
  },
];

export default function Categorias() {
  const navigate = useNavigate();
  return (
    <section className="py-24 px-8 md:px-24 relative overflow-hidden">
      <motion.div
        className="mb-16"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">
          Explore <span className="text-red-600">Categorias</span> Populares
        </h2>
        <p className="text-gray-600 text-lg md:text-xl">
          Escolha o que mais combina com sua fome!
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {categorias.map((categoria, index) => (
          <motion.div
            key={categoria.id}
            className="relative rounded-3xl overflow-hidden shadow-2xl group transform transition-all duration-500 hover:scale-105"
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <img
              src={categoria.imagem}
              alt={categoria.nome}
              className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-60 transition-all duration-500" />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6">
              <motion.h3
                className="text-3xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.3 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                {categoria.nome}
              </motion.h3>
              <motion.button
                onClick={() => {
                  navigate(`/produtos?categoria=${encodeURIComponent(categoria.nome)}`);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="mt-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold text-md transition-all duration-300 shadow-md"
                whileHover={{ scale: 1.05 }}
              >
                Explorar
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
