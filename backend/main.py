from fastapi import FastAPI

app = FastAPI(title="Marketplace Universitario API")

@app.get("/")
def read_root() -> dict[str, str]:
    return {"status": "online", "message": "API do Marketplace de Economia Circular rodando com sucesso"}