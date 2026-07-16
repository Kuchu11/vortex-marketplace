from fastapi import FastAPI
from database import engine
import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Marketplace Universitario API")

@app.get("/")
def read_root() -> dict[str, str]:
    return {"status": "online", "message": "API do Marketplace de Economia Circular rodando com sucesso"}