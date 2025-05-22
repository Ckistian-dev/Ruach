from pydantic import BaseModel, Extra
from typing import List, Optional

class Endereco(BaseModel):
    cep: Optional[str] = ""
    logradouro: Optional[str] = ""
    numero: Optional[str] = ""
    complemento: Optional[str] = ""
    bairro: Optional[str] = ""
    cidade: Optional[str] = ""
    estado: Optional[str] = ""

class Produto(BaseModel):
    id: Optional[int]
    nome: str
    valor: float

    class Config:
        extra = Extra.ignore

class Form(BaseModel):
    nome: str
    cep: Optional[str] = ""
    rua: Optional[str] = ""
    numero: Optional[str] = ""
    bairro: Optional[str] = ""
    cidade: Optional[str] = ""
    estado: Optional[str] = ""
    complemento: Optional[str] = ""

class PedidoRequest(BaseModel):
    form: Form
    carrinho: List[Produto]
    tipo_entrega: str
    pagamento: str
    frete: Optional[float] = 0.0
