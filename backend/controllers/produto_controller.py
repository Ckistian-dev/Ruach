from sqlalchemy.orm import Session
from models.produto import Produto
from schemas.produto_schema import ProdutoCreate, ProdutoUpdate

def criar_produto(db: Session, produto: ProdutoCreate):
    db_produto = Produto(**produto.dict())
    db.add(db_produto)
    db.commit()
    db.refresh(db_produto)
    return db_produto

def listar_produtos_ativos(db: Session):
    return db.query(Produto).filter(Produto.ativo == True).all()

def atualizar_produto(db: Session, produto_id: int, produto_update: ProdutoUpdate):
    db_produto = db.query(Produto).filter(Produto.id == produto_id).first()
    if db_produto:
        for var, valor in vars(produto_update).items():
            if valor is not None:
                setattr(db_produto, var, valor)
        db.commit()
        db.refresh(db_produto)
    return db_produto

def ativar_ou_desativar_produto(db: Session, produto_id: int):
    db_produto = db.query(Produto).filter(Produto.id == produto_id).first()
    if db_produto:
        db_produto.ativo = not db_produto.ativo
        db.commit()
        db.refresh(db_produto)
    return db_produto

def excluir_produto(db: Session, produto_id: int):
    produto = db.query(Produto).filter(Produto.id == produto_id).first()
    if not produto:
        return None
    db.delete(produto)
    db.commit()
    return produto

