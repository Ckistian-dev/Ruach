from pydantic import BaseModel, Field
from typing import Optional

class ProdutoCreate(BaseModel):
    nome: str
    descricao: Optional[str] = None
    imagem: Optional[str] = None
    valor: float = Field(..., gt=0)
    categoria: Optional[str] = None
    ativo: Optional[bool] = True  # ✅ agora aceita campo 'ativo'
    ordem: Optional[int] = 0      # ✅ agora aceita campo 'ordem'

class ProdutoUpdate(BaseModel):
    nome: Optional[str] = None
    descricao: Optional[str] = None
    imagem: Optional[str] = None
    valor: Optional[float] = Field(None, gt=0)
    categoria: Optional[str] = None

class ProdutoResponse(BaseModel):
    id: int
    nome: str
    descricao: Optional[str]
    imagem: Optional[str]
    valor: float
    ativo: bool
    categoria: Optional[str] = None

    model_config = {
        "from_attributes": True  # Compatível com Pydantic v2
    }

class ProdutoOrdemUpdate(BaseModel):
    id: int
    ordem: int
