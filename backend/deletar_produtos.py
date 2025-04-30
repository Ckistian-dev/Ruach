from sqlalchemy.orm import Session
from database import SessionLocal
from models.produto import Produto

def deletar_todos_os_produtos():
    db: Session = SessionLocal()

    try:
        num_linhas = db.query(Produto).delete()
        db.commit()
        print(f"{num_linhas} produtos deletados com sucesso!")

    except Exception as e:
        db.rollback()
        print(f"Erro ao deletar produtos: {e}")

    finally:
        db.close()

if __name__ == "__main__":
    confirmacao = input("Tem certeza que deseja deletar TODOS os produtos? (sim/não): ").strip().lower()
    if confirmacao == "sim":
        deletar_todos_os_produtos()
    else:
        print("Operação cancelada.")
