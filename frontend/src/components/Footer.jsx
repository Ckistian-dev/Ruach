export default function Footer() {
  return (
    <footer className="relative z-10 bg-[#1a1a1a] text-white">
      <div className="mx-auto px-6 py-8 flex flex-col items-center justify-center">

        {/* Imagem */}
        <img
          src="https://i.ibb.co/YTbNvRZS/imagem-2025-04-26-222340940-removebg-preview.png"
          alt="Logo Ruach"
          className="h-36 drop-shadow-lg mt-[-30px] mb-[-30px]"
        />

        {/* Direitos Autorais */}
        <p className="text-xs text-gray-400 mt-4 text-center">
          © {new Date().getFullYear()} Ruach - Todos os direitos reservados.
        </p>

      </div>
    </footer>
  );
}
