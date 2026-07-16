from pydantic import BaseModel

class AnuncioBase(BaseModel):
    titulo: str
    descricao: str
    categoria: str
    preco: float
    imagem_url: str

class AnuncioCreate(AnuncioBase):
    pass

class AnuncioResponse(AnuncioBase):
    id: int

    class Config:
        from_attributes = True