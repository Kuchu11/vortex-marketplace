from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, get_db
import models
import schemas

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Marketplace Universitario API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/anuncios", response_model=schemas.AnuncioResponse, status_code=201)
def create_anuncio(anuncio: schemas.AnuncioCreate, db: Session = Depends(get_db)) -> models.Anuncio:
    db_anuncio = models.Anuncio(
        titulo=anuncio.titulo,
        descricao=anuncio.descricao,
        categoria=anuncio.categoria,
        preco=anuncio.preco,
        imagem_url=anuncio.imagem_url
    )
    db.add(db_anuncio)
    db.commit()
    db.refresh(db_anuncio)
    return db_anuncio

@app.get("/anuncios", response_model=list[schemas.AnuncioResponse])
def read_anuncios(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)) -> list[models.Anuncio]:
    anuncios = db.query(models.Anuncio).offset(skip).limit(limit).all()
    return anuncios