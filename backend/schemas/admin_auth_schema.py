from pydantic import BaseModel

class AdminAuthRequest(BaseModel):
    senha: str
