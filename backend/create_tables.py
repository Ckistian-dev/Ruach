from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.produto import Produto
from database import Base, engine

# Cria todas as tabelas que ainda não existem
Base.metadata.create_all(bind=engine)

print("✅ Tabelas criadas com sucesso!")
