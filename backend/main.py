from fastapi import FastAPI
from routes import produto_routes, admin_auth_routes, janus_routes
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(produto_routes.router)
app.include_router(admin_auth_routes.router)
app.include_router(janus_routes.router)
