from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from database import get_db
from controllers import produto_controller
from schemas.produto_schema import ProdutoCreate, ProdutoUpdate, ProdutoResponse

router = APIRouter()

@router.post("/produtos", response_model=ProdutoResponse)
def criar_produto(produto: ProdutoCreate, db: Session = Depends(get_db)):
    return produto_controller.criar_produto(db, produto)

@router.get("/produtos", response_model=list[ProdutoResponse])
def listar_produtos_ativos(db: Session = Depends(get_db)):
    return produto_controller.listar_produtos_ativos(db)

@router.get("/produtos/todos", response_model=list[ProdutoResponse])
def listar_todos_produtos(db: Session = Depends(get_db)):
    return produto_controller.listar_todos_produtos(db)

@router.put("/produtos/{produto_id}", response_model=ProdutoResponse)
def atualizar_produto(produto_id: int, produto_update: ProdutoUpdate, db: Session = Depends(get_db)):
    produto = produto_controller.atualizar_produto(db, produto_id, produto_update)
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return produto

@router.patch("/produtos/{produto_id}/ativar", response_model=ProdutoResponse)
def ativar_ou_desativar_produto(produto_id: int, db: Session = Depends(get_db)):
    produto = produto_controller.ativar_ou_desativar_produto(db, produto_id)
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return produto

@router.delete("/produtos/{produto_id}")
def excluir_produto(produto_id: int, db: Session = Depends(get_db)):
    produto = produto_controller.excluir_produto(db, produto_id)
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return {"detail": "Produto excluído com sucesso"}

from schemas.produto_schema import ProdutoOrdemUpdate

@router.post("/produtos/atualizar-ordem")
def atualizar_ordem_produtos(lista_ordem: list[ProdutoOrdemUpdate] = Body(...), db: Session = Depends(get_db)):
    if not lista_ordem:
        raise HTTPException(status_code=400, detail="Lista de produtos vazia")
    return produto_controller.atualizar_ordem_produtos(db, [item.dict() for item in lista_ordem])

