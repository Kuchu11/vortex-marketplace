from fastapi import FastAPI

app = FastAPI(title="Marketplace Universitario API")

@app.get("/")
def read_root() -> dict:
    return {"status": "online", "message": "API do Marketplace de Economia Circular rodando com sucesso"}