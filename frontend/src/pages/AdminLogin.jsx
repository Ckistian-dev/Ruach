import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
    const [senha, setSenha] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const resposta = await fetch('http://localhost:8000/auth-admin', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ senha })
            });

            if (resposta.ok) {
                localStorage.setItem("admin", "true");
                navigate("/admin/produtos");
            } else {
                alert("Senha incorreta!");
            }
        } catch (error) {
            console.error("Erro ao autenticar:", error);
            alert("Erro ao tentar fazer login");
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-red-50 px-4">
            <form
                onSubmit={handleLogin}
                className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col gap-6 animate-fade-in-up"
            >
                <h2 className="text-3xl font-extrabold text-center text-[#561c1c]">
                    Admin Login
                </h2>

                <input
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Digite a senha"
                    className="border-2 border-gray-300 focus:border-red-600 focus:ring-2 focus:ring-red-200 outline-none p-3 w-full rounded-lg text-gray-700 transition-all duration-300"
                />

                <button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold text-lg shadow-md transition-all duration-300"
                >
                    Entrar
                </button>
            </form>
        </div>
    );

}
