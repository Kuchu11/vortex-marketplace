from sqlalchemy import Column, Integer, String, Float
from database import Base

class Anuncio(Base):
    __tablename__ = "anuncios"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, index=True, nullable=False)
    descricao = Column(String, nullable=False)
    categoria = Column(String, index=True, nullable=False)
    preco = Column(Float, nullable=False)
    imagem_url = Column(String, nullable=False)