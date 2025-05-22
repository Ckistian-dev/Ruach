from fastapi import APIRouter, HTTPException
from schemas.janus_schema import PedidoRequest
from datetime import datetime
import os
import requests
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()

@router.post("/enviar-pedido")
def enviar_pedido(pedido: PedidoRequest):
    try:
        print("📥 Pedido recebido:")
        print(pedido.model_dump())

        token = os.getenv("JANUS_TOKEN")
        if not token:
            print("❌ Token da Janus não encontrado no .env")
            raise HTTPException(status_code=500, detail="Token não encontrado")

        total = sum(item.valor for item in pedido.carrinho) + (pedido.frete or 0.0)

        # Cliente com ou sem endereço
        cliente = {
            "doc": "000.000.000-00",
            "nome": pedido.form.nome,
            "email": "",
            "telefone": "",
            "endereco": {
                "cep": pedido.form.cep.replace("-", "") or "00000000",
                "logradouro": pedido.form.rua or "Rua do cliente",
                "numero": pedido.form.numero or "000",
                "complemento": pedido.form.complemento or "",
                "bairro": pedido.form.bairro or "Bairro do cliente",
                "cidade": pedido.form.cidade or "Cidade do cliente",
                "estado": pedido.form.estado or "SP"
            }
        }

        # Payload com o token fora do array de atendimentos (correto!)
        payload = {
            "token": token,
            "atendimentos": [
                {
                    "atendimento": {
                        "uid": str(datetime.now().timestamp()).replace('.', ''),  # ou uuid se preferir
                        "datahora": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        "status": "aberto",
                        "empresa": {
                            "id": "52.764.726/0001-02",
                            "razaosocial": "SUMMER ICE SORVETES LTDA"
                        },
                        "cliente": cliente,
                        "produtos": [
                            {
                                "produto": {
                                    "id": str(item.id) if item.id else "00000000",
                                    "descricao": item.nome,
                                    "qtde": 1.0,
                                    "unitário": item.valor,
                                    "total": item.valor,
                                    "opcionais": []
                                }
                            } for item in pedido.carrinho
                        ],
                        "pagamentos": [
                            {
                                "pagamento": {
                                    "id": "00000000",
                                    "descricao": pedido.pagamento,
                                    "valor": total,
                                    "status": "pago",
                                    "carteira": pedido.pagamento
                                }
                            }
                        ],
                        "entregar": pedido.tipo_entrega == "entrega",
                        "retirar": pedido.tipo_entrega == "retirada",
                        "observacoes": [
                            {
                                "observacao": "Pedido via sistema"
                            }
                        ]
                    }
                }
            ]
        }

        print("📤 Payload enviado para Janus:")
        print(payload)

        response = requests.post(
            "https://www.janustecnologia.com.br/atendimento/cadastrar.php",
            json=payload,
            headers={"Content-Type": "application/json"}
        )

        print(f"📬 Resposta da Janus (status {response.status_code}): {response.text}")

        if response.status_code != 200:
            raise HTTPException(status_code=500, detail=f"Erro da API Janus: {response.text}")

        return {"mensagem": "Pedido enviado com sucesso!", "resposta": response.json()}

    except Exception as e:
        print("❌ Erro ao processar pedido:", str(e))
        raise HTTPException(status_code=500, detail=str(e))
