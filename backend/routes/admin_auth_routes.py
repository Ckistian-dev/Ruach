from fastapi import APIRouter, HTTPException
from schemas.admin_auth_schema import AdminAuthRequest
from dotenv import load_dotenv
import os
import secrets

load_dotenv()

router = APIRouter()

# Lê a senha ao carregar o módulo
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")

if not ADMIN_PASSWORD:
    raise RuntimeError("ADMIN_PASSWORD não foi definida no .env")

@router.post("/auth-admin")
def autenticar_admin(auth: AdminAuthRequest) -> dict:
    if secrets.compare_digest(auth.senha, ADMIN_PASSWORD):
        return {
            "status": "sucesso",
            "mensagem": "Autenticado com sucesso",
            "autenticado": True
        }
    else:
        raise HTTPException(status_code=401, detail="Senha incorreta")
