from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from models.produto import Produto

DATABASE_URL = "sqlite:///./produtos.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
Base = declarative_base()

# 🔥 Aqui, vinculamos o modelo à Base
Produto.__table__.create(bind=engine)

print("✅ Banco de dados e tabela 'produtos' criada com sucesso!")
