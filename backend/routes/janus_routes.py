import os
from dotenv import load_dotenv
import requests
from fastapi import APIRouter, HTTPException
from uuid import uuid4
from datetime import datetime

load_dotenv()

router = APIRouter()

@router.post("/enviar-pedido")
def enviar_pedido(form: dict, carrinho: list, tipo_entrega: str, pagamento: str, frete: float = 0.0):
    try:
        token = os.getenv("JANUS_TOKEN")
        if not token:
            raise HTTPException(status_code=500, detail="Token da Janus não configurado no .env")

        total = sum(item["valor"] for item in carrinho) + (frete if tipo_entrega == "entrega" else 0.0)
        uid = str(uuid4())

        payload = {
            "atendimentos": [
                {
                    "atendimento": {
                        "uid": uid,
                        "datahora": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        "status": "aberto",
                        "empresa": {
                            "id": "52.764.726/0001-02",
                            "razaosocial": "SUMMER ICE SORVETES LTDA"
                        },
                        "cliente": {
                            "doc": "000.000.000-00",
                            "nome": form["nome"],
                            "email": "",
                            "telefone": "",
                            "endereco": {
                                "cep": form["cep"].replace("-", ""),
                                "logradouro": form["rua"],
                                "numero": form["numero"],
                                "complemento": form.get("complemento", ""),
                                "bairro": form["bairro"],
                                "cidade": form["cidade"],
                                "estado": form["estado"]
                            }
                        },
                        "produtos": [
                            {
                                "produto": {
                                    "id": str(item.get("id", "00000000")),
                                    "descricao": item["nome"],
                                    "qtde": 1.0,
                                    "unitário": item["valor"],
                                    "total": item["valor"],
                                    "opcionais": []
                                }
                            } for item in carrinho
                        ],
                        "pagamentos": [
                            {
                                "pagamento": {
                                    "id": "00000000",
                                    "descricao": pagamento,
                                    "valor": total,
                                    "status": "pago",
                                    "carteira": pagamento
                                }
                            }
                        ],
                        "entregar": tipo_entrega == "entrega",
                        "retirar": tipo_entrega == "retirada",
                        "observacoes": [
                            {
                                "observacao": "Pedido via sistema FastAPI"
                            }
                        ]
                    }
                }
            ]
        }

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}"
        }

        response = requests.post(
            "https://www.janustecnologia.com.br/atendimento/cadastrar.php",
            json=payload,
            headers=headers
        )

        if response.status_code != 200:
            raise HTTPException(status_code=500, detail=f"Erro na API da Janus: {response.text}")

        return {"mensagem": "Pedido enviado com sucesso!", "retorno_janus": response.json()}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
