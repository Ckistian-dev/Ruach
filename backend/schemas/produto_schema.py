from pydantic import BaseModel
from typing import Optional

class ProdutoCreate(BaseModel):
    nome: str
    descricao: Optional[str] = None
    imagem: Optional[str] = None
    valor: float
    categoria: Optional[str] = None   # 🆕 Adicionado!

class ProdutoUpdate(BaseModel):
    nome: Optional[str] = None
    descricao: Optional[str] = None
    imagem: Optional[str] = None
    valor: Optional[float] = None
    categoria: Optional[str] = None    # 🆕 Adicionado também!

class ProdutoResponse(BaseModel):
    id: int
    nome: str
    descricao: Optional[str]
    imagem: Optional[str]
    valor: float
    ativo: bool
    categoria: Optional[str] = None    # 🆕 Adicionado também!

    class Config:
        from_attributes = True
        
class ProdutoOrdemUpdate(BaseModel):
    id: int
    ordem: int

