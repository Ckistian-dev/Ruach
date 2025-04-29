import json
import os
from sqlalchemy.orm import Session
from database import SessionLocal
from models.produto import Produto
from schemas.produto_schema import ProdutoCreate
from controllers import produto_controller

def importar_produtos_do_json(nome_arquivo: str):
    # Descobrir o diretório atual do script
    diretorio_atual = os.path.dirname(os.path.abspath(__file__))
    caminho_completo = os.path.join(diretorio_atual, nome_arquivo)

    # Abre a sessão do banco
    db: Session = SessionLocal()

    try:
        # Lê o arquivo JSON
        with open(caminho_completo, "r", encoding="utf-8") as f:
            produtos_json = json.load(f)

        # Verifica se é uma lista de produtos
        if not isinstance(produtos_json, list):
            raise ValueError("O JSON deve ser uma lista de produtos.")

        produtos_inseridos = []

        for produto_data in produtos_json:
            # Converte o dicionário para ProdutoCreate
            produto_create = ProdutoCreate(**produto_data)
            novo_produto = produto_controller.criar_produto(db, produto_create)
            produtos_inseridos.append(novo_produto)

        print(f"{len(produtos_inseridos)} produtos importados com sucesso!")

    except Exception as e:
        print(f"Erro ao importar produtos: {e}")

    finally:
        db.close()


from importar_produtos import importar_produtos_do_json

importar_produtos_do_json("produtos.json")
