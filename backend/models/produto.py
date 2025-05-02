from sqlalchemy import Column, Integer, String, Float
from database import Base

class Produto(Base):  # <- isso é essencial
    __tablename__ = "produtos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(255), nullable=False)
    descricao = Column(String(255))
    imagem = Column(String(255))
    valor = Column(Float)
    ativo = Column(Integer)
    categoria = Column(String(255))
