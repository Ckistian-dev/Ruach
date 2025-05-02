from sqlalchemy import Column, Integer, String, Float, Boolean
from database import Base

class Produto(Base):
    __tablename__ = "produtos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(255), nullable=False)
    descricao = Column(String(255))
    imagem = Column(String(255))
    valor = Column(Float)
    ativo = Column(Boolean, default=True)  # ✅ Corrigido para Boolean
    categoria = Column(String(255))
    ordem = Column(Integer, default=0)  # ✅ Se você quiser ordenar
