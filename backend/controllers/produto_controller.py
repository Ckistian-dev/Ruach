from sqlalchemy.orm import Session
from models.produto import Produto
from schemas.produto_schema import ProdutoCreate, ProdutoUpdate

def criar_produto(db: Session, produto: ProdutoCreate) -> Produto:
    db_produto = Produto(**produto.dict())
    db.add(db_produto)
    db.commit()
    db.refresh(db_produto)
    return db_produto

def listar_produtos_ativos(db: Session) -> list[Produto]:
    return db.query(Produto).filter(Produto.ativo == True).order_by(Produto.ordem.asc()).all()

def atualizar_produto(db: Session, produto_id: int, produto_update: ProdutoUpdate) -> Produto | None:
    db_produto = db.query(Produto).filter(Produto.id == produto_id).first()
    if db_produto:
        update_data = produto_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_produto, key, value)
        db.commit()
        db.refresh(db_produto)
    return db_produto

def ativar_ou_desativar_produto(db: Session, produto_id: int) -> Produto | None:
    db_produto = db.query(Produto).filter(Produto.id == produto_id).first()
    if db_produto:
        db_produto.ativo = not db_produto.ativo
        db.commit()
        db.refresh(db_produto)
    return db_produto

def excluir_produto(db: Session, produto_id: int) -> Produto | None:
    produto = db.query(Produto).filter(Produto.id == produto_id).first()
    if produto:
        db.delete(produto)
        db.commit()
    return produto

def atualizar_ordem_produtos(db: Session, lista_ordem: list[dict]) -> dict:
    for item in lista_ordem:
        produto = db.query(Produto).filter(Produto.id == item['id']).first()
        if produto:
            produto.ordem = item['ordem']
    db.commit()
    return {"detail": "Ordem dos produtos atualizada com sucesso"}
