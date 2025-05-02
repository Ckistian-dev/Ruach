import json
import os
from sqlalchemy.orm import Session
from database import SessionLocal
from models.produto import Produto
from schemas.produto_schema import ProdutoCreate
from controllers import produto_controller

def importar_produtos_do_json(nome_arquivo: str):
    # Caminho absoluto do arquivo
    diretorio_atual = os.path.dirname(os.path.abspath(__file__))
    caminho_completo = os.path.join(diretorio_atual, nome_arquivo)

    # Abre a sessão do banco
    db: Session = SessionLocal()

    try:
        # Lê o arquivo JSON
        with open(caminho_completo, "r", encoding="utf-8") as f:
            produtos_json = json.load(f)

        # Verifica se é uma lista
        if not isinstance(produtos_json, list):
            raise ValueError("❌ O JSON deve ser uma lista de produtos.")

        produtos_inseridos = []

        for index, produto_data in enumerate(produtos_json):
            try:
                produto_data["ordem"] = index + 1  # 👈 define ordem crescente
                produto_create = ProdutoCreate(**produto_data)
                novo_produto = produto_controller.criar_produto(db, produto_create)
                produtos_inseridos.append(novo_produto)
            except Exception as erro_individual:
                print(f"⚠️ Erro ao importar produto: {produto_data.get('nome', '[sem nome]')}. Erro: {erro_individual}")

        db.commit()
        print(f"✅ {len(produtos_inseridos)} produto(s) importado(s) com sucesso!")

    except FileNotFoundError:
        print(f"❌ Arquivo '{nome_arquivo}' não encontrado.")
    except json.JSONDecodeError:
        print("❌ Erro ao decodificar o arquivo JSON.")
    except Exception as e:
        print(f"❌ Erro inesperado: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    nome = input("Digite o nome do arquivo JSON (ex: produtos.json): ").strip()
    if nome:
        importar_produtos_do_json(nome)
    else:
        print("❎ Operação cancelada.")
