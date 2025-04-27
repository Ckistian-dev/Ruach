from fastapi import APIRouter, HTTPException
from schemas.admin_auth_schema import AdminAuthRequest
from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter()

@router.post("/auth-admin")
def autenticar_admin(auth: AdminAuthRequest):
    senha_correta = os.getenv("ADMIN_PASSWORD")
    if auth.senha == senha_correta:
        return {"autenticado": True}
    else:
        raise HTTPException(status_code=401, detail="Senha incorreta")
